# backend/app/db.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


# ============================================================
# Settings — reads from backend/.env
# ============================================================
class Settings(BaseSettings):
    database_url: str = ""
    app_env: str = "development"
    app_port: int = 8000
    secret_key: str = "dev-secret"
    allowed_origins: str = "http://localhost:5500,http://127.0.0.1:5500"

    model_config = {
        "env_file": ".env",
        "extra": "ignore",  # ignore unknown fields in .env
    }


settings = Settings()

# ============================================================
# Engine
# ============================================================
engine = create_engine(
    settings.database_url,
    echo=settings.app_env == "development",
    pool_pre_ping=True,
)

# ============================================================
# Session factory
# ============================================================
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


# ============================================================
# Base class for ORM models
# ============================================================
class Base(DeclarativeBase):
    pass


# ============================================================
# Dependency — yields DB session per request
# ============================================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
