# backend/app/routes/tasks.py

from fastapi           import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm    import Session
from typing            import Optional

from ..db      import get_db
from ..schemas import (
    TaskCreate, TaskUpdate, TaskResponse,
    TaskListResponse, TaskStatsResponse, HistoryResponse,
)
from .. import crud

router = APIRouter(prefix="/api", tags=["tasks"])

# ============================================================
# GET /api/tasks/stats
# Must be defined BEFORE /api/tasks/{id}
# to avoid FastAPI matching "stats" as an ID
# ============================================================
@router.get("/tasks/stats", response_model=TaskStatsResponse)
def get_stats(db: Session = Depends(get_db)):
    return crud.get_task_stats(db)


# ============================================================
# GET /api/tasks
# ============================================================
@router.get("/tasks", response_model=TaskListResponse)
def list_tasks(
    page:     int            = Query(1,    ge=1),
    limit:    int            = Query(10,   ge=1, le=100),
    status:   Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search:   Optional[str] = Query(None),
    sort:     str            = Query("created_at_desc"),
    db:       Session        = Depends(get_db),
):
    tasks, total, total_pages = crud.get_tasks(
        db, page, limit, status, priority, search, sort
    )
    return {
        "tasks":       tasks,
        "total":       total,
        "page":        page,
        "total_pages": total_pages,
    }


# ============================================================
# GET /api/tasks/{id}
# ============================================================
@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = crud.get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ============================================================
# POST /api/tasks
# ============================================================
@router.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(data: TaskCreate, db: Session = Depends(get_db)):
    return crud.create_task(db, data)


# ============================================================
# PUT /api/tasks/{id}
# ============================================================
@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, data: TaskUpdate, db: Session = Depends(get_db)):
    task = crud.update_task(db, task_id, data)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


# ============================================================
# DELETE /api/tasks/{id}
# ============================================================
@router.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_task(db, task_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Task not found")


# ============================================================
# GET /api/history
# ============================================================
@router.get("/history", response_model=list[HistoryResponse])
def get_history(
    task_id: Optional[int] = Query(None),
    db:      Session        = Depends(get_db),
):
    return crud.get_history(db, task_id)