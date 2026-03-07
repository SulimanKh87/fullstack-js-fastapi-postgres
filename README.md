# TaskFlow Dashboard

A professional task and workflow management web application.
Built as a full-stack portfolio project demonstrating real engineering practices.

## Tech Stack

| Layer     | Technology                      |
|-----------|---------------------------------|
| Frontend  | Vanilla JS ES6+, HTML5, CSS3    |
| Backend   | Python 3.11, FastAPI            |
| Database  | PostgreSQL 15                   |
| ORM       | SQLAlchemy 2.x                  |
| Container | Docker + Docker Compose         |

---

## Features

- Create, update, and delete tasks
- Filter tasks by status and priority
- Search tasks by title or description
- Sort by date, priority, or due date
- Dashboard with aggregated statistics
- Paginated task list
- Overdue task detection
- Action history log per task

---

## Project Structure
```
fullstack-js-fastapi-postgres/
├── backend/
│   └── app/
│       ├── main.py         # FastAPI entry point
│       ├── db.py           # Database session
│       ├── models.py       # SQLAlchemy ORM models
│       ├── schemas.py      # Pydantic request/response models
│       ├── crud.py         # Database operations
│       └── routes/
│           └── tasks.py    # API route handlers
├── database/
│   ├── schema.sql          # Tables, constraints, indexes
│   ├── seed.sql            # Sample data
│   └── queries.sql         # Reference SQL queries
├── frontend/
│   ├── index.html          # Dashboard page
│   ├── tasks.html          # Task manager page
│   ├── css/styles.css      # Dark theme design system
│   └── js/
│       ├── api.js          # API client (TaskAPI, HistoryAPI)
│       ├── tasks.js        # Task CRUD, filter, search, sort
│       ├── dashboard.js    # Stats and recent tasks
│       ├── ui.js           # DOM rendering utilities
│       └── utils.js        # Helpers, validation, formatting
├── docs/
│   ├── architecture.md     # System design and data flow
│   ├── setup.md            # Local dev instructions
│   └── api.md              # API endpoint reference
└── docker-compose.yml      # PostgreSQL service
```

---

## Quick Start

See `docs/setup.md` for full instructions.
```bash
# 1. Start database
docker compose up -d

# 2. Start backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 3. Open frontend
# Open frontend/index.html with VS Code Live Server
```

---

## Git Commit Convention

This project follows Conventional Commits:

| Prefix     | When to use                              |
|------------|------------------------------------------|
| `feat:`    | New feature added                        |
| `fix:`     | Bug fix                                  |
| `chore:`   | Config, tooling, non-logic changes       |
| `docs:`    | Documentation only                       |
| `refactor:`| Code restructure, no behavior change     |
| `test:`    | Adding or updating tests                 |
| `style:`   | CSS or formatting only                   |

Example commits from this project:
```
feat(database): add tasks schema with constraints and indexes
feat(frontend): add ES6+ API client with async/await
feat(frontend): add pagination, search, sort, and filter
chore(docker): add postgres service with auto-init volumes
docs(project): add architecture and API documentation
```

---

## Coding Conventions

| Layer      | Convention                                      |
|------------|-------------------------------------------------|
| Python     | `snake_case` variables, functions, files        |
| JavaScript | `camelCase` variables/functions, kebab filenames|
| CSS        | BEM naming — `.block__element--modifier`        |
| SQL        | UPPERCASE keywords, `snake_case` identifiers    |
| API routes | REST — `/api/tasks`, `/api/tasks/{id}`          |
| Git        | Conventional Commits with scope                 |

---

## Status

✅ Milestone 0 — Project structure and configuration  
✅ Milestone 1 — Architecture and setup documentation  
✅ Milestone 2 — PostgreSQL schema, seed, and queries  
✅ Milestone 3 — ES6+ JavaScript layer  
✅ Milestone 4 — Frontend HTML and CSS  
✅ Milestone 5 — Advanced JS: pagination, search, sort, stats  
✅ Milestone 6 — Professional practices and documentation  
⏳ Milestone 7 — FastAPI backend: models, schemas, CRUD  
⏳ Milestone 8 — API routes and integration  
⏳ Milestone 9 — End to end testing