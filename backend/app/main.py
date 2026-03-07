# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import tasks

# ============================================================
# App instance
# ============================================================
app = FastAPI(
    title="TaskFlow API",
    description="Task management REST API built with FastAPI and PostgreSQL",
    version="1.0.0",
)

# ============================================================
# CORS — allow frontend on Live Server to call the API
# ============================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# Routers
# ============================================================
app.include_router(tasks.router)


# ============================================================
# Health check
# ============================================================
@app.get("/health")
def health():
    return {"status": "ok", "service": "taskflow-api"}
