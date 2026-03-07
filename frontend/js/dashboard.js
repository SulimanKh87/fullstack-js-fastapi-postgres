// frontend/js/dashboard.js

import { TaskAPI }       from './api.js';
import { renderStats }   from './ui.js';
import { getElement }    from './utils.js';

// ============================================================
// Load and render dashboard statistics
// async/await, destructuring
// ============================================================
const loadStats = async () => {
    const container = getElement('#stats-container');

    try {
        const stats = await TaskAPI.getStats();
        renderStats(stats, container);
    } catch (err) {
        container.innerHTML = `<p class="error">Failed to load stats: ${err.message}</p>`;
    }
};

// ============================================================
// Load recent tasks for dashboard preview
// async/await, spread
// ============================================================
const loadRecentTasks = async () => {
    const container = getElement('#recent-tasks');

    try {
        // Spread filters — only get 5 most recent
        const data = await TaskAPI.getAll({ limit: 5, sort: 'created_at_desc' });

        const { tasks } = data;  // destructuring

        if (tasks.length === 0) {
            container.innerHTML = '<p>No tasks yet.</p>';
            return;
        }

        container.innerHTML = tasks.map(({ id, title, status, priority }) => `
            <div class="recent-task">
                <span class="recent-task__title">${title}</span>
                <span class="badge badge--${status}">${status}</span>
                <span class="badge badge--${priority}">${priority}</span>
            </div>
        `).join('');

    } catch (err) {
        container.innerHTML = `<p class="error">Failed to load recent tasks: ${err.message}</p>`;
    }
};

// ============================================================
// Init
// ============================================================
const init = () => {
    loadStats();
    loadRecentTasks();
};

document.addEventListener('DOMContentLoaded', init);