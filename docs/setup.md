# Local Setup Guide

## Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Docker + Docker Compose (optional but recommended)
- A code editor (VS Code recommended)
- Live Server extension for VS Code (frontend)

---

## 1. Clone the Repository
```bash
git clone https://github.com/your-username/taskflow-dashboard.git
cd taskflow-dashboard
```

---

## 2. Start PostgreSQL

### Option A — Docker (recommended)
```bash
docker-compose up -d
```

This starts a PostgreSQL container on port `5432`.

### Option B — Local PostgreSQL

Ensure PostgreSQL is running, then create the database:
```sql
CREATE DATABASE taskflow_db;
```

---

## 3. Initialize the Database
```bash
psql -U postgres -d taskflow_db -f database/schema.sql
psql -U postgres -d taskflow_db -f database/seed.sql
```

---

## 4. Configure Environment Variables
```bash
cd backend
cp .env.example .env
```

Edit `.env` and set your actual `DATABASE_URL` and other values.

---

## 5. Run the Backend
```bash
cd backend
python -m venv venv

# Activate on Mac/Linux:
source venv/bin/activate

# Activate on Windows:
venv\Scripts\activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`  
API docs (auto-generated): `http://localhost:8000/docs`

---

## 6. Run the Frontend

Open `frontend/index.html` with VS Code Live Server.  
Default address: `http://127.0.0.1:5500`

Make sure `ALLOWED_ORIGINS` in `.env` includes this address.

---

## Environment Variables Reference


| Variable         | Description                            | Example                                         |
|------------------|----------------------------------------|-------------------------------------------------|
| `DATABASE_URL`   | Full PostgreSQL connection string      | `postgresql://postgres:pass@localhost:5432/taskflow_db` |
| `APP_ENV`        | Runtime environment                    | `development` or `production`                   |
| `APP_PORT`       | Port FastAPI listens on                | `8000`                                          |
| `SECRET_KEY`     | App secret for signing tokens (future) | Any long random string                          |
| `ALLOWED_ORIGINS`| CORS whitelist for frontend origins    | `http://127.0.0.1:5500`                         |
                      |

---

## Seed Data

The seed file `database/seed.sql` inserts 10 sample tasks across different
statuses and priorities so you can test the UI immediately without manual entry.