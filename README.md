# Task Management Platform

A world-class, production-grade Full-Stack Task Management Web Application that resembles modern startup products.

## Features
- Multi-tenant architecture (Workspaces & Organizations)
- Role-Based Access Control (RBAC)
- Real-time Collaboration (Socket.IO)
- Advanced Task Management (Kanban, Subtasks, Dependencies)
- Real-time Dashboard with Analytics
- Highly secure and performant API

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, TanStack Query, Zustand/Redux
- **Backend**: Node.js, Express, MongoDB, Mongoose, Socket.IO, Redis
- **DevOps**: Docker, Docker Compose, Nginx

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Running with Docker

1. Clone the repository
2. Run `docker-compose up --build`
3. Access Frontend at `http://localhost:5173`
4. Access Backend API at `http://localhost:5000`

### Local Development

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
