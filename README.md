# TaskFlow Dashboard

A professional task and workflow management web application.
Built as a full-stack portfolio project demonstrating real engineering practices.

## Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Vanilla JS (ES6+), HTML5, CSS3    |
| Backend   | Python 3.11, FastAPI              |
| Database  | PostgreSQL 15                     |
| ORM       | SQLAlchemy 2.x                    |
| Container | Docker + Docker Compose           |

## Features

- Create, update, and delete tasks
- Filter tasks by status and priority
- Search tasks by title or description
- Sort tasks by date, priority, or status
- Dashboard with aggregated statistics
- Paginated task list
- Action history log

## Project Structure

See `docs/architecture.md` for full breakdown.

## Quick Start

See `docs/setup.md` for local development instructions.

## Conventions

- Python: `snake_case` for variables, functions, files
- Frontend JS: `camelCase` for variables/functions, kebab-case filenames
- API routes: REST convention — `/api/tasks`, `/api/tasks/{id}`
- SQL: UPPERCASE keywords, `snake_case` table and column names
- Git commits: Conventional Commits — `feat:`, `fix:`, `chore:`, `docs:`

## Status

🚧 In active development