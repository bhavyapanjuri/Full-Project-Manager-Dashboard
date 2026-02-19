const appState = {
    projects: [],
    tasks: [],
    currentEditTask: null,
    currentEditProject: null,
    userProfile: {
        name: 'User',
        email: '',
        jobTitle: '',
        department: '',
        phone: '',
        bio: '',
        theme: 'light',
        avatar: 'U',
        avatarColor: '#4f46e5',
        profileImage: null
    }
};

const STORAGE_KEY = 'pmDashboardData';

function initDashboard() {
    loadFromLocalStorage();
    initializeSampleData();
    setupEventListeners();
    renderDashboard();
    renderProjects();
    renderTasks();
    renderAnalytics();
    setMinDate();
}

function initializeSampleData() {
    if (appState.projects.length === 0 && appState.tasks.length === 0) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        appState.projects = [
            {
                id: 1,
                name: 'Website Redesign',
                description: 'Complete overhaul of company website with modern UI/UX',
                startDate: lastWeek.toISOString().split('T')[0],
                createdAt: lastWeek.toISOString()
            },
            {
                id: 2,
                name: 'Mobile App Development',
                description: 'Build cross-platform mobile application',
                startDate: today.toISOString().split('T')[0],
                createdAt: today.toISOString()
            },
            {
                id: 3,
                name: 'Marketing Campaign',
                description: 'Q1 digital marketing strategy and execution',
                startDate: lastWeek.toISOString().split('T')[0],
                createdAt: lastWeek.toISOString()
            }
        ];

        appState.tasks = [
            {
                id: 101,
                title: 'Design Homepage Mockup',
                description: 'Create high-fidelity mockup for new homepage',
                project: 'Website Redesign',
                priority: 'High',
                status: 'Completed',
                deadline: lastWeek.toISOString().split('T')[0],
                createdAt: lastWeek.toISOString()
            },
            {
                id: 102,
                title: 'Develop Frontend Components',
                description: 'Build reusable React components for UI',
                project: 'Website Redesign',
                priority: 'High',
                status: 'In Progress',
                deadline: tomorrow.toISOString().split('T')[0],
                createdAt: today.toISOString()
            },
            {
                id: 103,
                title: 'Setup Backend API',
                description: 'Configure REST API endpoints',
                project: 'Website Redesign',
                priority: 'Medium',
                status: 'To Do',
                deadline: nextWeek.toISOString().split('T')[0],
                createdAt: today.toISOString()
            },
            {
                id: 104,
                title: 'Design App Wireframes',
                description: 'Create wireframes for all app screens',
                project: 'Mobile App Development',
                priority: 'High',
                status: 'In Progress',
                deadline: tomorrow.toISOString().split('T')[0],
                createdAt: today.toISOString()
            },
            {
                id: 105,
                title: 'Setup Development Environment',
                description: 'Configure React Native and dependencies',
                project: 'Mobile App Development',
                priority: 'High',
                status: 'Completed',
                deadline: today.toISOString().split('T')[0],
                createdAt: lastWeek.toISOString()
            },
            {
                id: 106,
                title: 'Create Social Media Content',
                description: 'Design posts for Instagram and Facebook',
                project: 'Marketing Campaign',
                priority: 'Medium',
                status: 'In Progress',
                deadline: tomorrow.toISOString().split('T')[0],
                createdAt: today.toISOString()
            },
            {
                id: 107,
                title: 'Setup Google Ads Campaign',
                description: 'Configure and launch Google Ads',
                project: 'Marketing Campaign',
                priority: 'High',
                status: 'To Do',
                deadline: nextWeek.toISOString().split('T')[0],
                createdAt: today.toISOString()
            },
            {
                id: 108,
                title: 'Email Newsletter Design',
                description: 'Create template for monthly newsletter',
                project: 'Marketing Campaign',
                priority: 'Low',
                status: 'Completed',
                deadline: lastWeek.toISOString().split('T')[0],
                createdAt: lastWeek.toISOString()
            }
        ];

        saveToLocalStorage();
    }
}

