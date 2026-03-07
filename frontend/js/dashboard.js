// frontend/js/dashboard.js

import { TaskAPI }     from './api.js';
import { renderStats } from './ui.js';
import { getElement }  from './utils.js';

// ============================================================
// loadDashboardStats()
// Fetches aggregated stats from GET /api/tasks/stats
// Returns: total, pending, in_progress, completed,
//          high_priority, overdue
// ============================================================
const loadDashboardStats = async () => {
    const container = getElement('#stats-container');

    try {
        const stats = await TaskAPI.getStats();

        // renderStats destructures this object — see ui.js
        renderStats(stats, container);

    } catch (err) {
        container.innerHTML = `
            <p class="error">Failed to load statistics: ${err.message}</p>
        `;
    }
};

// ============================================================
// loadRecentTasks()
// Fetches 5 most recent tasks for dashboard preview list
// ============================================================
const loadRecentTasks = async () => {
    const container = getElement('#recent-tasks');

    try {
        const data = await TaskAPI.getAll({
            limit: 5,
            sort:  'created_at_desc',
        });

        const { tasks } = data;

        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<p class="loading">No tasks yet.</p>';
            return;
        }

        // Map each task to a preview row
        // Destructuring inside arrow function parameter
        container.innerHTML = tasks
            .map(({ id, title, status, priority }) => `
                <div class="recent-task">
                    <span class="recent-task__title">${title}</span>
                    <div style="display:flex; gap:0.5rem;">
                        <span class="badge badge--${status.replace('_', '-')}">
                            ${status.replace('_', ' ')}
                        </span>
                        <span class="badge badge--${priority}">
                            ${priority}
                        </span>
                    </div>
                </div>
            `)
            .join('');

    } catch (err) {
        container.innerHTML = `
            <p class="error">Failed to load recent tasks: ${err.message}</p>
        `;
    }
};

// ============================================================
// Init
// ============================================================
const init = () => {
    loadDashboardStats();
    loadRecentTasks();
};

document.addEventListener('DOMContentLoaded', init);