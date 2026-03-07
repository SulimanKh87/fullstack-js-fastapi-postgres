// frontend/js/utils.js

// ============================================================
// Formatting Utilities
// ============================================================

// Destructuring in parameters
export const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
};

// Ternary + template literal
export const formatStatus = (status) => {
    const map = {
        pending:     'Pending',
        in_progress: 'In Progress',
        completed:   'Completed',
    };
    return map[status] ?? 'Unknown';
};

export const formatPriority = (priority) => {
    const map = {
        low:    'Low',
        medium: 'Medium',
        high:   'High',
    };
    return map[priority] ?? 'Unknown';
};

// ============================================================
// DOM Utilities
// ============================================================

// Arrow function, default parameter
export const getElement = (selector, context = document) => {
    return context.querySelector(selector);
};

export const getElements = (selector, context = document) => {
    return [...context.querySelectorAll(selector)]; // spread into real array
};

export const showElement = (el) => el?.classList.remove('hidden');
export const hideElement = (el) => el?.classList.add('hidden');

export const clearElement = (el) => {
    if (el) el.innerHTML = '';
};

// ============================================================
// Validation Utilities
// ============================================================

// Destructuring object parameter
export const validateTaskForm = ({ title, status, priority }) => {
    const errors = [];

    if (!title || title.trim().length === 0) {
        errors.push('Title is required.');
    }
    if (title && title.trim().length > 150) {
        errors.push('Title must be 150 characters or less.');
    }
    if (!['pending', 'in_progress', 'completed'].includes(status)) {
        errors.push('Invalid status value.');
    }
    if (!['low', 'medium', 'high'].includes(priority)) {
        errors.push('Invalid priority value.');
    }

    return {
        valid:  errors.length === 0,
        errors,
    };
};

// ============================================================
// Query String Builder
// ============================================================

// Spread operator, Object.entries, arrow function
export const buildQueryString = (params = {}) => {
    const filtered = Object.entries(params)
        .filter(([, value]) => value !== '' && value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

    return filtered.length > 0 ? `?${filtered.join('&')}` : '';
};