function setupEventListeners() {
    document.getElementById('toggleSidebar').addEventListener('click', toggleSidebar);
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    document.getElementById('addTaskBtn').addEventListener('click', (e) => {
        e.preventDefault();
        openTaskModal();
    });
    document.getElementById('addProjectBtn').addEventListener('click', (e) => {
        e.preventDefault();
        openProjectModal();
    });
    document.getElementById('addProjectBtn2').addEventListener('click', (e) => {
        e.preventDefault();
        openProjectModal();
    });

    document.getElementById('userProfileBtn').addEventListener('click', (e) => {
        e.preventDefault();
        openProfileModal();
    });

    document.getElementById('closeTaskModal').addEventListener('click', (e) => {
        e.preventDefault();
        closeTaskModal();
    });
    document.getElementById('closeProjectModal').addEventListener('click', (e) => {
        e.preventDefault();
        closeProjectModal();
    });
    document.getElementById('closeProfileModal').addEventListener('click', (e) => {
        e.preventDefault();
        closeProfileModal();
    });
    document.getElementById('cancelTaskBtn').addEventListener('click', (e) => {
        e.preventDefault();
        closeTaskModal();
    });
    document.getElementById('cancelProjectBtn').addEventListener('click', (e) => {
        e.preventDefault();
        closeProjectModal();
    });
    document.getElementById('cancelProfileBtn').addEventListener('click', (e) => {
        e.preventDefault();
        closeProfileModal();
    });

    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
    document.getElementById('projectForm').addEventListener('submit', handleProjectSubmit);
    document.getElementById('profileForm').addEventListener('submit', handleProfileSubmit);

    document.getElementById('changeAvatarBtn').addEventListener('click', changeAvatar);

    document.getElementById('uploadImageBtn').addEventListener('click', () => {
        document.getElementById('profileImageInput').click();
    });

    document.getElementById('profileImageInput').addEventListener('change', handleImageUpload);

    document.getElementById('removeImageBtn').addEventListener('click', removeProfileImage);

    document.querySelectorAll('.color-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const color = e.currentTarget.dataset.color;
            selectAvatarColor(color);
        });
    });

    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('filterStatus').addEventListener('change', renderTasks);
    document.getElementById('filterPriority').addEventListener('change', renderTasks);

    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
    document.getElementById('exportDataBtn').addEventListener('click', exportData);

    window.addEventListener('click', (e) => {
        if (e.target.id === 'taskModal' || e.target.id === 'projectModal' || e.target.id === 'profileModal') {
            if (e.target.id === 'taskModal') closeTaskModal();
            if (e.target.id === 'projectModal') closeProjectModal();
            if (e.target.id === 'profileModal') closeProfileModal();
        }
    });
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

function handleNavigation(e) {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    e.currentTarget.classList.add('active');

    const section = e.currentTarget.dataset.section;
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(`${section}Section`).classList.add('active');

    if (section === 'analytics') {
        renderAnalytics();
    }
}

function openTaskModal(task = null) {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    form.reset();

    updateProjectDropdown();

    if (task) {
        document.getElementById('modalTitle').textContent = 'Edit Task';
        document.getElementById('taskId').value = task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskProject').value = task.project;
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('taskDeadline').value = task.deadline;
        appState.currentEditTask = task;
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Task';
        appState.currentEditTask = null;
    }

    modal.classList.add('active');
}

function closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
    appState.currentEditTask = null;
}

