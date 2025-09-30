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
const currentPage = window.location.pathname.split('/').pop();
document.querySelectorAll('nav ul li a').forEach(link => {
  if(link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// Optional: Mobile nav toggle (if you add a mobile menu button)
// Example:
// const navToggle = document.querySelector('.nav-toggle');
// const navMenu = document.querySelector('nav ul');
// navToggle.addEventListener('click', () => {
//   navMenu.classList.toggle('open');
// });
