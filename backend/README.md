# my-calendar — Backend (MERN)

Express + MongoDB (Mongoose) API for the my-calendar React frontend.

## Setup

```bash
cd backend
npm install
cp .env.example .env     # then edit values
npm run dev              # nodemon, http://localhost:5000
```

Requires a running MongoDB instance (local or Atlas) reachable at `MONGO_URI`.

## Environment

| Variable | Description |
|---|---|
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `CLIENT_ORIGIN` | Allowed CORS origin (e.g. `http://localhost:5173`) |

## API

All non-auth routes require `Authorization: Bearer <token>`.

### Auth — `/api/auth`
- `POST /register` — `{ name, email, password }`
- `POST /login` — `{ email, password }`
- `GET  /me` — current user

### Tasks — `/api/tasks`
- `GET    /` — list (query: `source`, `priority`, `completed`)
- `POST   /` — create
- `GET    /:id` — fetch one
- `PUT    /:id` — update
- `DELETE /:id` — delete
- `PATCH  /:id/toggle` — flip `completed`

Task shape: `{ title, description, source, deadline, priority, completed, link }`

### Meetings — `/api/meetings`
CRUD. Shape: `{ title, organizer, time, duration, recurring, channel }`

### Planner — `/api/planner`
CRUD. Shape: `{ title, bucket, assignedTo, dueDate }`

### Analytics — `/api/analytics`
- `GET /` — totals, source/priority distributions, weekly progress

## Structure

```
backend/
  src/
    config/db.js
    middleware/
    models/       User, Task, Meeting, PlannerItem
    controllers/
    routes/
    server.js
```
