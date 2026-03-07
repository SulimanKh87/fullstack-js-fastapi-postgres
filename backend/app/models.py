# backend/app/models.py

from sqlalchemy import (
    Column, Integer, String, Text,
    Date, DateTime, ForeignKey, func
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from .db import Base

# ============================================================
# Task model — maps to tasks table
# ============================================================
class Task(Base):
    __tablename__ = "tasks"

    id          = Column(Integer,     primary_key=True, index=True)
    title       = Column(String(150), nullable=False)
    description = Column(Text,        nullable=True)
    status      = Column(String(20),  nullable=False, default="pending")
    priority    = Column(String(20),  nullable=False, default="medium")
    due_date    = Column(Date,        nullable=True)
    created_at  = Column(DateTime,    nullable=False, server_default=func.now())
    updated_at  = Column(DateTime,    nullable=False, server_default=func.now(),
                         onupdate=func.now())

    # Relationship to history
    history = relationship(
        "TaskHistory",
        back_populates="task",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<Task id={self.id} title={self.title!r} status={self.status}>"


# ============================================================
# TaskHistory model — maps to task_history table
# ============================================================
class TaskHistory(Base):
    __tablename__ = "task_history"

    id         = Column(Integer,  primary_key=True, index=True)
    task_id    = Column(Integer,  ForeignKey("tasks.id", ondelete="CASCADE"),
                        nullable=False)
    action     = Column(String(20), nullable=False)
    changed_at = Column(DateTime,   nullable=False, server_default=func.now())
    snapshot   = Column(JSONB,      nullable=True)

    # Relationship back to task
    task = relationship("Task", back_populates="history")

    def __repr__(self):
        return f"<TaskHistory task_id={self.task_id} action={self.action}>"