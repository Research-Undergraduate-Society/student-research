// --- Hamburger Menu Toggle ---
const hamburger = document.querySelector('.hamburger-menu');
const sidebar = document.querySelector('.sidebar-nav');

// Toggle sidebar on hamburger click
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  // For accessibility: update aria-expanded attribute
  const isExpanded = sidebar.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isExpanded);
});

// Close sidebar when a link inside it is clicked
document.querySelectorAll('.sidebar-nav li a').forEach(link => {
    link.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});


// --- General Scripts ---

// Smooth scroll for any on-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Automatically highlight active link in BOTH the main nav and the sidebar
// Handles case for root path '/' correctly mapping to index.html
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a, .sidebar-nav a').forEach(link => {
  // Check if the link's href matches the current page's filename
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
