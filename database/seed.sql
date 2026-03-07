-- database/seed.sql

-- ============================================================
-- TaskFlow Dashboard — Seed Data
-- 12 realistic tasks across all statuses and priorities
-- ============================================================

INSERT INTO tasks (title, description, status, priority, due_date) VALUES
(
    'Set up project repository',
    'Initialize Git repo, add .gitignore, README, and folder structure.',
    'completed', 'high', '2025-01-05'
),
(
    'Design database schema',
    'Define tasks and task_history tables with constraints and indexes.',
    'completed', 'high', '2025-01-07'
),
(
    'Build FastAPI backend',
    'Create routes, models, schemas, and CRUD operations using SQLAlchemy.',
    'in_progress', 'high', '2025-01-15'
),
(
    'Implement task filtering',
    'Add query parameters for filtering tasks by status and priority.',
    'in_progress', 'medium', '2025-01-18'
),
(
    'Build dashboard statistics endpoint',
    'Aggregate total tasks, count by status, and count by priority.',
    'pending', 'medium', '2025-01-20'
),
(
    'Create frontend task list page',
    'Render tasks as cards with status badges and action buttons.',
    'pending', 'high', '2025-01-22'
),
(
    'Add search functionality',
    'Allow users to search tasks by title or description keyword.',
    'pending', 'medium', '2025-01-24'
),
(
    'Implement pagination',
    'Add limit and offset query parameters to the task list endpoint.',
    'pending', 'low', '2025-01-26'
),
(
    'Write stored procedures',
    'Create PostgreSQL functions for stats and history logging.',
    'pending', 'low', '2025-01-28'
),
(
    'Style dashboard page',
    'Add stat cards, charts, and responsive layout to dashboard.html.',
    'pending', 'medium', '2025-01-30'
),
(
    'Write API documentation',
    'Document all endpoints in docs/api.md with parameters and responses.',
    'pending', 'low', '2025-02-01'
),
(
    'Final review and cleanup',
    'Refactor code, remove debug logs, and verify all features work end to end.',
    'pending', 'high', '2025-02-05'
);