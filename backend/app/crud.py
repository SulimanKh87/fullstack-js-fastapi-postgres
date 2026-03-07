# backend/app/crud.py

from sqlalchemy import func, case, and_
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional

from .models import Task, TaskHistory
from .schemas import TaskCreate, TaskUpdate


# ============================================================
# Helper — build snapshot dict from task object
# Used when logging history
# ============================================================
def _snapshot(task: Task) -> dict:
    return {
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "priority": task.priority,
        "due_date": str(task.due_date) if task.due_date else None,
    }


# ============================================================
# Helper — log action to task_history
# ============================================================
def _log_history(db: Session, task: Task, action: str):
    entry = TaskHistory(
        task_id=task.id,
        action=action,
        snapshot=_snapshot(task),
    )
    db.add(entry)


# ============================================================
# Sort map — query param value → SQLAlchemy column expression
# ============================================================
SORT_MAP = {
    "created_at_desc": Task.created_at.desc(),
    "created_at_asc": Task.created_at.asc(),
    "due_date_asc": Task.due_date.asc().nulls_last(),
    "priority_desc": case(
        {"high": 1, "medium": 2, "low": 3}, value=Task.priority
    ).asc(),
}


# ============================================================
# GET all tasks — with filter, search, sort, pagination
# ============================================================
def get_tasks(
    db: Session,
    page: int = 1,
    limit: int = 10,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    search: Optional[str] = None,
    sort: str = "created_at_desc",
):
    query = db.query(Task)

    # Filter
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)

    # Search — title or description (case insensitive)
    if search:
        pattern = f"%{search}%"
        query = query.filter(
            Task.title.ilike(pattern) | Task.description.ilike(pattern)
        )

    # Total count before pagination
    total = query.count()

    # Sort
    order = SORT_MAP.get(sort, Task.created_at.desc())
    query = query.order_by(order)

    # Pagination
    offset = (page - 1) * limit
    tasks = query.offset(offset).limit(limit).all()
    total_pages = max(1, -(-total // limit))  # ceiling division

    return tasks, total, total_pages


# ============================================================
# GET single task by ID
# ============================================================
def get_task_by_id(db: Session, task_id: int) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


# ============================================================
# GET dashboard statistics
# ============================================================
def get_task_stats(db: Session) -> dict:
    today = date.today()

    result = db.query(
        func.count().label("total_tasks"),
        func.count(case((Task.status == "pending", 1))).label("pending"),
        func.count(case((Task.status == "in_progress", 1))).label("in_progress"),
        func.count(case((Task.status == "completed", 1))).label("completed"),
        func.count(case((Task.priority == "high", 1))).label("high_priority"),
        func.count(
            case((and_(Task.due_date < today, Task.status != "completed"), 1))
        ).label("overdue"),
    ).one()

    return {
        "total_tasks": result.total_tasks,
        "pending": result.pending,
        "in_progress": result.in_progress,
        "completed": result.completed,
        "high_priority": result.high_priority,
        "overdue": result.overdue,
    }


# ============================================================
# CREATE task
# ============================================================
def create_task(db: Session, data: TaskCreate) -> Task:
    task = Task(**data.model_dump())
    db.add(task)
    db.flush()  # get the ID before commit
    _log_history(db, task, "created")
    db.commit()
    db.refresh(task)
    return task


# ============================================================
# UPDATE task
# ============================================================
def update_task(db: Session, task_id: int, data: TaskUpdate) -> Optional[Task]:
    task = get_task_by_id(db, task_id)
    if not task:
        return None

    # Only update fields that were actually sent
    updates = data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(task, field, value)

    db.flush()
    _log_history(db, task, "updated")
    db.commit()
    db.refresh(task)
    return task


# ============================================================
# DELETE task
# ============================================================
def delete_task(db: Session, task_id: int) -> bool:
    task = get_task_by_id(db, task_id)
    if not task:
        return False

    _log_history(db, task, "deleted")
    db.delete(task)
    db.commit()
    return True


# ============================================================
# GET history for a task
# ============================================================
def get_history(db: Session, task_id: Optional[int] = None):
    query = db.query(TaskHistory)
    if task_id:
        query = query.filter(TaskHistory.task_id == task_id)
    return query.order_by(TaskHistory.changed_at.desc()).all()
