-- database/schema.sql

-- ============================================================
-- TaskFlow Dashboard — Database Schema
-- PostgreSQL 15+
-- ============================================================

-- Drop tables in correct order (child before parent)
DROP TABLE IF EXISTS task_history;
DROP TABLE IF EXISTS tasks;

-- ============================================================
-- TABLE: tasks
-- Core task management table
-- ============================================================
CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(150)    NOT NULL,
    description TEXT,
    status      VARCHAR(20)     NOT NULL DEFAULT 'pending',
    priority    VARCHAR(20)     NOT NULL DEFAULT 'medium',
    due_date    DATE,
    created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Validation constraints
    CONSTRAINT chk_status   CHECK (status   IN ('pending', 'in_progress', 'completed')),
    CONSTRAINT chk_priority CHECK (priority IN ('low', 'medium', 'high')),
    CONSTRAINT chk_title_length CHECK (LENGTH(TRIM(title)) > 0)
);

-- ============================================================
-- TABLE: task_history
-- Audit log — every create, update, delete is recorded
-- ============================================================
CREATE TABLE IF NOT EXISTS task_history (
    id          SERIAL PRIMARY KEY,
    task_id     INT             NOT NULL,
    action      VARCHAR(20)     NOT NULL,
    changed_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    snapshot    JSONB,

    CONSTRAINT chk_action CHECK (action IN ('created', 'updated', 'deleted')),
    CONSTRAINT fk_task FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE
);

-- ============================================================
-- INDEXES
-- Speed up common query patterns
-- ============================================================

-- Filter by status (most common filter)
CREATE INDEX IF NOT EXISTS idx_tasks_status
    ON tasks(status);

-- Filter by priority
CREATE INDEX IF NOT EXISTS idx_tasks_priority
    ON tasks(priority);

-- Sort by created date (default sort on task list)
CREATE INDEX IF NOT EXISTS idx_tasks_created_at
    ON tasks(created_at DESC);

-- Filter history by task
CREATE INDEX IF NOT EXISTS idx_history_task_id
    ON task_history(task_id);