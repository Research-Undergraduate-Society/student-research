// Function to load members from a JSON file into a specific HTML container
async function loadMembers(jsonPath, containerId) {
    try {
        const response = await fetch(jsonPath);
        const members = await response.json();
        
        const container = document.getElementById(containerId);
        
        // Clear container first
        container.innerHTML = '';

        // Create a card for each member
        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card';
            
            // Simple name display
            card.innerHTML = `<div class="member-name">${member}</div>`;
            
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading members:', error);
    }
}
/* --- 1. MEMBER LOADER (From previous step) --- */
async function loadMembers(jsonPath, containerId) {
    try {
        const response = await fetch(jsonPath);
        const members = await response.json();
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card';
            card.innerHTML = `<div class="member-name">${member}</div>`;
            container.appendChild(card);
        });
    } catch (error) { console.error('Error loading members:', error); }
}

/* --- 2. PROJECT LOADER (With Modal Logic) --- */
async function loadProjects(jsonPath, containerId) {
    try {
        const response = await fetch(jsonPath);
        const projects = await response.json();
        const container = document.getElementById(containerId);
        
        container.innerHTML = '';

        projects.forEach((proj, index) => {
            const card = document.createElement('div');
            card.className = 'soc-card'; // Reusing the card style
            
            // "Read More" triggers the openModal function with the project index
            card.innerHTML = `
                <div class="card-content">
                    <h3>${proj.title}</h3>
                    <p style="font-size:0.9rem; color:#666; margin-bottom:1rem;">${proj.status}</p>
                    <p>${proj.summary}</p>
                    <button class="link-text btn-reset" onclick="openModal(${index})">Read More &rarr;</button>
                </div>
            `;
            container.appendChild(card);
        });

        // Save data globally so the modal can access it
        window.projectData = projects; 

    } catch (error) { console.error('Error loading projects:', error); }
}

// Modal Functions
function openModal(index) {
    const data = window.projectData[index];
    const modal = document.getElementById('project-modal');
    
    // Populate Modal
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-meta').innerText = `Status: ${data.status} | Team: ${data.team}`;
    document.getElementById('modal-img').src = data.image || 'assets/placeholder.jpg'; // Fallback image
    document.getElementById('modal-desc').innerHTML = data.fullDescription; // Allows HTML in description
    
    // Show Modal
    modal.style.display = 'flex';
}

// Close Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    if(modal) {
        const closeBtn = document.querySelector('.close-modal');
        // Close on 'X' click
        closeBtn.onclick = () => modal.style.display = "none";
        // Close on outside click
        window.onclick = (e) => {
            if (e.target == modal) modal.style.display = "none";
        }
    }
});


/* --- 3. ARTICLE LOADER (Auto-Download) --- */
async function loadArticles(jsonPath, containerId) {
    try {
        const response = await fetch(jsonPath);
        const articles = await response.json();
        const container = document.getElementById(containerId);
        
        container.innerHTML = '';

        articles.forEach(art => {
            // The <a> tag has the 'download' attribute
            const item = document.createElement('a');
            item.className = 'article-item';
            item.href = art.filepath;
            item.setAttribute('download', ''); // Forces download
            
            item.innerHTML = `
                <div class="art-title">${art.title}</div>
                <div class="art-date">${art.date}</div>
                <div class="art-summary">${art.summary}</div>
                <div class="download-icon">↓ Download PDF</div>
            `;
            container.appendChild(item);
        });
    } catch (error) { console.error('Error loading articles:', error); }
}