function openProjectModal(project = null) {
    const modal = document.getElementById('projectModal');
    const form = document.getElementById('projectForm');
    form.reset();

    if (project) {
        document.getElementById('projectId').value = project.id;
        document.getElementById('projectName').value = project.name;
        document.getElementById('projectDescription').value = project.description;
        document.getElementById('projectStartDate').value = project.startDate;
        appState.currentEditProject = project;
    } else {
        appState.currentEditProject = null;
    }

    modal.classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
    appState.currentEditProject = null;
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');
    const profile = appState.userProfile;

    document.getElementById('profileName').value = profile.name || '';
    document.getElementById('profileEmail').value = profile.email || '';
    document.getElementById('profileJobTitle').value = profile.jobTitle || '';
    document.getElementById('profileDepartment').value = profile.department || '';
    document.getElementById('profilePhone').value = profile.phone || '';
    document.getElementById('profileBio').value = profile.bio || '';
    document.getElementById('profileTheme').value = profile.theme || 'light';
    document.getElementById('profileAvatarText').textContent = profile.avatar || 'U';

    const avatarLarge = document.getElementById('profileAvatarLarge');
    avatarLarge.style.background = profile.avatarColor || '#4f46e5';

    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === profile.avatarColor);
    });

    if (profile.profileImage) {
        document.getElementById('profileImagePreview').src = profile.profileImage;
        document.getElementById('profileImagePreview').style.display = 'block';
        document.getElementById('profileAvatarText').style.display = 'none';
        document.getElementById('removeImageBtn').style.display = 'inline-block';
    } else {
        document.getElementById('profileImagePreview').style.display = 'none';
        document.getElementById('profileAvatarText').style.display = 'block';
        document.getElementById('removeImageBtn').style.display = 'none';
    }

    modal.classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
}

function handleProfileSubmit(e) {
    e.preventDefault();

    appState.userProfile = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        jobTitle: document.getElementById('profileJobTitle').value,
        department: document.getElementById('profileDepartment').value,
        phone: document.getElementById('profilePhone').value,
        bio: document.getElementById('profileBio').value,
        theme: document.getElementById('profileTheme').value,
        avatar: appState.userProfile.avatar,
        avatarColor: appState.userProfile.avatarColor,
        profileImage: appState.userProfile.profileImage
    };

    updateUserAvatar();
    saveToLocalStorage();
    closeProfileModal();

    alert('Profile updated successfully!');
}

function changeAvatar() {
    const avatars = ['U', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z', '👤', '👨', '👩', '🧑', '👔', '💼', '🎯', '⭐', '🚀'];
    const currentIndex = avatars.indexOf(appState.userProfile.avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    appState.userProfile.avatar = avatars[nextIndex];
    
    document.getElementById('profileAvatarText').textContent = appState.userProfile.avatar;
}

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            appState.userProfile.profileImage = event.target.result;
            document.getElementById('profileImagePreview').src = event.target.result;
            document.getElementById('profileImagePreview').style.display = 'block';
            document.getElementById('profileAvatarText').style.display = 'none';
            document.getElementById('removeImageBtn').style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
}

function removeProfileImage() {
    appState.userProfile.profileImage = null;
    document.getElementById('profileImagePreview').style.display = 'none';
    document.getElementById('profileImagePreview').src = '';
    document.getElementById('profileAvatarText').style.display = 'block';
    document.getElementById('removeImageBtn').style.display = 'none';
    document.getElementById('profileImageInput').value = '';
}

function selectAvatarColor(color) {
    appState.userProfile.avatarColor = color;
    document.getElementById('profileAvatarLarge').style.background = color;
    
    document.querySelectorAll('.color-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
}

function updateUserAvatar() {
    const avatarElements = document.querySelectorAll('.avatar');
    const profile = appState.userProfile;
    
    avatarElements.forEach(el => {
        el.style.background = profile.avatarColor || '#4f46e5';
        
        let imgElement = el.querySelector('img');
        if (!imgElement) {
            imgElement = document.createElement('img');
            el.appendChild(imgElement);
        }
        
        if (profile.profileImage) {
            imgElement.src = profile.profileImage;
            imgElement.style.display = 'block';
            const textElement = el.querySelector('span') || el.childNodes[0];
            if (textElement && textElement.nodeType === Node.TEXT_NODE) {
                textElement.textContent = '';
            }
        } else {
            imgElement.style.display = 'none';
            el.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE || (node.tagName !== 'IMG')) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        node.textContent = profile.avatar;
                    } else if (node.tagName !== 'IMG') {
                        node.textContent = profile.avatar;
                    }
                }
            });
            if (el.childNodes.length === 1 && el.childNodes[0].tagName === 'IMG') {
                el.textContent = profile.avatar;
                el.appendChild(imgElement);
            }
        }
    });
}

