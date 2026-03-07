-- database/queries.sql

-- ============================================================
-- TaskFlow Dashboard — Reference Queries
-- These demonstrate real SQL skill for portfolio purposes
-- ============================================================


-- ------------------------------------------------------------
-- 1. Get all tasks, newest first (default list view)
-- ------------------------------------------------------------
SELECT
    id,
    title,
    status,
    priority,
    due_date,
    created_at
FROM tasks
ORDER BY created_at DESC;


-- ------------------------------------------------------------
-- 2. Filter by status
-- ------------------------------------------------------------
SELECT *
FROM tasks
WHERE status = 'pending'
ORDER BY created_at DESC;


-- ------------------------------------------------------------
-- 3. Filter by priority
-- ------------------------------------------------------------
SELECT *
FROM tasks
WHERE priority = 'high'
ORDER BY created_at DESC;


-- ------------------------------------------------------------
-- 4. Search by keyword in title or description
-- ------------------------------------------------------------
SELECT *
FROM tasks
WHERE
    title       ILIKE '%api%'
    OR description ILIKE '%api%'
ORDER BY created_at DESC;


-- ------------------------------------------------------------
-- 5. Paginate results (page 1 = offset 0, page 2 = offset 10)
-- ------------------------------------------------------------
SELECT *
FROM tasks
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;


-- ------------------------------------------------------------
-- 6. Dashboard stats — count by status
-- ------------------------------------------------------------
SELECT
    status,
    COUNT(*) AS total
FROM tasks
GROUP BY status
ORDER BY status;


-- ------------------------------------------------------------
-- 7. Dashboard stats — count by priority
-- ------------------------------------------------------------
SELECT
    priority,
    COUNT(*) AS total
FROM tasks
GROUP BY priority
ORDER BY priority;


-- ------------------------------------------------------------
-- 8. Dashboard stats — full summary in one query
-- ------------------------------------------------------------
SELECT
    COUNT(*)                                            AS total_tasks,
    COUNT(*) FILTER (WHERE status = 'pending')          AS pending,
    COUNT(*) FILTER (WHERE status = 'in_progress')      AS in_progress,
    COUNT(*) FILTER (WHERE status = 'completed')        AS completed,
    COUNT(*) FILTER (WHERE priority = 'high')           AS high_priority,
    COUNT(*) FILTER (WHERE due_date < CURRENT_DATE
                     AND status != 'completed')         AS overdue
FROM tasks;


-- ------------------------------------------------------------
-- 9. Tasks overdue (past due date and not completed)
-- ------------------------------------------------------------
SELECT *
FROM tasks
WHERE
    due_date < CURRENT_DATE
    AND status != 'completed'
ORDER BY due_date ASC;


-- ------------------------------------------------------------
-- 10. Full audit history for a specific task
-- ------------------------------------------------------------
SELECT
    th.id,
    th.action,
    th.changed_at,
    th.snapshot
FROM task_history th
WHERE th.task_id = 1
ORDER BY th.changed_at DESC;    