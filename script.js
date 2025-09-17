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

        // Close modal on outside click (but not during text selection/drag)
        let isTextSelecting = false;
        let textSelectionStartTime = 0;
        let mouseDownOnInput = false;

        // 텍스트 필드에서 마우스 다운 감지
        document.getElementById('addProjectModal').addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                mouseDownOnInput = true;
                isTextSelecting = false;
                textSelectionStartTime = Date.now();
                console.log('텍스트 필드 mousedown 감지');
            } else {
                mouseDownOnInput = false;
            }
        });

        // 마우스 이동 중 텍스트 선택 감지 (방향 무관)
        document.getElementById('addProjectModal').addEventListener('mousemove', (e) => {
            if (mouseDownOnInput && e.buttons === 1) { // 왼쪽 마우스 버튼이 눌려있을 때
                const timeSinceStart = Date.now() - textSelectionStartTime;
                if (timeSinceStart > 50) { // 50ms 이상이면 텍스트 선택 중으로 인식
                    isTextSelecting = true;
                    console.log('텍스트 선택 중 감지');
                }
            }
        });

        // 마우스 업 시 텍스트 선택 상태 해제 (지연 적용)
        document.getElementById('addProjectModal').addEventListener('mouseup', () => {
            console.log('mouseup - 텍스트 선택 종료 예약');
            setTimeout(() => {
                isTextSelecting = false;
                mouseDownOnInput = false;
                console.log('텍스트 선택 상태 완전 해제');
            }, 200); // 200ms 지연으로 안전하게 처리
        });

        // 텍스트 선택 이벤트도 추가로 감지
        document.getElementById('addProjectModal').addEventListener('selectstart', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                isTextSelecting = true;
                console.log('selectstart 이벤트로 텍스트 선택 감지');
            }
        });

        // 외부 클릭으로 모달 닫기 (텍스트 선택 중이 아닐 때만)
        document.getElementById('addProjectModal').addEventListener('click', (e) => {
            console.log('모달 클릭:', e.target.id, '텍스트 선택 중:', isTextSelecting);
            if (e.target.id === 'addProjectModal' && !isTextSelecting) {
                console.log('모달 닫기 실행');
                this.hideAddProjectModal();
            } else if (isTextSelecting) {
                console.log('텍스트 선택 중이므로 모달 닫기 취소');
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

        // Return fresh sample projects
        return [
            {
                id: this.generateId(),
                title: "반응형 포트폴리오 웹사이트",
                description: "Vibe 코딩으로 제작한 개인 포트폴리오 사이트",
                category: "web",
                tags: ["HTML5", "CSS3", "JavaScript", "반응형"],
                demoLink: "",
                codeLink: "",
                imageUrl: "",
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "할일 관리 앱",
                description: "일정과 할일을 효율적으로 관리하는 웹 어플리케이션",
                category: "app",
                tags: ["React", "localStorage", "PWA"],
                demoLink: "",
                codeLink: "",
                imageUrl: "",
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "2048 퍼즐 게임",
                description: "JavaScript로 구현한 인기 퍼즐 게임",
                category: "game",
                tags: ["JavaScript", "Canvas", "게임개발"],
                demoLink: "",
                codeLink: "",
                imageUrl: "",
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "날씨 정보 대시보드",
                description: "실시간 날씨 정보를 보여주는 인터랙티브 대시보드",
                category: "web",
                tags: ["API", "Chart.js", "날씨", "대시보드"],
                demoLink: "",
                codeLink: "",
                imageUrl: "",
                createdAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                title: "음식 주문 앱",
                description: "음식점 메뉴 탐색과 주문을 위한 모바일 앱",
                category: "app",
                tags: ["React Native", "Firebase", "결제시스템"],
                demoLink: "",
                codeLink: "",
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
                        <button class="action-btn edit-btn" onclick="window.portfolioManager.editProject('${project.id}')" title="편집">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="window.portfolioManager.deleteProject('${project.id}')" title="삭제">
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
                                <i class="fas fa-external-link-alt"></i> 링크
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
    showAddProjectModal(isEdit = false) {
        const modal = document.getElementById('addProjectModal');
        const form = document.getElementById('projectForm');

        // 편집 모드가 아닐 때만 폼 리셋 및 기본 설정
        if (!isEdit) {
            form.reset();
            form.dataset.mode = 'add';
            delete form.dataset.editId;
            document.querySelector('.modal-header h2').innerHTML = '<i class="fas fa-plus"></i> 새 프로젝트 추가';
        }
        // 편집 모드일 때는 제목이 이미 editProject에서 설정됨

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
        console.log('편집 시도:', id);
        console.log('현재 프로젝트들:', this.projects);

        const project = this.projects.find(p => p.id === id);
        if (!project) {
            console.error('프로젝트를 찾을 수 없음:', id);
            this.showNotification('프로젝트를 찾을 수 없습니다.', 'error');
            return;
        }

        console.log('편집할 프로젝트:', project);

        const form = document.getElementById('projectForm');
        if (!form) {
            console.error('폼을 찾을 수 없음');
            return;
        }

        // 폼 모드 설정
        form.dataset.mode = 'edit';
        form.dataset.editId = id;

        // 폼 초기화 후 데이터 입력
        form.reset();

        // 약간의 지연을 두고 값 설정
        setTimeout(() => {
            document.getElementById('projectTitle').value = project.title || '';
            document.getElementById('projectDescription').value = project.description || '';
            document.getElementById('projectCategory').value = project.category || '';
            document.getElementById('projectTags').value = project.tags ? project.tags.join(', ') : '';
            document.getElementById('demoLink').value = project.demoLink || '';
            document.getElementById('codeLink').value = project.codeLink || '';
            document.getElementById('projectImage').value = project.imageUrl || '';

            console.log('폼 값 설정 완료');
        }, 100);

        // 제목 변경
        const modalTitle = document.querySelector('.modal-header h2');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="fas fa-edit"></i> 프로젝트 수정';
        }

        this.showAddProjectModal(true);
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

// 스타일은 이제 styles.css에 포함되어 있음

// Global functions for onclick handlers
window.showAddProjectModal = () => {
    if (window.portfolioManager) {
        window.portfolioManager.showAddProjectModal(false); // 새 프로젝트 추가 모드
    } else {
        console.error('portfolioManager가 아직 초기화되지 않았습니다');
    }
};

// Initialize portfolio manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioManager = new PortfolioManager();

    // Add keyboard shortcuts info
    console.log('🚀 Vibe Coding Portfolio loaded! (Updated: Demo->Link)');
    console.log('⌨️ Keyboard shortcuts:');
    console.log('  • Ctrl + N: Add new project');
    console.log('  • Escape: Close modal');

    // 디버그용 전역 접근
    console.log('portfolioManager가 window에 등록됨:', window.portfolioManager);
});