function handleTaskSubmit(e) {
    e.preventDefault();

    const task = {
        id: appState.currentEditTask ? appState.currentEditTask.id : Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        project: document.getElementById('taskProject').value,
        priority: document.getElementById('taskPriority').value,
        status: document.getElementById('taskStatus').value,
        deadline: document.getElementById('taskDeadline').value,
        createdAt: appState.currentEditTask ? appState.currentEditTask.createdAt : new Date().toISOString()
    };

    if (appState.currentEditTask) {
        const index = appState.tasks.findIndex(t => t.id === appState.currentEditTask.id);
        appState.tasks[index] = task;
    } else {
        appState.tasks.push(task);
    }

    saveToLocalStorage();
    closeTaskModal();
    renderDashboard();
    renderTasks();
    renderAnalytics();
}

function handleProjectSubmit(e) {
    e.preventDefault();

    const project = {
        id: appState.currentEditProject ? appState.currentEditProject.id : Date.now(),
        name: document.getElementById('projectName').value,
        description: document.getElementById('projectDescription').value,
        startDate: document.getElementById('projectStartDate').value,
        createdAt: appState.currentEditProject ? appState.currentEditProject.createdAt : new Date().toISOString()
    };

    if (appState.currentEditProject) {
        const index = appState.projects.findIndex(p => p.id === appState.currentEditProject.id);
        appState.projects[index] = project;
    } else {
        appState.projects.push(project);
    }

    saveToLocalStorage();
    closeProjectModal();
    renderDashboard();
    renderProjects();
    renderAnalytics();
}

function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        appState.tasks = appState.tasks.filter(t => t.id !== id);
        saveToLocalStorage();
        renderDashboard();
        renderTasks();
        renderAnalytics();
    }
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project? All associated tasks will remain.')) {
        appState.projects = appState.projects.filter(p => p.id !== id);
        saveToLocalStorage();
        renderDashboard();
        renderProjects();
        renderAnalytics();
    }
}

function updateProjectDropdown() {
    const select = document.getElementById('taskProject');
    select.innerHTML = '<option value="">Select Project</option>';
    appState.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.name;
        option.textContent = project.name;
        select.appendChild(option);
    });
}

function renderDashboard() {
    const stats = calculateStats();
    document.getElementById('totalProjects').textContent = stats.totalProjects;
    document.getElementById('totalTasks').textContent = stats.totalTasks;
    document.getElementById('completedTasks').textContent = stats.completedTasks;
    document.getElementById('pendingTasks').textContent = stats.pendingTasks;
    document.getElementById('overdueTasks').textContent = stats.overdueTasks;

    renderRecentTasks();
    renderProgressChart();
    renderStatusChart();
}

function calculateStats() {
    const totalProjects = appState.projects.length;
    const totalTasks = appState.tasks.length;
    const completedTasks = appState.tasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = appState.tasks.filter(t => t.status !== 'Completed').length;
    const overdueTasks = appState.tasks.filter(t => {
        return t.status !== 'Completed' && new Date(t.deadline) < new Date();
    }).length;

    return { totalProjects, totalTasks, completedTasks, pendingTasks, overdueTasks };
}

function renderRecentTasks() {
    const container = document.getElementById('recentTasksList');
    const recentTasks = appState.tasks.slice(-5).reverse();

    if (recentTasks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem;">No tasks yet</p>';
        return;
    }

    container.innerHTML = recentTasks.map(task => `
        <div class="task-item">
            <div class="task-info">
                <h5>${task.title}</h5>
                <p>${task.project} • ${task.deadline}</p>
            </div>
            <span class="badge badge-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
        </div>
    `).join('');
}

