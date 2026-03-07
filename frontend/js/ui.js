// frontend/js/ui.js

import { formatDate, formatStatus, formatPriority } from './utils.js';

// ============================================================
// Status and Priority Badge Classes
// ============================================================
const STATUS_CLASSES = {
    pending:     'badge badge--pending',
    in_progress: 'badge badge--in-progress',
    completed:   'badge badge--completed',
};

const PRIORITY_CLASSES = {
    low:    'badge badge--low',
    medium: 'badge badge--medium',
    high:   'badge badge--high',
};

// ============================================================
// Render a single task card
// Destructuring in parameter, template literal
// ============================================================
export const renderTaskCard = (task) => {
    const {
        id,
        title,
        description,
        status,
        priority,
        due_date,
    } = task;  // destructuring

    const statusClass   = STATUS_CLASSES[status]   ?? 'badge';
    const priorityClass = PRIORITY_CLASSES[priority] ?? 'badge';

    return `
        <div class="task-card" data-id="${id}">
            <div class="task-card__header">
                <h3 class="task-card__title">${title}</h3>
                <div class="task-card__badges">
                    <span class="${statusClass}">${formatStatus(status)}</span>
                    <span class="${priorityClass}">${formatPriority(priority)}</span>
                </div>
            </div>

            <p class="task-card__description">
                ${description ?? 'No description provided.'}
            </p>

            <div class="task-card__footer">
                <span class="task-card__due">
                    Due: ${formatDate(due_date)}
                </span>
                <div class="task-card__actions">
                    <button class="btn btn--edit"   data-id="${id}">Edit</button>
                    <button class="btn btn--delete" data-id="${id}">Delete</button>
                </div>
            </div>
        </div>
    `;
};

// ============================================================
// Render full task list into a container
// Array method chaining, spread
// ============================================================
export const renderTaskList = (tasks, container) => {
    if (!container) return;

    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No tasks found. Create your first task.</p>
            </div>
        `;
        return;
    }

    // map returns array of strings, join combines them
    container.innerHTML = tasks
        .map(task => renderTaskCard(task))
        .join('');
};

// ============================================================
// Render dashboard stat cards
// Destructuring, template literal
// ============================================================
export const renderStats = (stats, container) => {
    if (!container) return;

    const {
        total_tasks,
        pending,
        in_progress,
        completed,
        high_priority,
        overdue,
    } = stats;  // destructuring

    container.innerHTML = `
        <div class="stat-card">
            <span class="stat-card__label">Total Tasks</span>
            <span class="stat-card__value">${total_tasks}</span>
        </div>
        <div class="stat-card stat-card--pending">
            <span class="stat-card__label">Pending</span>
            <span class="stat-card__value">${pending}</span>
        </div>
        <div class="stat-card stat-card--progress">
            <span class="stat-card__label">In Progress</span>
            <span class="stat-card__value">${in_progress}</span>
        </div>
        <div class="stat-card stat-card--completed">
            <span class="stat-card__label">Completed</span>
            <span class="stat-card__value">${completed}</span>
        </div>
        <div class="stat-card stat-card--high">
            <span class="stat-card__label">High Priority</span>
            <span class="stat-card__value">${high_priority}</span>
        </div>
        <div class="stat-card stat-card--overdue">
            <span class="stat-card__label">Overdue</span>
            <span class="stat-card__value">${overdue}</span>
        </div>
    `;
};

// ============================================================
// Render pagination controls
// ============================================================
export const renderPagination = (pagination, container, onPageChange) => {
    if (!container) return;

    const { page, total_pages } = pagination;

    if (total_pages <= 1) {
        container.innerHTML = '';
        return;
    }

    // Spread to build array of page numbers
    const pages = [...Array(total_pages).keys()].map(i => i + 1);

    container.innerHTML = `
        <div class="pagination">
            <button class="btn btn--page"
                data-page="${page - 1}"
                ${page === 1 ? 'disabled' : ''}>
                Previous
            </button>

            ${pages.map(p => `
                <button class="btn btn--page ${p === page ? 'btn--page--active' : ''}"
                    data-page="${p}">
                    ${p}
                </button>
            `).join('')}

            <button class="btn btn--page"
                data-page="${page + 1}"
                ${page === total_pages ? 'disabled' : ''}>
                Next
            </button>
        </div>
    `;

    // Event delegation — one listener handles all buttons
    container.querySelectorAll('.btn--page').forEach(btn => {
        btn.addEventListener('click', () => {
            const newPage = parseInt(btn.dataset.page);
            if (!btn.disabled) onPageChange(newPage);
        });
    });
};

// ============================================================
// Show inline form error messages
// ============================================================
export const renderFormErrors = (errors, container) => {
    if (!container) return;

    container.innerHTML = errors
        .map(err => `<p class="form-error">${err}</p>`)
        .join('');
};