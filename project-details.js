// Initialize swiper
let swiper = null;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get project ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = decodeURIComponent(urlParams.get('id'));
        
        console.log('Loading project:', projectId); // Debug log
        
        if (!projectId) {
            throw new Error('No project ID found in URL');
        }

        // Fetch project data
        const response = await fetch('projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Loaded projects data:', data); // Debug log
        
        // Find the project
        const project = data.projects.find(p => 
            p.title.toLowerCase().replace(/\s+/g, '-') === projectId
        );
        
        console.log('Found project:', project); // Debug log
        
        if (!project) {
            throw new Error(`Project not found: ${projectId}`);
        }

        // Update page content
        document.title = `${project.title} - Project Details`;
        
        // Update title
        const titleElement = document.getElementById('project-title');
        if (titleElement) {
            titleElement.textContent = project.title;
        }
        
        // Update description
        const descElement = document.getElementById('project-description');
        if (descElement) {
            descElement.textContent = project.description;
        }

        // Update technologies
        const techContainer = document.getElementById('project-technologies');
        if (techContainer) {
            if (project.technologies && project.technologies.length > 0) {
                techContainer.innerHTML = project.technologies.map(tech => `
                    <div class="tech-tag card-badge">
                        <span>${tech}</span>
                    </div>
                `).join('');
            } else {
                const techGroup = techContainer.closest('.skills-group');
                if (techGroup) techGroup.style.display = 'none';
            }
        }

        // Update topics
        const topicsContainer = document.getElementById('project-topics');
        if (topicsContainer) {
            if (project.topics && project.topics.length > 0) {
                topicsContainer.innerHTML = project.topics.map(topic => `
                    <div class="topic-tag card-badge">
                        <span>${topic}</span>
                    </div>
                `).join('');
            } else {
                const topicsGroup = topicsContainer.closest('.skills-group');
                if (topicsGroup) topicsGroup.style.display = 'none';
            }
        }

        // Update media
        const mediaContainer = document.getElementById('media-container');
        if (mediaContainer) {
            if (project.media && project.media.length > 0) {
                mediaContainer.innerHTML = project.media.map(item => `
                    <div class="swiper-slide">
                        ${item.type === 'video' ? `
                            <video controls>
                                <source src="${item.url}" type="video/mp4">
                                Your browser does not support the video tag.
                            </video>
                        ` : `
                            <img src="${item.url}" alt="${item.caption || project.title}">
                        `}
                        ${item.caption ? `<div class="swiper-caption">${item.caption}</div>` : ''}
                    </div>
                `).join('');

                // Initialize Swiper
                new Swiper('.swiper', {
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    loop: project.media.length > 1,
                });
            } else {
                const mediaSection = mediaContainer.closest('.project-section');
                if (mediaSection) mediaSection.style.display = 'none';
            }
        }

        // Update links
        const linksContainer = document.getElementById('project-links-container');
        if (linksContainer) {
            if (project.links && Object.keys(project.links).length > 0) {
                linksContainer.innerHTML = Object.entries(project.links).map(([type, url]) => {
                    const icon = type === 'github' ? 'fab fa-github' :
                               type === 'demo' ? 'fas fa-external-link-alt' :
                               type === 'documentation' ? 'fas fa-book' :
                               'fas fa-link';
                    return `
                        <a href="${url}" target="_blank" rel="noopener noreferrer" class="project-link">
                            <i class="${icon}"></i>
                            ${type.charAt(0).toUpperCase() + type.slice(1)}
                        </a>
                    `;
                }).join('');
            } else {
                const linksGroup = linksContainer.closest('.links-group');
                if (linksGroup) linksGroup.style.display = 'none';
            }
        }

        // Update awards
        const awardsContainer = document.getElementById('project-awards');
        if (awardsContainer) {
            if (project.awards && project.awards.length > 0) {
                awardsContainer.innerHTML = project.awards.map(award => `
                    <li>
                        <i class="fas fa-trophy"></i>
                        <span>${award}</span>
                    </li>
                `).join('');
            } else {
                const awardsGroup = awardsContainer.closest('.awards-group');
                if (awardsGroup) awardsGroup.style.display = 'none';
            }
        }

    } catch (error) {
        console.error('Error loading project details:', error);
        
        // Show error message on page
        const container = document.querySelector('.project-details-container');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h2>Error Loading Project</h2>
                    <p>${error.message}</p>
                    <a href="index.html#projects">Return to Projects</a>
                </div>
            `;
        }
    }
});