function renderProjects() {
    const container = document.getElementById('projectsList');

    if (appState.projects.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem; grid-column: 1/-1;">No projects yet. Create your first project!</p>';
        return;
    }

    container.innerHTML = appState.projects.map(project => {
        const projectTasks = appState.tasks.filter(t => t.project === project.name);
        const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
        const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;

        return `
            <div class="project-card">
                <h4>${project.name}</h4>
                <p>${project.description || 'No description'}</p>
                <div class="project-meta">
                    <span class="badge badge-status">${projectTasks.length} Tasks</span>
                    <span class="badge badge-status">${completedTasks} Completed</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
                <p style="font-size: 0.75rem; margin-top: 0.5rem; color: var(--text-secondary);">${progress}% Complete</p>
                <div class="card-actions">
                    <button class="btn-icon" onclick="editProject(${project.id})">✏️ Edit</button>
                    <button class="btn-icon" onclick="deleteProject(${project.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderTasks() {
    const container = document.getElementById('tasksList');
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;

    let filteredTasks = appState.tasks;

    if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.priority === priorityFilter);
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 2rem; grid-column: 1/-1;">No tasks found</p>';
        return;
    }

    container.innerHTML = filteredTasks.map(task => {
        const isOverdue = task.status !== 'Completed' && new Date(task.deadline) < new Date();
        return `
            <div class="task-card">
                <h4>${task.title}</h4>
                <p>${task.description || 'No description'}</p>
                <div class="task-meta">
                    <span class="badge badge-priority-${task.priority.toLowerCase()}">${task.priority}</span>
                    <span class="badge badge-${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span>
                    ${isOverdue ? '<span class="badge badge-overdue">Overdue</span>' : ''}
                </div>
                <p style="font-size: 0.875rem; margin-top: 0.5rem;">
                    <strong>Project:</strong> ${task.project}<br>
                    <strong>Deadline:</strong> ${task.deadline}
                </p>
                <div class="card-actions">
                    <button class="btn-icon" onclick="editTask(${task.id})">✏️ Edit</button>
                    <button class="btn-icon" onclick="deleteTask(${task.id})">🗑️ Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function editTask(id) {
    const task = appState.tasks.find(t => t.id === id);
    if (task) openTaskModal(task);
}

function editProject(id) {
    const project = appState.projects.find(p => p.id === id);
    if (project) openProjectModal(project);
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const taskCards = document.querySelectorAll('.task-card');

    taskCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? 'block' : 'none';
    });
}

function renderProgressChart() {
    const canvas = document.getElementById('progressChart');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;

    const last7Days = getLast7Days();
    const data = last7Days.map(date => {
        return appState.tasks.filter(t => {
            const taskDate = new Date(t.createdAt).toDateString();
            return taskDate === new Date(date).toDateString() && t.status === 'Completed';
        }).length;
    });

    drawLineChart(ctx, canvas.width, canvas.height, data, last7Days);
}

function renderStatusChart() {
    const canvas = document.getElementById('statusChart');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;

    const statusData = {
        'To Do': appState.tasks.filter(t => t.status === 'To Do').length,
        'In Progress': appState.tasks.filter(t => t.status === 'In Progress').length,
        'Completed': appState.tasks.filter(t => t.status === 'Completed').length
    };

    drawPieChart(ctx, canvas.width, canvas.height, statusData);
}

function renderAnalytics() {
    renderWeeklyChart();
    renderProjectChart();
    calculateMetrics();
}

function renderWeeklyChart() {
    const canvas = document.getElementById('weeklyChart');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;

    const last7Days = getLast7Days();
    const data = last7Days.map(date => {
        return appState.tasks.filter(t => {
            const taskDate = new Date(t.createdAt).toDateString();
            return taskDate === new Date(date).toDateString();
        }).length;
    });

    drawBarChart(ctx, canvas.width, canvas.height, data, last7Days);
}

function renderProjectChart() {
    const canvas = document.getElementById('projectChart');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 250;

    const projectData = {};
    appState.projects.forEach(project => {
        const tasks = appState.tasks.filter(t => t.project === project.name);
        const completed = tasks.filter(t => t.status === 'Completed').length;
        projectData[project.name] = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    });

    drawBarChart(ctx, canvas.width, canvas.height, Object.values(projectData), Object.keys(projectData));
}

function calculateMetrics() {
    const totalTasks = appState.tasks.length;
    const completedTasks = appState.tasks.filter(t => t.status === 'Completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const daysWithTasks = new Set(appState.tasks.map(t => new Date(t.createdAt).toDateString())).size;
    const avgTasksPerDay = daysWithTasks > 0 ? (totalTasks / daysWithTasks).toFixed(1) : 0;

    const onTimeTasks = appState.tasks.filter(t => {
        return t.status === 'Completed' || new Date(t.deadline) >= new Date();
    }).length;
    const onTimeRate = totalTasks > 0 ? Math.round((onTimeTasks / totalTasks) * 100) : 0;

    document.getElementById('completionRate').textContent = `${completionRate}%`;
    document.getElementById('avgTasksPerDay').textContent = avgTasksPerDay;
    document.getElementById('onTimeRate').textContent = `${onTimeRate}%`;
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }
    return days;
}

function drawLineChart(ctx, width, height, data, labels) {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data, 1);

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();

    ctx.fillStyle = '#4f46e5';
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - (value / maxValue) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const shortLabel = new Date(label).toLocaleDateString('en', { month: 'short', day: 'numeric' });
        ctx.fillText(shortLabel, x, height - 10);
    });
}

