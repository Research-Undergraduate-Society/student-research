/* --- 1. MEMBER LOADER --- */
async function loadMembers(jsonPath, containerId) {
    try {
        const response = await fetch(jsonPath);
        const members = await response.json();
        const container = document.getElementById(containerId);
        
        // Use Fragment for performance (Single DOM reflow)
        const fragment = document.createDocumentFragment();

        members.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card';
            
            // Create inner text node safely
            const nameDiv = document.createElement('div');
            nameDiv.className = 'member-name';
            nameDiv.textContent = member;
            
            card.appendChild(nameDiv);
            fragment.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(fragment);

    } catch (error) { console.error('Error loading members:', error); }
}

/* --- 2. PROJECT LOADER --- */
// Using a closure to store project data safely, avoiding global variables
const projectManager = (() => {
    let _data = [];

    async function load(jsonPath, containerId) {
        try {
            const response = await fetch(jsonPath);
            _data = await response.json();
            const container = document.getElementById(containerId);
            const fragment = document.createDocumentFragment();

            _data.forEach((proj, index) => {
                const card = document.createElement('div');
                card.className = 'soc-card'; 
                card.innerHTML = `
                    <div class="card-content">
                        <h3>${proj.title}</h3>
                        <p style="font-size:0.9rem; color:#666; margin-bottom:1rem;">${proj.status}</p>
                        <p>${proj.summary}</p>
                        <button class="link-text btn-reset" onclick="projectManager.open(${index})">Read More &rarr;</button>
                    </div>
                `;
                fragment.appendChild(card);
            });

            container.innerHTML = '';
            container.appendChild(fragment);
        } catch (error) { console.error('Error loading projects:', error); }
    }

    function openModal(index) {
        const data = _data[index];
        const modal = document.getElementById('project-modal');
        if (!modal) return;
        
        document.getElementById('modal-title').innerText = data.title;
        document.getElementById('modal-meta').innerText = `Status: ${data.status} | Team: ${data.team}`;
        document.getElementById('modal-img').src = data.image || 'assets/placeholder.jpg';
        document.getElementById('modal-desc').innerHTML = data.fullDescription;
        
        modal.style.display = 'flex';
    }

    return { load, open: openModal };
})();

// Helper for closing modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('project-modal');
    if(modal) {
        const closeBtn = document.querySelector('.close-modal');
        closeBtn.onclick = () => modal.style.display = "none";
        window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }
    }
});


/* --- 3. ARTICLE LOADER --- */
async function loadArticles(jsonPath, containerId) {
    try {
        const response = await fetch(jsonPath);
        const articles = await response.json();
        const container = document.getElementById(containerId);
        const fragment = document.createDocumentFragment();

        articles.forEach(art => {
            const item = document.createElement('a');
            item.className = 'article-item';
            item.href = art.filepath;
            item.setAttribute('download', '');
            
            item.innerHTML = `
                <div class="art-title">${art.title}</div>
                <div class="art-date">${art.date}</div>
                <div class="art-summary">${art.summary}</div>
                <div class="download-icon">↓ Download PDF</div>
            `;
            fragment.appendChild(item);
        });

        container.innerHTML = '';
        container.appendChild(fragment);

    } catch (error) { console.error('Error loading articles:', error); }
}
