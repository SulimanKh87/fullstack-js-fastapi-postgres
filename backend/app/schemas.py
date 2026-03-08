# backend/app/schemas.py

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, datetime

# ============================================================
# Allowed values
# ============================================================
VALID_STATUSES = {"pending", "in_progress", "completed"}
VALID_PRIORITIES = {"low", "medium", "high"}
VALID_SORTS = {
    "created_at_desc",
    "created_at_asc",
    "due_date_asc",
    "priority_desc",
}

# ============================================================
# Task Schemas
# ============================================================


class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = Field(None)
    status: str = Field("pending")
    priority: str = Field("medium")
    due_date: Optional[date] = Field(None)

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {VALID_STATUSES}")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v not in VALID_PRIORITIES:
            raise ValueError(f"priority must be one of {VALID_PRIORITIES}")
        return v

    @field_validator("title")
    @classmethod
    def validate_title(cls, v):
        if not v.strip():
            raise ValueError("title cannot be blank")
        return v.strip()


# Used for POST /api/tasks
class TaskCreate(TaskBase):
    pass


# Used for PUT /api/tasks/{id}
# All fields optional on update
class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=150)
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[date] = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, v):
        if v is not None and v not in VALID_STATUSES:
            raise ValueError(f"status must be one of {VALID_STATUSES}")
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v):
        if v is not None and v not in VALID_PRIORITIES:
            raise ValueError(f"priority must be one of {VALID_PRIORITIES}")
        return v


# Used for all responses — includes DB fields
class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


# ============================================================
# Paginated task list response
# ============================================================
class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    total: int
    page: int
    total_pages: int


# ============================================================
# Dashboard statistics response
# ============================================================
class TaskStatsResponse(BaseModel):
    total_tasks: int
    pending: int
    in_progress: int
    completed: int
    high_priority: int
    overdue: int


# ============================================================
# History Schemas
# ============================================================
class HistoryResponse(BaseModel):
    id: int
    task_id: int
    action: str
    changed_at: datetime
    snapshot: Optional[dict] = None

    model_config = {"from_attributes": True}
