// frontend/js/main.js

// ============================================================
// Shared initialization logic — runs on every page
// ============================================================

// Highlight active nav link based on current page
const initNav = () => {
    const currentPath = window.location.pathname;

    document.querySelectorAll('.nav__link').forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop()) {
            link.classList.add('nav__link--active');
        }
    });
};

document.addEventListener('DOMContentLoaded', initNav);