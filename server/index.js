import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
// CORS configuration - allow all in dev, restrict in production
const corsOrigin = process.env.NODE_ENV === 'production' 
  ? [process.env.RAILWAY_STATIC_URL || '*', 'https://*.railway.app', 'https://*.up.railway.app']
  : '*';

const io = new Server(server, {
  cors: { 
    origin: corsOrigin,
    methods: ['GET', 'POST'],
  },
  transports: ['websocket', 'polling'],
  // Reconnection settings
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Health check endpoint for Railway
app.get('/health', (_req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    rooms: rooms.size,
    stats: isDev ? stats : undefined,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Serve static Vite build
app.use(express.static(join(__dirname, '../dist')));
// SPA fallback - serve index.html for all non-file routes
app.use((_req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Room management with reconnection support
const rooms = new Map();
const RECONNECT_GRACE_PERIOD = 30000; // 30 seconds
const MAX_ROOMS = 1000; // Prevent memory exhaustion
const MAX_ROOM_AGE = 24 * 60 * 60 * 1000; // 24 hours max room age
const isDev = process.env.NODE_ENV !== 'production';

// Production-safe logger
function log(...args) {
  if (isDev) console.log(...args);
}
function logError(...args) {
  console.error(...args);
}

// Room statistics for monitoring
let stats = { created: 0, cleaned: 0, rejoined: 0 };

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// Clean up old rooms when at capacity
function cleanupOldRooms() {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [code, room] of rooms.entries()) {
    // Remove rooms older than MAX_ROOM_AGE
    if (now - room.createdAt > MAX_ROOM_AGE) {
      rooms.delete(code);
      cleaned++;
      continue;
    }
    
    // Remove empty rooms beyond grace period
    const hostGone = !room.hostId || (room.hostDisconnectedAt && now - room.hostDisconnectedAt > RECONNECT_GRACE_PERIOD);
    const remoteGone = !room.remoteId || (room.remoteDisconnectedAt && now - room.remoteDisconnectedAt > RECONNECT_GRACE_PERIOD);
    
    if (hostGone && remoteGone) {
      rooms.delete(code);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    stats.cleaned += cleaned;
    log(`Cleaned up ${cleaned} old rooms (${rooms.size} remaining)`);
  }
}

// Clean up empty rooms periodically
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [code, room] of rooms.entries()) {
    const hostDisconnected = room.hostDisconnectedAt && (now - room.hostDisconnectedAt > RECONNECT_GRACE_PERIOD);
    const remoteDisconnected = room.remoteDisconnectedAt && (now - room.remoteDisconnectedAt > RECONNECT_GRACE_PERIOD);
    
    // Delete room if both players are gone beyond grace period
    if ((!room.hostId || hostDisconnected) && (!room.remoteId || remoteDisconnected)) {
      rooms.delete(code);
      cleaned++;
    }
    // Also delete very old rooms
    else if (now - room.createdAt > MAX_ROOM_AGE) {
      rooms.delete(code);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    stats.cleaned += cleaned;
    log(`Room cleanup: ${cleaned} removed, ${rooms.size} active`);
  }
}, 30000); // Check every 30 seconds

io.on('connection', (socket) => {
  log('Client connected:', socket.id);

  socket.on('create-room', () => {
    // Cleanup old rooms if at limit
    if (rooms.size >= MAX_ROOMS) {
      cleanupOldRooms();
    }
    
    let code = generateCode();
    while (rooms.has(code)) code = generateCode();
    
    const now = Date.now();
    rooms.set(code, { 
      hostId: socket.id, 
      remoteId: null,
      hostDisconnectedAt: null,
      remoteDisconnectedAt: null,
      gameState: null,
      createdAt: now,
      lastActivity: now,
    });
    
    stats.created++;
    
    socket.join(code);
    socket.data = { room: code, role: 'host' };
    socket.emit('room-created', { code });
    // Also emit room-joined for the host for consistency
    socket.emit('room-joined', { code, isReconnection: false });
    log(`Room ${code} created by ${socket.id} (total: ${rooms.size})`);
  });

  socket.on('join-room', ({ code }) => {
    const room = rooms.get(code);
    if (!room) { 
      socket.emit('join-error', { message: 'Room not found' }); 
      return; 
    }
    
    // Check if room is full
    // A remote slot is available if:
    // 1. No remoteId set, OR
    // 2. Remote is in grace period (disconnected recently)
    const now = Date.now();
    const remoteInGracePeriod = room.remoteId && room.remoteDisconnectedAt && 
                                (now - room.remoteDisconnectedAt < RECONNECT_GRACE_PERIOD);
    const remoteSlotAvailable = !room.remoteId || remoteInGracePeriod;
    
    if (!remoteSlotAvailable) { 
      socket.emit('join-error', { message: 'Room is full' }); 
      return; 
    }
    
    room.remoteId = socket.id;
    room.remoteDisconnectedAt = null; // Clear disconnect time
    socket.join(code);
    socket.data = { room: code, role: 'remote' };
    
    // Determine if this is a reconnection (game already in progress)
    const isReconnection = !!room.gameState;
    socket.emit('room-joined', { code, isReconnection });
    
    // Notify host
    socket.to(code).emit('player-joined', { isReconnection });
    
    // If there's existing game state, send it to the joining player
    if (room.gameState) {
      socket.emit('state-update', room.gameState);
    }
    
    log(`${socket.id} joined room ${code}${isReconnection ? ' (reconnection)' : ''}`);
  });

  socket.on('rejoin-room', ({ code, role }) => {
    const room = rooms.get(code);
    if (!room) {
      socket.emit('rejoin-error', { message: 'Room no longer exists' });
      return;
    }

    const now = Date.now();
    
    if (role === 'host') {
      // Check if host slot is available (within grace period)
      if (room.hostId && (!room.hostDisconnectedAt || now - room.hostDisconnectedAt > RECONNECT_GRACE_PERIOD)) {
        socket.emit('rejoin-error', { message: 'Host slot no longer available' });
        return;
      }
      room.hostId = socket.id;
      room.hostDisconnectedAt = null;
      socket.data = { room: code, role: 'host' };
    } else {
      // Check if remote slot is available
      if (room.remoteId && (!room.remoteDisconnectedAt || now - room.remoteDisconnectedAt > RECONNECT_GRACE_PERIOD)) {
        socket.emit('rejoin-error', { message: 'Room slot no longer available' });
        return;
      }
      room.remoteId = socket.id;
      room.remoteDisconnectedAt = null;
      socket.data = { room: code, role: 'remote' };
    }

    socket.join(code);
    socket.emit('room-joined', { code, isReconnection: true });
    
    // Notify other player
    socket.to(code).emit('player-rejoined', { role });
    
    // Send current game state if available
    if (room.gameState) {
      socket.emit('state-update', room.gameState);
    }
    
    stats.rejoined++;
    log(`${socket.id} rejoined room ${code} as ${role} (total rejoins: ${stats.rejoined})`);
  });

  // Relay: host → remote
  socket.on('state-update', (data) => {
    const code = socket.data?.room;
    if (!code) return;
    
    // Store latest state for reconnection
    const room = rooms.get(code);
    if (room) {
      room.gameState = data;
      room.lastActivity = Date.now();
    }
    
    socket.to(code).emit('state-update', data);
  });

  // Relay: remote → host (player actions)
  socket.on('remote-action', (data) => {
    const code = socket.data?.room;
    if (!code) return;
    socket.to(code).emit('remote-action', data);
  });

  // Relay: host → remote (game start config)
  socket.on('game-start', (data) => {
    const code = socket.data?.room;
    if (!code) return;
    socket.to(code).emit('game-start', data);
  });

  socket.on('disconnect', (reason) => {
    log(`Client disconnected: ${socket.id}, reason: ${reason}`);
    
    const code = socket.data?.room;
    const role = socket.data?.role;
    if (!code || !role) return;
    
    const room = rooms.get(code);
    if (!room) return;

    const now = Date.now();

    if (role === 'host') {
      room.hostDisconnectedAt = now;
      socket.to(code).emit('host-disconnected', { message: 'Host disconnected. Waiting for reconnection...' });
      log(`Host disconnected from room ${code}, grace period started`);
    } else {
      room.remoteDisconnectedAt = now;
      socket.to(code).emit('remote-disconnected', { message: 'Opponent disconnected. Waiting for reconnection...' });
      log(`Remote disconnected from room ${code}, grace period started`);
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  log(`Titanfall Chronicles server running on port ${PORT}`);
  log(`Reconnection grace period: ${RECONNECT_GRACE_PERIOD}ms`);
  if (isDev) log('Running in DEVELOPMENT mode');
  else log('Running in PRODUCTION mode');
});
