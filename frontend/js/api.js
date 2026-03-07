// frontend/js/api.js

const BASE_URL = 'http://localhost:8000/api';

// ============================================================
// Custom Error Class — ES6 class inheritance
// ============================================================
class ApiError extends Error {
    constructor(message, status) {
        super(message);           // call parent constructor
        this.name   = 'ApiError';
        this.status = status;
    }
}

// ============================================================
// Base Request Handler
// async/await, destructuring, arrow functions
// ============================================================
const request = async (endpoint, options = {}) => {
    const url = `${BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    // Spread — merge default headers with any custom ones
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
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

    // 204 No Content — return null
    if (response.status === 204) return null;

    return response.json();
};

// ============================================================
// Task API Methods — ES6 class with static methods
// ============================================================
export class TaskAPI {

    // GET /api/tasks?status=&priority=&search=&sort=&page=&limit=
    static async getAll(filters = {}) {
        const { buildQueryString } = await import('./utils.js');
        const query = buildQueryString(filters);
        return request(`/tasks${query}`);
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

    // GET /api/tasks/stats
    static async getStats() {
        return request('/tasks/stats');
    }
}

// ============================================================
// History API Methods
// ============================================================
export class HistoryAPI {

    // GET /api/history?task_id=
    static async getAll(taskId = null) {
        const query = taskId ? `?task_id=${taskId}` : '';
        return request(`/history${query}`);
    }
}