/* database/schema.sql */

/* Drop tables in reverse dependency order for clean resets */
DROP TABLE IF EXISTS task_history;
DROP TABLE IF EXISTS tasks;

/* ─── TASKS TABLE ─── */
CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(150) NOT NULL,
    description TEXT,
    status      VARCHAR(20)  NOT NULL DEFAULT 'pending',
    priority    VARCHAR(20)  NOT NULL DEFAULT 'medium',
    due_date    DATE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_status   CHECK (status   IN ('pending', 'in_progress', 'completed')),
    CONSTRAINT chk_priority CHECK (priority IN ('low', 'medium', 'high'))
);

/* ─── TASK HISTORY TABLE ─── */
CREATE TABLE IF NOT EXISTS task_history (
    id          SERIAL PRIMARY KEY,
    task_id     INT          NOT NULL,
    action      VARCHAR(50)  NOT NULL,
    changed_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    snapshot    JSONB,

    CONSTRAINT fk_task
        FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_action
        CHECK (action IN ('created', 'updated', 'deleted'))
);

/* ─── INDEXES ─── */
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_history_task_id ON task_history(task_id);