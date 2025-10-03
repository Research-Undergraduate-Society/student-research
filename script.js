// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check for saved theme or prefer-color-scheme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.setAttribute('data-theme', 'dark');
        updateDarkModeIcon(true);
    } else {
        body.removeAttribute('data-theme');
        updateDarkModeIcon(false);
    }
}

function updateDarkModeIcon(isDark) {
    if (!darkModeToggle) return;
    
    const icon = darkModeToggle.querySelector('i');
    if (icon) {
        if (isDark) {
            icon.className = 'fas fa-sun';
            icon.setAttribute('aria-label', 'Switch to light mode');
        } else {
            icon.className = 'fas fa-moon';
            icon.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

if (darkModeToggle) {
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
}

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        
        // Update aria-expanded for accessibility
        const isExpanded = navLinks.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// Dropdown functionality for mobile
function initializeMobileDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown > .nav-link');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownMenu = dropdown.parentElement;
                dropdownMenu.classList.toggle('active');
                
                // Close other open dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.parentElement.classList.remove('active');
                    }
                });
            }
        });
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.main-nav') && navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Close all dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Close dropdowns when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            if (mobileToggle) {
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        }
        
        // Close all dropdowns
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Only process internal anchor links
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    if (mobileToggle) {
                        mobileToggle.classList.remove('active');
                        mobileToggle.setAttribute('aria-expanded', 'false');
                    }
                }
                
                // Calculate header height for offset
                const header = document.querySelector('.main-header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

// Active navigation highlighting
function initializeActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link:not(.dropdown > .nav-link)').forEach(link => {
        const linkHref = link.getAttribute('href');
        
        if (linkHref && (linkHref === currentPage || linkHref.includes(currentPage))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Search functionality (placeholder)
const searchToggle = document.querySelector('.search-toggle');
if (searchToggle) {
    searchToggle.addEventListener('click', () => {
        // Create search overlay if it doesn't exist
        let searchOverlay = document.getElementById('searchOverlay');
        
        if (!searchOverlay) {
            searchOverlay = document.createElement('div');
            searchOverlay.id = 'searchOverlay';
            searchOverlay.innerHTML = `
                <div class="search-modal">
                    <div class="search-header">
                        <h3>Search</h3>
                        <button class="search-close" aria-label="Close search">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="search-input-container">
                        <input type="text" placeholder="Enter your search term..." id="searchInput">
                        <button class="search-submit">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                    <div class="search-results">
                        <p>Search functionality coming soon!</p>
                    </div>
                </div>
            `;
            document.body.appendChild(searchOverlay);
            
            // Add styles for search overlay
            const searchStyles = `
                #searchOverlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    z-index: 2000;
                    padding-top: 100px;
                }
                .search-modal {
                    background: white;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 600px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                .search-header {
                    display: flex;
                    justify-content: between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }
                .search-header h3 {
                    margin: 0;
                    color: var(--stanford-red);
                }
                .search-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: var(--stanford-cool-gray);
                }
                .search-input-container {
                    display: flex;
                    padding: 20px;
                    gap: 10px;
                }
                #searchInput {
                    flex: 1;
                    padding: 12px;
                    border: 2px solid var(--stanford-light-gray);
                    border-radius: 4px;
                    font-size: 16px;
                }
                .search-submit {
                    background: var(--stanford-red);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .search-results {
                    padding: 20px;
                    text-align: center;
                    color: var(--stanford-cool-gray);
                }
                [data-theme="dark"] .search-modal {
                    background: #2a2a2a;
                    color: #e0e0e0;
                }
                [data-theme="dark"] #searchInput {
                    background: #1a1a1a;
                    border-color: #3a3a3a;
                    color: #e0e0e0;
                }
            `;
            
            const styleSheet = document.createElement('style');
            styleSheet.textContent = searchStyles;
            document.head.appendChild(styleSheet);
            
            // Close search functionality
            const closeBtn = searchOverlay.querySelector('.search-close');
            closeBtn.addEventListener('click', () => {
                searchOverlay.remove();
            });
            
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    searchOverlay.remove();
                }
            });
            
            // Focus on search input
            const searchInput = searchOverlay.querySelector('#searchInput');
            searchInput.focus();
        }
    });
}

// Handle window resize
function handleResize() {
    if (window.innerWidth > 768 && navLinks) {
        navLinks.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Close all dropdowns on desktop
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
}

// Initialize all functionality
function initializeApp() {
    initializeTheme();
    initializeMobileDropdowns();
    initializeSmoothScrolling();
    initializeActiveNavigation();
    
    // Add ARIA labels for accessibility
    if (mobileToggle) {
        mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-controls', 'main-navigation');
    }
    
    if (navLinks) {
        navLinks.id = 'main-navigation';
    }
    
    console.log('Research Undergraduate Society website loaded successfully');
}

// Event listeners
window.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('resize', handleResize);

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only update if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            body.setAttribute('data-theme', 'dark');
            updateDarkModeIcon(true);
        } else {
            body.removeAttribute('data-theme');
            updateDarkModeIcon(false);
        }
    }
});
