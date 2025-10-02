
// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved theme or prefer-color-scheme
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.setAttribute('data-theme', 'dark');
    updateDarkModeIcon(true);
}

darkModeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateDarkModeIcon(false);
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateDarkModeIcon(true);
    }
});

function updateDarkModeIcon(isDark) {
    const icon = darkModeToggle.querySelector('i');
    if (isDark) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
});

// Dropdown functionality for mobile
if (window.innerWidth <= 768) {
    document.querySelectorAll('.dropdown > .nav-link').forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdownMenu = dropdown.parentElement;
            dropdownMenu.classList.toggle('active');
        });
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav') && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const linkHref = link.getAttribute('href');
    if (linkHref && linkHref.includes(currentPage)) {
        link.classList.add('active');
    }
});

// Search functionality (placeholder)
const searchToggle = document.querySelector('.search-toggle');
searchToggle.addEventListener('click', () => {
    alert('Search functionality coming soon!');
});

// Initialize any other interactive elements
document.addEventListener('DOMContentLoaded', function() {
    console.log('Research Undergraduate Society website loaded');
});
