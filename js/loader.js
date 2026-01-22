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
