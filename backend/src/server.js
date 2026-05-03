import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Attach io to app so controllers can emit events
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket] User connected: ${socket.id}`);

  // Join a project room for real-time updates
  socket.on('join_project', (projectId) => {
    socket.join(projectId);
    console.log(`[Socket] ${socket.id} joined project room: ${projectId}`);
  });

  socket.on('leave_project', (projectId) => {
    socket.leave(projectId);
  });

  // Client emits this when it moves a task on Kanban
  socket.on('task_move', ({ projectId, taskId, newStatus, movedBy }) => {
    // Broadcast to everyone else in the project room
    socket.to(projectId).emit('task_updated', { taskId, status: newStatus, updatedBy: movedBy });
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 TaskFlow API running on http://localhost:${PORT}`);
  console.log(`📡 Socket.IO listening for real-time events\n`);
});
