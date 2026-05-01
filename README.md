# Team Task Manager

A full-stack web application for managing projects and tasks with role-based access control (Admin/Member).

## Live URL
https://sunny-caring-production-4f3c.up.railway.app

## GitHub Repo
https://github.com/yourname/team-task-manager

## Demo Video
https://your-demo-video-link-here

---

## Tech Stack

- **Frontend:** React + Vite + React Router
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT + bcrypt
- **Deployment:** Railway

---

## Features

- User Signup and Login with JWT authentication
- Role-based access control (Admin and Member)
- Admin can create and delete projects
- Admin can create, assign and delete tasks
- Members can update task status
- Dashboard showing total tasks, in progress, completed and overdue
- Overdue task detection and highlighting
- Clean modern dark UI

---

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running

### 1. Clone the repo
git clone https://github.com/yourname/team-task-manager.git
cd team-task-manager

### 2. Setup Backend
cd backend
npm install

Create a .env file inside backend folder:
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskmanager"
JWT_SECRET="yoursecretkey123"
PORT=5001

Run migrations:
npx prisma migrate dev --name init

Start backend:
npm run dev

### 3. Setup Frontend
cd ../frontend
npm install

Create a .env file inside frontend folder:
VITE_API_URL=http://localhost:5001

Start frontend:
npm run dev

### 4. Open the app
http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login user | Public |
| GET | /api/projects | Get all projects | Member |
| POST | /api/projects | Create project | Admin |
| DELETE | /api/projects/:id | Delete project | Admin |
| GET | /api/tasks | Get all tasks | Member |
| POST | /api/tasks | Create task | Admin |
| PATCH | /api/tasks/:id | Update task status | Member |
| DELETE | /api/tasks/:id | Delete task | Admin |

---

## Project Structure

---

## Screenshots

### Login Page
(Add screenshot here)

### Dashboard
(Add screenshot here)

### Project Tasks
(Add screenshot here)

---

## Role Based Access

| Feature | Admin | Member |
|---------|-------|--------|
| Register/Login | Yes | Yes |
| View Projects | Yes | Yes |
| Create Project | Yes | No |
| Delete Project | Yes | No |
| View Tasks | Yes | Yes |
| Create Task | Yes | No |
| Update Task Status | Yes | Yes |
| Delete Task | Yes | No |

---

## Deployment

This app is deployed on Railway.

- Backend runs on Node.js with PostgreSQL database
- Frontend runs on Vite preview server
- Database migrations run automatically on deploy

## author ASMEET KUMAR YADAV
