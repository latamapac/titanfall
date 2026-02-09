import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
});

// Serve static Vite build
app.use(express.static(join(__dirname, '../dist')));
// SPA fallback - serve index.html for all non-file routes
app.use((_req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

// Room management
const rooms = new Map();

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create-room', () => {
    let code = generateCode();
    while (rooms.has(code)) code = generateCode();
    rooms.set(code, { hostId: socket.id, remoteId: null });
    socket.join(code);
    socket.data = { room: code, role: 'host' };
    socket.emit('room-created', { code });
    console.log(`Room ${code} created by ${socket.id}`);
  });

  socket.on('join-room', ({ code }) => {
    const room = rooms.get(code);
    if (!room) { socket.emit('join-error', { message: 'Room not found' }); return; }
    if (room.remoteId) { socket.emit('join-error', { message: 'Room is full' }); return; }
    room.remoteId = socket.id;
    socket.join(code);
    socket.data = { room: code, role: 'remote' };
    socket.emit('room-joined', { code });
    // Notify host
    socket.to(code).emit('player-joined');
    console.log(`${socket.id} joined room ${code}`);
  });

  // Relay: host → remote
  socket.on('state-update', (data) => {
    const code = socket.data?.room;
    if (!code) return;
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

  socket.on('disconnect', () => {
    const code = socket.data?.room;
    if (!code) return;
    socket.to(code).emit('player-disconnected');
    rooms.delete(code);
    console.log(`Room ${code} closed (${socket.id} disconnected)`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Titanfall Chronicles server running on port ${PORT}`);
});
