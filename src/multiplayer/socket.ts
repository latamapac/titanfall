import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url = import.meta.env.PROD
      ? window.location.origin
      : 'http://localhost:3001';
    
    socket = io(url, { 
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    // Handle reconnection
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
      
      // Check if we should rejoin a room
      const savedRoom = sessionStorage.getItem('mpRoom');
      const savedRole = sessionStorage.getItem('mpRole');
      
      if (savedRoom && savedRole && socket) {
        console.log(`Attempting to rejoin room ${savedRoom} as ${savedRole}`);
        socket.emit('rejoin-room', { code: savedRoom, role: savedRole });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  // Clear session storage
  sessionStorage.removeItem('mpRoom');
  sessionStorage.removeItem('mpRole');
}

export function saveRoomSession(code: string, role: 'host' | 'remote') {
  sessionStorage.setItem('mpRoom', code);
  sessionStorage.setItem('mpRole', role);
}

export function clearRoomSession() {
  sessionStorage.removeItem('mpRoom');
  sessionStorage.removeItem('mpRole');
}

export function getSavedRoomSession(): { code: string | null; role: 'host' | 'remote' | null } {
  return {
    code: sessionStorage.getItem('mpRoom'),
    role: sessionStorage.getItem('mpRole') as 'host' | 'remote' | null,
  };
}
