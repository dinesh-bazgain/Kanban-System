# CRUD Operation Fixes - Kanban System

## Issues Found and Fixed

### 1. **Database Connection Timing Issue** (CRITICAL)

**Problem:** The `typeOrmConfig` object was defined at the module level, executing BEFORE `ConfigModule.forRoot()` loaded environment variables. This meant `process.env.DB_HOST`, `process.env.DB_USER`, etc., were all `undefined` when TypeORM tried to connect.

**Solution:** Refactored `app.module.ts` to use `TypeOrmModule.forRootAsync()` with a `useFactory` function that executes AFTER ConfigModule loads the .env file. Now environment variables are properly loaded before database connection is attempted.

**File Modified:** `backend/src/app.module.ts`

### 2. **Incorrect Backend Port in .env**

**Problem:** The `.env` file had `PORT=5174`, which is the frontend development port. This caused the backend server to run on the wrong port, making it inaccessible to the frontend.

**Solution:** Changed `PORT=5174` to `PORT=4000` (standard NestJS backend port).

**File Modified:** `.env`

### 3. **Missing Frontend API URL Configuration**

**Problem:** The frontend's `api.ts` file uses `VITE_API_URL` environment variable but it wasn't set in `.env`. This caused the frontend to default to `http://localhost:5174` (its own port) instead of the backend at `http://localhost:4000`.

**Solution:** Added `VITE_API_URL=http://localhost:4000` to the `.env` file.

**File Modified:** `.env`

## Current Architecture

### Backend (NestJS) - Port 4000

- **Endpoints:**

  - `GET /tasks` - Fetch all tasks
  - `POST /tasks` - Create new task
  - `PATCH /tasks/:id` - Update task (title or columnId)
  - `DELETE /tasks/:id` - Delete task
  - `GET /tasks/:id` - Fetch single task

- **Database:** PostgreSQL with automatic schema synchronization
- **CORS:** Enabled for all origins
- **Auto-loading:** TypeORM entities auto-loaded from TasksModule

### Frontend (React + Vite) - Port 5174

- **CRUD Operations:**
  - Uses `createTaskApi()` to create tasks via POST request
  - Uses `updateTaskApi()` to move tasks between columns
  - Uses `deleteTaskApi()` to remove tasks
  - Uses `fetchTasks()` to load all tasks on component mount

### Database (PostgreSQL)

- **Host:** localhost
- **Port:** 5432
- **Database:** kanban
- **Credentials:** postgres/password
- **Table:** tasks (auto-created via TypeORM synchronization)

## How to Test

1. **Ensure PostgreSQL is running:**

   ```bash
   # On macOS with brew
   brew services start postgresql
   ```

2. **Start Backend:**

   ```bash
   cd backend
   npm run start:dev
   # Backend should connect to DB and listen on port 4000
   ```

3. **Start Frontend (in new terminal):**

   ```bash
   npm run dev
   # Frontend runs on http://localhost:5174
   # API calls go to http://localhost:4000/tasks
   ```

4. **Test CRUD Operations:**
   - Add task: Create a task in any column
   - Move task: Drag task between columns (should update in DB)
   - Edit task: Edit task title (should update in DB)
   - Delete task: Remove task (should delete from DB)

## Verification Checklist

- ✅ Environment variables loaded BEFORE database connection
- ✅ Backend running on correct port (4000)
- ✅ Frontend pointing to correct backend URL (http://localhost:4000)
- ✅ CORS enabled for cross-origin requests
- ✅ Database entities auto-load from TasksModule
- ✅ TypeORM synchronization enabled for automatic table creation

## Environment Variables (.env)

```dotenv
# Frontend API URL
VITE_API_URL=http://localhost:4000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=kanban

# Backend Server Port
PORT=4000
```

All CRUD operations should now work seamlessly between frontend and backend!
