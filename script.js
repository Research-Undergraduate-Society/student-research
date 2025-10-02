// --- Hamburger Menu Toggle ---
const hamburger = document.querySelector('.hamburger-menu');
const sidebar = document.querySelector('.sidebar-nav');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  const isExpanded = sidebar.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isExpanded);
});

// Close sidebar when a link is clicked
document.querySelectorAll('.sidebar-nav li a').forEach(link => {
    link.addEventListener('click', () => {
        if (sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});


// --- Other Scripts ---

// Smooth scroll for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Automatically highlight active link in BOTH main nav and sidebar
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a, .sidebar-nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
