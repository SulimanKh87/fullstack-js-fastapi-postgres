// frontend/js/api.js

const BASE_URL = 'http://localhost:8001/api';

// ============================================================
// Custom Error Class
// ============================================================
class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name   = 'ApiError';
        this.status = status;
    }
}

// ============================================================
// Base Request Handler
// ============================================================
const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
            errorData.detail ?? `Request failed with status ${response.status}`,
            response.status
        );
    }

    if (response.status === 204) return null;

    return response.json();
};

// ============================================================
// Query String Builder
// Filters out empty, null, undefined values
// ============================================================
const buildQueryString = (params = {}) => {
    const filtered = Object.entries(params)
        .filter(([, value]) => value !== '' && value !== null && value !== undefined)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

    return filtered.length > 0 ? `?${filtered.join('&')}` : '';
};

// ============================================================
// Task API
// ============================================================
export class TaskAPI {

    // GET /api/tasks
    // Supports: page, limit, status, priority, search, sort
    static async getAll({
        page     = 1,
        limit    = 10,
        status   = '',
        priority = '',
        search   = '',
        sort     = 'created_at_desc',
    } = {}) {
        const query = buildQueryString({ page, limit, status, priority, search, sort });
        return request(`/tasks${query}`);
    }

    // GET /api/tasks/stats
    // Returns: total, pending, in_progress, completed, high_priority, overdue
    static async getStats() {
        return request('/tasks/stats');
    }

    // GET /api/tasks/:id
    static async getById(id) {
        return request(`/tasks/${id}`);
    }

    // POST /api/tasks
    static async create(taskData) {
        return request('/tasks', {
            method: 'POST',
            body:   JSON.stringify(taskData),
        });
    }

    // PUT /api/tasks/:id
    static async update(id, taskData) {
        return request(`/tasks/${id}`, {
            method: 'PUT',
            body:   JSON.stringify(taskData),
        });
    }

    // DELETE /api/tasks/:id
    static async delete(id) {
        return request(`/tasks/${id}`, {
            method: 'DELETE',
        });
    }
}

// ============================================================
// History API
// ============================================================
export class HistoryAPI {
    static async getAll(taskId = null) {
        const query = taskId ? `?task_id=${taskId}` : '';
        return request(`/history${query}`);
    }
}