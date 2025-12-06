# Student Management Project

## Prerequisites
- Node.js
- Docker (for MongoDB)

## Setup & Run

### 1. Database (MongoDB)
Make sure Docker is running, then start the database:
```bash
cd backend
docker compose up -d
```

### 2. Backend
Open a terminal:
```bash
cd backend
npm install
npm run dev
```
Server will run on `http://localhost:5000`.

### 3. Frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
App will run on `http://localhost:5173` (or similar).

## Troubleshooting
- If you don't have Docker, you can install MongoDB locally and ensure it's running on port 27017.
