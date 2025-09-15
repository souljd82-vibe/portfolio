// Portfolio Management System
class PortfolioManager {
    constructor() {
        this.projects = this.loadProjects();
        this.currentFilter = 'all';
        this.initializeEventListeners();
        this.renderProjects();
        this.updateStats();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Navigation filters
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveFilter(btn.dataset.filter);
            });
        });

        // Add project button
        document.getElementById('addProjectBtn').addEventListener('click', () => {
            this.showAddProjectModal();
        });

        // Modal controls
        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.hideAddProjectModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideAddProjectModal();
        });

        // Form submission
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProject();
        });

        // Close modal on outside click
        document.getElementById('addProjectModal').addEventListener('click', (e) => {
            if (e.target.id === 'addProjectModal') {
                this.hideAddProjectModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAddProjectModal();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.showAddProjectModal();
            }
        });
    }

    // Load projects from localStorage
    loadProjects() {
        const saved = localStorage.getItem('vibe-portfolio-projects');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error loading projects:', e);
            }
        }

        // Return sample projects if no saved data
        return [
            {
                id: this.generateId(),
                title: "샘플 웹 프로젝트",
                description: "Vibe 코딩으로 만든 반응형 웹사이트 예시",
                category: "web",
                tags: ["HTML", "CSS", "JavaScript"],
                demoLink: "#",
                codeLink: "#",
                imageUrl: "",
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "모바일 앱 프로젝트",
                description: "React Native로 개발한 크로스 플랫폼 앱",
                category: "app",
                tags: ["React Native", "Firebase"],
                demoLink: "#",
                codeLink: "#",
                imageUrl: "",
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "브라우저 게임",
                description: "JavaScript Canvas를 활용한 2D 게임",
                category: "game",
                tags: ["Canvas", "Game Dev"],
                demoLink: "#",
                codeLink: "#",
                imageUrl: "",
                createdAt: new Date().toISOString()
            }
        ];
    }

    // Save projects to localStorage
    saveProjects() {
        try {
            localStorage.setItem('vibe-portfolio-projects', JSON.stringify(this.projects));
        } catch (e) {
            console.error('Error saving projects:', e);
            this.showNotification('프로젝트 저장에 실패했습니다.', 'error');
        }
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Set active filter
    setActiveFilter(filter) {
        this.currentFilter = filter;

        // Update active button
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        this.renderProjects();
    }

    // Render projects based on current filter
    renderProjects() {
        const container = document.getElementById('projectsGrid');
        const emptyState = document.getElementById('emptyState');

        let filteredProjects = this.projects;
        if (this.currentFilter !== 'all') {
            filteredProjects = this.projects.filter(project =>
                project.category === this.currentFilter
            );
        }

        if (filteredProjects.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        container.innerHTML = filteredProjects.map(project => this.createProjectCard(project)).join('');

        // Add fade-in animation
        container.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Create project card HTML
    createProjectCard(project) {
        const categoryIcons = {
            web: 'fas fa-globe',
            app: 'fas fa-mobile-alt',
            game: 'fas fa-gamepad'
        };

        const categoryNames = {
            web: '웹',
            app: '앱',
            game: '게임'
        };

        const tags = project.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        const imageHtml = project.imageUrl
            ? `<img src="${project.imageUrl}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`
            : '';

        const placeholderStyle = project.imageUrl ? 'style="display: none;"' : '';

        return `
            <article class="project-card" data-category="${project.category}" data-id="${project.id}">
                <div class="project-image">
                    ${imageHtml}
                    <div class="project-placeholder" ${placeholderStyle}>
                        <i class="${categoryIcons[project.category] || 'fas fa-image'}"></i>
                    </div>
                    <div class="project-actions">
                        <button class="action-btn edit-btn" onclick="portfolioManager.editProject('${project.id}')" title="편집">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="portfolioManager.deleteProject('${project.id}')" title="삭제">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="project-info">
                    <div class="project-meta">
                        <span class="project-category">
                            <i class="${categoryIcons[project.category]}"></i>
                            ${categoryNames[project.category]}
                        </span>
                        <span class="project-date">${this.formatDate(project.createdAt)}</span>
                    </div>
                    <h3 class="project-title">${this.escapeHtml(project.title)}</h3>
                    <p class="project-description">${this.escapeHtml(project.description)}</p>
                    <div class="project-tags">
                        ${tags}
                    </div>
                    <div class="project-links">
                        ${project.demoLink && project.demoLink !== '#' ?
                            `<a href="${project.demoLink}" class="project-link" target="_blank" rel="noopener noreferrer">
                                <i class="fas fa-external-link-alt"></i> 데모
                            </a>` : ''}
                        ${project.codeLink && project.codeLink !== '#' ?
                            `<a href="${project.codeLink}" class="project-link" target="_blank" rel="noopener noreferrer">
                                <i class="fab fa-github"></i> 코드
                            </a>` : ''}
                        ${(!project.demoLink || project.demoLink === '#') && (!project.codeLink || project.codeLink === '#') ?
                            '<span class="project-link disabled">링크 준비중</span>' : ''}
                    </div>
                </div>
            </article>
        `;
    }

    // Show add project modal
    showAddProjectModal() {
        const modal = document.getElementById('addProjectModal');
        const form = document.getElementById('projectForm');

        form.reset();
        form.dataset.mode = 'add';
        delete form.dataset.editId;

        document.querySelector('.modal-header h2').innerHTML = '<i class="fas fa-plus"></i> 새 프로젝트 추가';

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Focus first input
        setTimeout(() => {
            document.getElementById('projectTitle').focus();
        }, 100);
    }

    // Hide add project modal
    hideAddProjectModal() {
        const modal = document.getElementById('addProjectModal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Add new project
    addProject() {
        const form = document.getElementById('projectForm');
        const formData = new FormData(form);

        const title = document.getElementById('projectTitle').value.trim();
        const description = document.getElementById('projectDescription').value.trim();
        const category = document.getElementById('projectCategory').value;
        const tags = document.getElementById('projectTags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        const demoLink = document.getElementById('demoLink').value.trim();
        const codeLink = document.getElementById('codeLink').value.trim();
        const imageUrl = document.getElementById('projectImage').value.trim();

        // Validation
        if (!title || !description || !category) {
            this.showNotification('필수 항목을 모두 입력해주세요.', 'error');
            return;
        }

        if (tags.length === 0) {
            this.showNotification('최소 하나의 기술 스택을 입력해주세요.', 'error');
            return;
        }

        const project = {
            id: form.dataset.editId || this.generateId(),
            title,
            description,
            category,
            tags,
            demoLink: demoLink || '',
            codeLink: codeLink || '',
            imageUrl: imageUrl || '',
            createdAt: form.dataset.editId ? this.projects.find(p => p.id === form.dataset.editId).createdAt : new Date().toISOString(),
            updatedAt: form.dataset.editId ? new Date().toISOString() : undefined
        };

        if (form.dataset.mode === 'edit') {
            const index = this.projects.findIndex(p => p.id === project.id);
            if (index !== -1) {
                this.projects[index] = project;
                this.showNotification('프로젝트가 성공적으로 수정되었습니다!', 'success');
            }
        } else {
            this.projects.unshift(project);
            this.showNotification('프로젝트가 성공적으로 추가되었습니다!', 'success');
        }

        this.saveProjects();
        this.renderProjects();
        this.updateStats();
        this.hideAddProjectModal();
    }

    // Edit project
    editProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (!project) {
            this.showNotification('프로젝트를 찾을 수 없습니다.', 'error');
            return;
        }

        const form = document.getElementById('projectForm');
        form.dataset.mode = 'edit';
        form.dataset.editId = id;

        // Populate form
        document.getElementById('projectTitle').value = project.title;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectCategory').value = project.category;
        document.getElementById('projectTags').value = project.tags.join(', ');
        document.getElementById('demoLink').value = project.demoLink || '';
        document.getElementById('codeLink').value = project.codeLink || '';
        document.getElementById('projectImage').value = project.imageUrl || '';

        document.querySelector('.modal-header h2').innerHTML = '<i class="fas fa-edit"></i> 프로젝트 수정';

        this.showAddProjectModal();
    }

    // Delete project with confirmation
    deleteProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (!project) return;

        if (confirm(`"${project.title}" 프로젝트를 삭제하시겠습니까?`)) {
            this.projects = this.projects.filter(p => p.id !== id);
            this.saveProjects();
            this.renderProjects();
            this.updateStats();
            this.showNotification('프로젝트가 삭제되었습니다.', 'success');
        }
    }

    // Update statistics
    updateStats() {
        const totalProjects = this.projects.length;
        const lastUpdated = totalProjects > 0
            ? this.formatRelativeDate(Math.max(...this.projects.map(p => new Date(p.updatedAt || p.createdAt))))
            : '없음';

        document.getElementById('totalProjects').textContent = totalProjects;
        document.getElementById('lastUpdated').textContent = lastUpdated;
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format relative date
    formatRelativeDate(date) {
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return '오늘';
        if (days === 1) return '어제';
        if (days < 7) return `${days}일 전`;
        if (days < 30) return `${Math.floor(days / 7)}주 전`;
        if (days < 365) return `${Math.floor(days / 30)}개월 전`;
        return `${Math.floor(days / 365)}년 전`;
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto remove
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // Export projects as JSON
    exportProjects() {
        const dataStr = JSON.stringify(this.projects, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `vibe-portfolio-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
        this.showNotification('프로젝트 데이터가 내보내기되었습니다!', 'success');
    }

    // Import projects from JSON
    importProjects(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedProjects = JSON.parse(e.target.result);
                if (Array.isArray(importedProjects)) {
                    // Merge with existing projects (avoid duplicates)
                    const existingIds = new Set(this.projects.map(p => p.id));
                    const newProjects = importedProjects.filter(p => !existingIds.has(p.id));

                    this.projects = [...newProjects, ...this.projects];
                    this.saveProjects();
                    this.renderProjects();
                    this.updateStats();

                    this.showNotification(`${newProjects.length}개의 프로젝트가 가져오기되었습니다!`, 'success');
                } else {
                    this.showNotification('올바르지 않은 파일 형식입니다.', 'error');
                }
            } catch (error) {
                this.showNotification('파일을 읽는데 실패했습니다.', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Search projects
    searchProjects(query) {
        if (!query.trim()) {
            this.renderProjects();
            return;
        }

        const searchTerm = query.toLowerCase();
        const filteredProjects = this.projects.filter(project =>
            project.title.toLowerCase().includes(searchTerm) ||
            project.description.toLowerCase().includes(searchTerm) ||
            project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

        this.renderFilteredProjects(filteredProjects);
    }

    // Render filtered projects
    renderFilteredProjects(projects) {
        const container = document.getElementById('projectsGrid');
        const emptyState = document.getElementById('emptyState');

        if (projects.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>검색 결과가 없습니다</h3>
                <p>다른 키워드로 검색해보세요.</p>
            `;
            return;
        }

        emptyState.style.display = 'none';
        container.innerHTML = projects.map(project => this.createProjectCard(project)).join('');
    }
}

// Add CSS for project actions and notifications
const additionalStyles = `
    .project-actions {
        position: absolute;
        top: 1rem;
        right: 1rem;
        display: flex;
        gap: 0.5rem;
        opacity: 0;
        transition: var(--transition);
    }

    .project-card:hover .project-actions {
        opacity: 1;
    }

    .action-btn {
        width: 2.5rem;
        height: 2.5rem;
        border: none;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
    }

    .edit-btn {
        background: var(--primary-color);
        color: white;
    }

    .edit-btn:hover {
        background: var(--primary-dark);
        transform: scale(1.1);
    }

    .delete-btn {
        background: var(--danger-color);
        color: white;
    }

    .delete-btn:hover {
        background: #dc2626;
        transform: scale(1.1);
    }

    .project-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--space-sm);
        font-size: 0.85rem;
    }

    .project-category {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: var(--primary-color);
        font-weight: 500;
    }

    .project-date {
        color: var(--text-muted);
    }

    .project-link.disabled {
        background: var(--text-muted);
        cursor: not-allowed;
    }

    .notification {
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: white;
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1001;
        border-left: 4px solid var(--primary-color);
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left-color: var(--accent-color);
    }

    .notification-error {
        border-left-color: var(--danger-color);
    }

    .notification-content {
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-primary);
    }

    .notification i {
        font-size: 1.25rem;
    }

    .notification-success i {
        color: var(--accent-color);
    }

    .notification-error i {
        color: var(--danger-color);
    }

    @media (max-width: 768px) {
        .notification {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            transform: translateY(-100%);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Global functions for onclick handlers
window.showAddProjectModal = () => portfolioManager.showAddProjectModal();

// Initialize portfolio manager when DOM is loaded
let portfolioManager;

document.addEventListener('DOMContentLoaded', () => {
    portfolioManager = new PortfolioManager();

    // Add keyboard shortcuts info
    console.log('🚀 Vibe Coding Portfolio loaded!');
    console.log('⌨️ Keyboard shortcuts:');
    console.log('  • Ctrl + N: Add new project');
    console.log('  • Escape: Close modal');
});

// Export for global access
window.portfolioManager = portfolioManager;