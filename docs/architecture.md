# Architecture — TaskFlow Dashboard

## Purpose

TaskFlow is a task management system for small teams or individuals.
Users can create tasks, track progress by status, search and filter,
and view aggregated statistics on a dashboard.

---

## System Layers
```
[ Browser — Vanilla JS ES6+ ]
         │
         │  HTTP fetch() — JSON
         ▼
[ FastAPI Backend — Python 3.11 ]
         │
         │  SQLAlchemy ORM
         ▼
[ PostgreSQL 15 — Docker container ]
```

---

## Request Flow — Create Task
```
1. User fills form on tasks.html
2. tasks.js handleFormSubmit() validates input via utils.js
3. TaskAPI.create() in api.js sends POST /api/tasks
4. FastAPI route in routes/tasks.py receives request
5. Pydantic schema in schemas.py validates the request body
6. crud.py runs INSERT via SQLAlchemy ORM
7. db.py session commits to PostgreSQL
8. PostgreSQL triggers updated_at via procedure
9. Response returns created task as JSON
10. ui.js renderTaskCard() adds the card to the DOM
```

---

## Request Flow — Load Tasks with Filters
```
1. User changes filter dropdown or types in search box
2. tasks.js filterTasks() updates page state object
3. TaskAPI.getAll() builds query string via buildQueryString()
4. GET /api/tasks?status=pending&priority=high&search=api&sort=created_at_desc&page=1&limit=10
5. FastAPI route applies WHERE clauses, ORDER BY, LIMIT/OFFSET
6. Returns { tasks: [...], total: 12, page: 1, total_pages: 2 }
7. renderTaskList() renders task cards
8. renderPagination() renders page buttons
```

---

## Frontend Pages

| Page         | File                  | JS Module       | Purpose                          |
|--------------|-----------------------|-----------------|----------------------------------|
| Dashboard    | `index.html`          | `dashboard.js`  | Stats overview, recent tasks     |
| Task Manager | `tasks.html`          | `tasks.js`      | Full CRUD, filter, search, sort  |

---

## Frontend JS Modules

| File          | Responsibility                                         |
|---------------|--------------------------------------------------------|
| `api.js`      | All HTTP calls — TaskAPI and HistoryAPI classes        |
| `tasks.js`    | Task page state, form handling, filter, pagination     |
| `dashboard.js`| Stats loading, recent tasks rendering                  |
| `ui.js`       | Pure DOM rendering — cards, stats, pagination, errors  |
| `utils.js`    | Formatting, validation, DOM helpers, query builder     |
| `main.js`     | Shared init — active nav link                          |

---

## API Endpoints

### Tasks

| Method | Endpoint           | Query Params                                      | Description                  |
|--------|--------------------|---------------------------------------------------|------------------------------|
| GET    | `/api/tasks`       | `page, limit, status, priority, search, sort`     | List tasks with filters      |
| POST   | `/api/tasks`       | —                                                 | Create a new task            |
| GET    | `/api/tasks/stats` | —                                                 | Dashboard aggregated stats   |
| GET    | `/api/tasks/{id}`  | —                                                 | Get single task by ID        |
| PUT    | `/api/tasks/{id}`  | —                                                 | Update task fields           |
| DELETE | `/api/tasks/{id}`  | —                                                 | Delete a task                |

### History

| Method | Endpoint      | Query Params | Description              |
|--------|---------------|--------------|--------------------------|
| GET    | `/api/history`| `task_id`    | Get action history log   |

---

### GET `/api/tasks` — Query Parameters

| Param      | Type   | Default          | Values                                              |
|------------|--------|------------------|-----------------------------------------------------|
| `page`     | int    | `1`              | Any positive integer                                |
| `limit`    | int    | `10`             | `1–100`                                             |
| `status`   | string | `''` (all)       | `pending`, `in_progress`, `completed`               |
| `priority` | string | `''` (all)       | `low`, `medium`, `high`                             |
| `search`   | string | `''` (none)      | Any keyword — searches title and description        |
| `sort`     | string | `created_at_desc`| `created_at_desc`, `created_at_asc`, `due_date_asc`, `priority_desc` |

---

### GET `/api/tasks/stats` — Response
```json
{
    "total_tasks":    12,
    "pending":         8,
    "in_progress":     2,
    "completed":       2,
    "high_priority":   5,
    "overdue":         1
}
```

---

### POST `/api/tasks` — Request Body
```json
{
    "title":       "Build FastAPI backend",
    "description": "Create routes, models, schemas, CRUD",
    "status":      "pending",
    "priority":    "high",
    "due_date":    "2025-01-15"
}
```

### POST `/api/tasks` — Response
```json
{
    "id":          3,
    "title":       "Build FastAPI backend",
    "description": "Create routes, models, schemas, CRUD",
    "status":      "pending",
    "priority":    "high",
    "due_date":    "2025-01-15",
    "created_at":  "2025-01-07T10:22:00",
    "updated_at":  "2025-01-07T10:22:00"
}
```

---

## Database Schema

### `tasks`
```sql
CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(150)  NOT NULL,
    description TEXT,
    status      VARCHAR(20)   NOT NULL DEFAULT 'pending',
    priority    VARCHAR(20)   NOT NULL DEFAULT 'medium',
    due_date    DATE,
    created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_status
        CHECK (status IN ('pending', 'in_progress', 'completed')),
    CONSTRAINT chk_priority
        CHECK (priority IN ('low', 'medium', 'high')),
    CONSTRAINT chk_title_length
        CHECK (LENGTH(TRIM(title)) > 0)
);
```

### `task_history`
```sql
CREATE TABLE task_history (
    id         SERIAL PRIMARY KEY,
    task_id    INT          NOT NULL,
    action     VARCHAR(20)  NOT NULL,
    changed_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    snapshot   JSONB,

    CONSTRAINT chk_action
        CHECK (action IN ('created', 'updated', 'deleted')),
    CONSTRAINT fk_task
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
```

### Indexes
```sql
CREATE INDEX idx_tasks_status     ON tasks(status);
CREATE INDEX idx_tasks_priority   ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_history_task_id  ON task_history(task_id);
```

---

## Future Improvements

- JWT authentication and multi-user support
- Task assignment to users
- File attachments per task
- Email notifications on due date
- CSV export
- Dark / light mode toggle
- Unit tests with pytest and Jest