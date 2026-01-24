/* * COMPONENTS.JS
 * Injects Navigation and Footer to ensure consistency across pages.
 * Handles Mobile Menu and Active Link Highlighting.
 */

const navHTML = `
<nav class="navbar">
    <div class="logo">RUS</div>
    <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li class="dropdown" tabindex="0"> <a href="#" class="dropbtn">Societies ▾</a>
            <div class="dropdown-content">
                <a href="math.html">Mathematics</a>
                <a href="physics.html">Physics</a>
            </div>
        </li>
        <li><a href="projects.html">Projects</a></li>
        <li><a href="articles.html">Articles</a></li>
        <li><a href="newspaper.html">Newspaper</a></li>
        <li><a href="faculty.html">Faculty</a></li>
        <li><a href="#contact" class="contact-btn">Contact</a></li>
    </ul>
    <button class="burger" aria-label="Toggle navigation">
        <div class="line1"></div>
        <div class="line2"></div>
        <div class="line3"></div>
    </button>
</nav>
`;

const footerHTML = `
<footer id="contact">
    <div class="footer-content">
        <div class="footer-col">
            <h3>Join the Research</h3>
            <p>Ready to move beyond the textbook? Applications are open for the Spring 2026 semester.</p>
            <div class="action-links">
                <a href="#" target="_blank" class="footer-btn">Apply for Membership &rarr;</a>
                <a href="#" target="_blank" class="footer-btn">Submit an Article &rarr;</a>
            </div>
        </div>
        
        <div class="footer-col">
            <h3>Contact Us</h3>
            <p style="margin-bottom: 0.5rem;"><strong>Email:</strong></p>
            <p><a href="mailto:contact@rus-college.edu">contact@rus-college.edu</a></p>
            
            <p style="margin-top: 1.5rem; margin-bottom: 0.5rem;"><strong>Lab Location:</strong></p>
            <p>Undergraduate Campus,<br>Science Block A, Room 304<br>Rourkela, Odisha</p>
        </div>

        <div class="footer-col">
            <h3>Society Links</h3>
            <ul style="line-height: 2; font-size: 0.95rem;">
                <li><a href="math.html">Mathematics Society</a></li>
                <li><a href="physics.html">Physics Society</a></li>
                <li><a href="projects.html">Archive & Projects</a></li>
                <li><a href="faculty.html">Faculty Mentors</a></li>
            </ul>
        </div>
    </div>

    <div class="copyright">
        <p>&copy; 2025 Research Undergraduate Society. Bridging Curiosity and Discovery.</p>
    </div>
</footer>
`;

// Inject components and initialize logic
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Header at the top
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // 2. Inject Footer at the bottom
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 3. Initialize Interactive Logic (Burger & Highlight)
    initNavLogic();
});

function initNavLogic() {
    // --- BURGER MENU LOGIC ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // --- ACTIVE LINK HIGHLIGHTING ---
    const currentLocation = location.pathname.split('/').pop() || 'index.html'; // Gets filename
    const menuItems = document.querySelectorAll('.nav-links a');
    
    menuItems.forEach(item => {
        // Check if href matches current file
        if(item.getAttribute('href') === currentLocation) {
            item.classList.add('active');
        }
    });
}
