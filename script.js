// Wrap the entire script in an IIFE to avoid polluting the global scope
(function() {
    'use strict';

    // --- DOM Element Selection ---
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.getElementById('searchOverlay');

    // --- Dark Mode Functionality ---
    const updateDarkModeIcon = (isDark) => {
        if (!darkModeToggle) return;
        const icon = darkModeToggle.querySelector('i');
        if (isDark) {
            icon.className = 'fas fa-sun';
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    };

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.setAttribute('data-theme', 'dark');
            updateDarkModeIcon(true);
        } else {
            body.removeAttribute('data-theme');
            updateDarkModeIcon(false);
        }
    };

    const toggleTheme = () => {
        const currentTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        applyTheme(currentTheme);
    };

    // --- Mobile Navigation & Modals ---
    const closeAllModals = () => {
        // Close mobile menu
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        // Close all dropdowns
        document.querySelectorAll('.dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    };

    const toggleMobileMenu = (e) => {
        e.stopPropagation();
        const isExpanded = navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    };

    // --- Search Functionality ---
    const openSearch = () => {
        if (!searchOverlay) return;
        searchOverlay.removeAttribute('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        setTimeout(() => {
            searchOverlay.classList.add('visible');
            searchOverlay.querySelector('#searchInput').focus();
        }, 10);
    };

    const closeSearch = () => {
        if (!searchOverlay) return;
        document.body.style.overflow = '';
        searchOverlay.classList.remove('visible');
        setTimeout(() => {
            searchOverlay.setAttribute('hidden', true);
        }, 300); // Match CSS transition duration
    };

    // --- Initialization Functions ---
    const initializeEventListeners = () => {
        if (darkModeToggle) darkModeToggle.addEventListener('click', toggleTheme);
        if (mobileToggle) mobileToggle.addEventListener('click', toggleMobileMenu);

        // Mobile dropdown logic
        document.querySelectorAll('.dropdown > .nav-link').forEach(dropdownLink => {
            dropdownLink.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdownLink.parentElement.classList.toggle('active');
                }
            });
        });

        // Search events
        if (searchToggle) searchToggle.addEventListener('click', openSearch);
        if (searchOverlay) {
            searchOverlay.querySelector('.search-close').addEventListener('click', closeSearch);
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) closeSearch();
            });
        }

        // Global event listeners
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.main-nav')) closeAllModals();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllModals();
                if (searchOverlay && searchOverlay.classList.contains('visible')) {
                    closeSearch();
                }
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) closeAllModals();
        });

        // System theme change listener
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    };
    
    const initializeAccessibility = () => {
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileToggle.setAttribute('aria-controls', 'main-navigation');
        }
        if (navLinks) {
            navLinks.id = 'main-navigation';
        }
    };
    
    const initializeActiveNav = () => {
        // Use a more robust path matching
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-links a').forEach(link => {
            // Check for exact match or if it's the homepage
            if (link.pathname === currentPath || (currentPath.endsWith('/') && link.pathname.endsWith('index.html'))) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                
                const parentDropdown = link.closest('.dropdown');
                if (parentDropdown) {
                    parentDropdown.querySelector('.nav-link').classList.add('active');
                }
            }
        });
    };

    const initializeApp = () => {
        // Set initial theme
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
        
        initializeEventListeners();
        initializeAccessibility();
        initializeActiveNav();

        console.log('Research Undergraduate Society website initialized.');
    };

    // --- Run the App ---
    // Use DOMContentLoaded to ensure the HTML is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

})();
