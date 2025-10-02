// --- NEW: Hamburger Menu Toggle ---
const hamburger = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // For accessibility: update aria-expanded attribute
  const isExpanded = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isExpanded);
});

// Close sidebar when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
});


// --- EXISTING SCRIPT (with minor update) ---

// Smooth scroll for any anchor links (like #section)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Automatically highlight active navbar link based on current page
// Handles case for root path '/' correctly mapping to index.html
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links li a').forEach(link => {
  if(link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
