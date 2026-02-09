import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url = import.meta.env.PROD
      ? window.location.origin
      : 'http://localhost:3001';
    socket = io(url, { transports: ['websocket', 'polling'] });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
