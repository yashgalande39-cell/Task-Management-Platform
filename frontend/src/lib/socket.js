import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const s = getSocket();
  if (!s.connected) s.connect();
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};

export const joinProjectRoom = (projectId) => {
  getSocket().emit('join_project', projectId);
};

export const leaveProjectRoom = (projectId) => {
  getSocket().emit('leave_project', projectId);
};

export const emitTaskMove = ({ projectId, taskId, newStatus, movedBy }) => {
  getSocket().emit('task_move', { projectId, taskId, newStatus, movedBy });
};
