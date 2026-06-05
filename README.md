# Task Manager - MERN Stack

A full-stack task management application built with MongoDB, Express.js, React.js, and Node.js.

## Features

- User registration & login with JWT authentication
- Create, read, update, and delete tasks
- Mark tasks as completed/pending with toggle
- Search tasks by title or description
- Filter tasks by status (pending/completed)
- Pagination (8 tasks per page)
- Responsive dark-themed UI
- Protected routes with middleware
- Form validation (client & server side)

## Prerequisites

- Node.js >= 18
- MongoDB running locally on port 27017 (or update MONGO_URI in backend/.env)

## Setup

### 1. Clone and navigate

```bash
cd task-manager
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Server starts on http://localhost:5000

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

App opens at http://localhost:3000

## API Endpoints

| Method | Endpoint             | Description          | Auth |
|--------|----------------------|----------------------|------|
| POST   | /api/auth/register   | Register user        | No   |
| POST   | /api/auth/login      | Login user           | No   |
| GET    | /api/auth/me         | Get current user     | Yes  |
| GET    | /api/tasks           | List tasks (paginated, search, filter) | Yes |
| POST   | /api/tasks           | Create task          | Yes  |
| PUT    | /api/tasks/:id       | Update task          | Yes  |
| DELETE | /api/tasks/:id       | Delete task          | Yes  |
| PATCH  | /api/tasks/:id/toggle| Toggle task status   | Yes  |

## Tech Stack

- **Frontend:** React 18, React Router 6, Axios
- **Backend:** Node.js, Express.js, Mongoose, JWT, bcryptjs
- **Database:** MongoDB
