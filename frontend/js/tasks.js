// frontend/js/tasks.js

import { TaskAPI }                              from './api.js';
import { renderTaskList, renderPagination,
         renderFormErrors }                     from './ui.js';
import { validateTaskForm, getElement,
         clearElement }                         from './utils.js';

// ============================================================
// Page State — single source of truth
// ============================================================
const state = {
    page:     1,
    limit:    10,
    status:   '',
    priority: '',
    search:   '',
    sort:     'created_at_desc',
    editingId: null,   // null = create mode, number = edit mode
};

// ============================================================
// Load and render tasks with current state
// async/await, spread
// ============================================================
const loadTasks = async () => {
    const container   = getElement('#task-list');
    const pagination  = getElement('#pagination');

    try {
        // Spread state into filters object
        const data = await TaskAPI.getAll({ ...state });

        renderTaskList(data.tasks, container);
        renderPagination(
            { page: state.page, total_pages: data.total_pages },
            pagination,
            (newPage) => {
                state.page = newPage;
                loadTasks();
            }
        );
    } catch (err) {
        container.innerHTML = `<p class="error">Failed to load tasks: ${err.message}</p>`;
    }
};

// ============================================================
// Handle form submit — create or update
// async/await, destructuring
// ============================================================
const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form        = e.target;
    const errorBox    = getElement('#form-errors');
    clearElement(errorBox);

    // Destructure form values
    const taskData = {
        title:       getElement('#title').value.trim(),
        description: getElement('#description').value.trim(),
        status:      getElement('#status').value,
        priority:    getElement('#priority').value,
        due_date:    getElement('#due_date').value || null,
    };

    // Validate before sending
    const { valid, errors } = validateTaskForm(taskData);
    if (!valid) {
        renderFormErrors(errors, errorBox);
        return;
    }

    try {
        if (state.editingId) {
            await TaskAPI.update(state.editingId, taskData);
        } else {
            await TaskAPI.create(taskData);
        }

        resetForm();
        await loadTasks();

    } catch (err) {
        renderFormErrors([err.message], errorBox);
    }
};

// ============================================================
// Handle edit button click — populate form
// async/await, destructuring
// ============================================================
const handleEdit = async (id) => {
    try {
        const task = await TaskAPI.getById(id);

        const {
            title,
            description,
            status,
            priority,
            due_date,
        } = task;  // destructuring

        getElement('#title').value       = title;
        getElement('#description').value = description ?? '';
        getElement('#status').value      = status;
        getElement('#priority').value    = priority;
        getElement('#due_date').value    = due_date ?? '';

        state.editingId = id;
        getElement('#form-title').textContent  = 'Edit Task';
        getElement('#submit-btn').textContent  = 'Update Task';

    } catch (err) {
        console.error('Failed to load task for editing:', err);
    }
};

// ============================================================
// Handle delete button click
// async/await
// ============================================================
const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
        await TaskAPI.delete(id);
        await loadTasks();
    } catch (err) {
        console.error('Failed to delete task:', err);
    }
};

// ============================================================
// Reset form to create mode
// ============================================================
const resetForm = () => {
    getElement('#task-form').reset();
    clearElement(getElement('#form-errors'));
    state.editingId = null;
    getElement('#form-title').textContent = 'Create Task';
    getElement('#submit-btn').textContent = 'Create Task';
};

// ============================================================
// Wire up filter and search controls
// Arrow functions, event listeners
// ============================================================
const initFilters = () => {
    const filterStatus   = getElement('#filter-status');
    const filterPriority = getElement('#filter-priority');
    const filterSort     = getElement('#filter-sort');
    const searchInput    = getElement('#search');

    filterStatus?.addEventListener('change', (e) => {
        state.status = e.target.value;
        state.page   = 1;
        loadTasks();
    });

    filterPriority?.addEventListener('change', (e) => {
        state.priority = e.target.value;
        state.page     = 1;
        loadTasks();
    });

    filterSort?.addEventListener('change', (e) => {
        state.sort = e.target.value;
        state.page = 1;
        loadTasks();
    });

    // Debounced search — avoids API call on every keystroke
    let searchTimer;
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            state.search = e.target.value.trim();
            state.page   = 1;
            loadTasks();
        }, 400);
    });
};

// ============================================================
// Event delegation — handle edit and delete from task list
// ============================================================
const initTaskListEvents = () => {
    const container = getElement('#task-list');

    container?.addEventListener('click', (e) => {
        const editBtn   = e.target.closest('.btn--edit');
        const deleteBtn = e.target.closest('.btn--delete');

        if (editBtn)   handleEdit(parseInt(editBtn.dataset.id));
        if (deleteBtn) handleDelete(parseInt(deleteBtn.dataset.id));
    });
};

// ============================================================
// Page init — runs on DOMContentLoaded
// ============================================================
const init = () => {
    getElement('#task-form')?.addEventListener('submit', handleFormSubmit);
    getElement('#reset-btn')?.addEventListener('click',  resetForm);

    initFilters();
    initTaskListEvents();
    loadTasks();
};

document.addEventListener('DOMContentLoaded', init);