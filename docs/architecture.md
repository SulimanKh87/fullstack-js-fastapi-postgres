# Architecture — TaskFlow Dashboard

## Purpose

TaskFlow is a task management system for small teams or individuals.
It allows users to create and manage tasks, track progress by status,
and view summary statistics on a dashboard.

The goal is to demonstrate a clean, layered full-stack architecture
with separation of concerns at every level.

---

## System Layers
```
[ Browser ]
    │  HTTP requests (fetch API)
    ▼
[ FastAPI Backend — Python ]
    │  SQLAlchemy ORM queries
    ▼
[ PostgreSQL Database ]
```

---

## Frontend Pages

| Page             | File                    | Purpose                                      |
|------------------|-------------------------|----------------------------------------------|
| Home / Landing   | `frontend/index.html`   | App entry point, navigation                  |
| Task Manager     | `frontend/tasks.html`   | Full CRUD interface, filter, search, sort     |
| Dashboard        | `frontend/dashboard.html` | Statistics, charts, task summaries          |

---

## Backend API Endpoints

| Method | Route                    | Description                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/api/tasks`             | List tasks — supports filter, sort, search, pagination |
| POST   | `/api/tasks`             | Create a new task                    |
| GET    | `/api/tasks/{id}`        | Get a single task by ID              |
| PUT    | `/api/tasks/{id}`        | Update task fields                   |
| DELETE | `/api/tasks/{id}`        | Delete a task                        |
| GET    | `/api/tasks/stats`       | Aggregated dashboard statistics      |
| GET    | `/api/history`           | Retrieve action history log          |

---

## Database Tables

### `tasks`
| Column       | Type        | Notes                                    |
|--------------|-------------|------------------------------------------|
| id           | SERIAL PK   | Auto-increment primary key               |
| title        | VARCHAR(255)| Required, task name                      |
| description  | TEXT        | Optional details                         |
| status       | VARCHAR(50) | `todo`, `in_progress`, `done`            |
| priority     | VARCHAR(50) | `low`, `medium`, `high`                  |
| due_date     | DATE        | Optional deadline                        |
| created_at   | TIMESTAMP   | Auto-set on insert                       |
| updated_at   | TIMESTAMP   | Auto-updated on change                   |

### `task_history`
| Column       | Type        | Notes                                    |
|--------------|-------------|------------------------------------------|
| id           | SERIAL PK   | Auto-increment                           |
| task_id      | INT FK      | References `tasks.id`                    |
| action       | VARCHAR(50) | `created`, `updated`, `deleted`          |
| changed_by   | VARCHAR(100)| Username or system label                 |
| changed_at   | TIMESTAMP   | Auto-set on insert                       |
| snapshot     | JSONB       | State of task at time of action          |

---

## Request Flow Example — Create Task
```
1. User fills form on tasks.html
2. tasks.js calls api.js → POST /api/tasks
3. FastAPI route in routes/tasks.py receives request
4. Pydantic schema in schemas.py validates the body
5. crud.py runs INSERT via SQLAlchemy
6. db.py session commits to PostgreSQL
7. Response returns new task object as JSON
8. ui.js renders new task card in the DOM
```

---

## Future Improvements

- User authentication with JWT tokens
- Multi-user support with task assignment
- File attachments per task
- Email notifications on due date
- Export tasks to CSV
- Dark mode toggle