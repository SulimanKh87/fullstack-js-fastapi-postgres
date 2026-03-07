// frontend/js/tasks.js

import { TaskAPI }                   from './api.js';
import { renderTaskList,
         renderPagination,
         renderFormErrors }          from './ui.js';
import { validateTaskForm,
         getElement,
         clearElement }              from './utils.js';

// ============================================================
// Page State — single source of truth for all query params
// ============================================================
const state = {
    page:      1,
    limit:     10,
    status:    '',
    priority:  '',
    search:    '',
    sort:      'created_at_desc',
    editingId: null,
};

// ============================================================
// loadTasks()
// Reads state, calls API, renders results + pagination
// ============================================================
export const loadTasks = async () => {
    const listEl  = getElement('#task-list');
    const pageEl  = getElement('#pagination');

    listEl.innerHTML = '<p class="loading">Loading tasks...</p>';

    try {
        const data = await TaskAPI.getAll({
            page:     state.page,
            limit:    state.limit,
            status:   state.status,
            priority: state.priority,
            search:   state.search,
            sort:     state.sort,
        });

        // data = { tasks: [...], total: 12, page: 1, total_pages: 2 }
        renderTaskList(data.tasks, listEl);

        renderPagination(
            {
                page:        data.page,
                total_pages: data.total_pages,
            },
            pageEl,
            (newPage) => {
                state.page = newPage;
                loadTasks();
            }
        );

    } catch (err) {
        listEl.innerHTML = `<p class="error">Failed to load tasks: ${err.message}</p>`;
    }
};

// ============================================================
// createTask()
// Reads form, validates, posts to API
// ============================================================
const createTask = async (taskData) => {
    await TaskAPI.create(taskData);
};

// ============================================================
// updateTask()
// Sends updated fields to API for existing task
// ============================================================
const updateTask = async (id, taskData) => {
    await TaskAPI.update(id, taskData);
};

// ============================================================
// deleteTask()
// Confirms with user then deletes by ID
// ============================================================
export const deleteTask = async (id) => {
    const confirmed = window.confirm('Delete this task? This cannot be undone.');
    if (!confirmed) return;

    try {
        await TaskAPI.delete(id);
        await loadTasks();
    } catch (err) {
        console.error('Delete failed:', err.message);
    }
};

// ============================================================
// filterTasks()
// Updates state from a filter object and reloads
// ============================================================
export const filterTasks = (filters = {}) => {
    // Spread filters into state, always reset to page 1
    Object.assign(state, { ...filters, page: 1 });
    loadTasks();
};

// ============================================================
// Handle Form Submit — create or update
// ============================================================
const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errorBox = getElement('#form-errors');
    clearElement(errorBox);

    const taskData = {
        title:       getElement('#title').value.trim(),
        description: getElement('#description').value.trim(),
        status:      getElement('#status').value,
        priority:    getElement('#priority').value,
        due_date:    getElement('#due_date').value || null,
    };

    const { valid, errors } = validateTaskForm(taskData);

    if (!valid) {
        renderFormErrors(errors, errorBox);
        return;
    }

    try {
        if (state.editingId) {
            await updateTask(state.editingId, taskData);
        } else {
            await createTask(taskData);
        }

        resetForm();
        await loadTasks();

    } catch (err) {
        renderFormErrors([err.message], errorBox);
    }
};

// ============================================================
// Handle Edit Button — populate form with task data
// ============================================================
const handleEdit = async (id) => {
    try {
        const { title, description, status, priority, due_date } = await TaskAPI.getById(id);

        getElement('#title').value       = title;
        getElement('#description').value = description ?? '';
        getElement('#status').value      = status;
        getElement('#priority').value    = priority;
        getElement('#due_date').value    = due_date ?? '';

        state.editingId = id;

        getElement('#form-title').textContent = 'Edit Task';
        getElement('#submit-btn').textContent = 'Update Task';
        getElement('#task-form').scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
        console.error('Failed to load task for editing:', err.message);
    }
};

// ============================================================
// Reset form back to create mode
// ============================================================
const resetForm = () => {
    getElement('#task-form').reset();
    clearElement(getElement('#form-errors'));
    state.editingId = null;
    getElement('#form-title').textContent = 'Create Task';
    getElement('#submit-btn').textContent = 'Create Task';
};

// ============================================================
// Search — debounced input handler
// Waits 400ms after user stops typing before firing
// ============================================================
const initSearch = () => {
    const input = getElement('#search');
    if (!input) return;

    let timer;
    input.addEventListener('input', (e) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            filterTasks({ search: e.target.value.trim() });
        }, 400);
    });
};

// ============================================================
// Filters — status, priority, sort dropdowns
// ============================================================
const initFilters = () => {
    getElement('#filter-status')?.addEventListener('change', (e) => {
        filterTasks({ status: e.target.value });
    });

    getElement('#filter-priority')?.addEventListener('change', (e) => {
        filterTasks({ priority: e.target.value });
    });

    // Sorting — maps dropdown value to API sort param
    // Supported: created_at_desc, created_at_asc, due_date_asc, priority_desc
    getElement('#filter-sort')?.addEventListener('change', (e) => {
        filterTasks({ sort: e.target.value });
    });
};

// ============================================================
// Event Delegation — edit and delete buttons on task cards
// One listener handles all dynamically rendered cards
// ============================================================
const initTaskListEvents = () => {
    const container = getElement('#task-list');
    if (!container) return;

    container.addEventListener('click', (e) => {
        const editBtn   = e.target.closest('.btn--edit');
        const deleteBtn = e.target.closest('.btn--delete');

        if (editBtn)   handleEdit(parseInt(editBtn.dataset.id));
        if (deleteBtn) deleteTask(parseInt(deleteBtn.dataset.id));
    });
};

// ============================================================
// Init — runs on DOMContentLoaded
// ============================================================
const init = () => {
    getElement('#task-form')?.addEventListener('submit', handleFormSubmit);
    getElement('#reset-btn')?.addEventListener('click',  resetForm);

    initSearch();
    initFilters();
    initTaskListEvents();
    loadTasks();
};

document.addEventListener('DOMContentLoaded', init);