function drawBarChart(ctx, width, height, data, labels) {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data, 1);
    const barWidth = chartWidth / data.length - 10;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#4f46e5';
    data.forEach((value, index) => {
        const x = padding + (chartWidth / data.length) * index + 5;
        const barHeight = (value / maxValue) * chartHeight;
        const y = padding + chartHeight - barHeight;

        ctx.fillRect(x, y, barWidth, barHeight);
    });

    ctx.fillStyle = '#64748b';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, index) => {
        const x = padding + (chartWidth / data.length) * index + barWidth / 2 + 5;
        const shortLabel = typeof label === 'string' && label.includes('-') 
            ? new Date(label).toLocaleDateString('en', { month: 'short', day: 'numeric' })
            : label.length > 8 ? label.substring(0, 8) + '...' : label;
        ctx.fillText(shortLabel, x, height - 10);
    });
}

function drawPieChart(ctx, width, height, data) {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 40;

    ctx.clearRect(0, 0, width, height);

    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    if (total === 0) {
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();
        return;
    }

    const colors = ['#64748b', '#4f46e5', '#10b981'];
    let currentAngle = -Math.PI / 2;

    Object.entries(data).forEach(([label, value], index) => {
        const sliceAngle = (value / total) * Math.PI * 2;

        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        const textAngle = currentAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
        const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, textX, textY);

        currentAngle += sliceAngle;
    });

    let legendY = height - 30;
    Object.entries(data).forEach(([label, value], index) => {
        ctx.fillStyle = colors[index];
        ctx.fillRect(20, legendY + index * 20, 15, 15);

        ctx.fillStyle = '#1e293b';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${label}: ${value}`, 40, legendY + index * 20 + 12);
    });
}

function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        const parsed = JSON.parse(data);
        appState.projects = parsed.projects || [];
        appState.tasks = parsed.tasks || [];
        appState.userProfile = parsed.userProfile || appState.userProfile;
        updateUserAvatar();
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        appState.projects = [];
        appState.tasks = [];
        saveToLocalStorage();
        renderDashboard();
        renderProjects();
        renderTasks();
        renderAnalytics();
    }
}

function exportData() {
    const dataStr = JSON.stringify(appState, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pm-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDeadline').setAttribute('min', today);
    document.getElementById('projectStartDate').setAttribute('min', today);
}

window.editTask = editTask;
window.deleteTask = deleteTask;
window.editProject = editProject;
window.deleteProject = deleteProject;

document.addEventListener('DOMContentLoaded', initDashboard);
