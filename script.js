/* ============================================================
   PORTFOLIO SCRIPT — Rizwan Shaikh | Power Platform Developer
   ============================================================ */

// ========================
// CONSTANTS
// ========================
const ADMIN_EMAIL = 'rizwan.shaikh3699@gmail.com';
const ADMIN_PASSWORD = 'Rizwan@123@';

// EmailJS config — replace with your own IDs
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// ========================
// STATE
// ========================
let isAdmin = false;
let generatedOTP = '';
let otpUserEmail = '';
let currentTheme = localStorage.getItem('theme') || 'dark';

// ========================
// LOCAL STORAGE HELPERS
// ========================
const load = key => JSON.parse(localStorage.getItem(key) || 'null');
const save = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// Default data
const defaultSkills = [
    { id: '1', name: 'Power Apps', icon: 'fas fa-mobile-alt', color: '#7c3aed' },
    { id: '2', name: 'Power Automate', icon: 'fas fa-bolt', color: '#06b6d4' },
    { id: '3', name: 'Power BI', icon: 'fas fa-chart-bar', color: '#f59e0b' },
    { id: '4', name: 'SharePoint', icon: 'fab fa-microsoft', color: '#0284c7' },
    { id: '5', name: 'Azure', icon: 'fas fa-cloud', color: '#38bdf8' },
    { id: '6', name: 'Dataverse', icon: 'fas fa-database', color: '#a855f7' },
    { id: '7', name: 'Teams', icon: 'fas fa-users', color: '#5865f2' },
    { id: '8', name: 'JavaScript', icon: 'fab fa-js', color: '#eab308' },
    { id: '9', name: 'HTML / CSS', icon: 'fab fa-html5', color: '#ef4444' },
    { id: '10', name: 'SQL', icon: 'fas fa-table', color: '#10b981' },
];

const defaultProjects = [
    {
        id: '1',
        title: 'Leave Management System',
        desc: 'A full-featured leave management app built with Power Apps & SharePoint. Employees can apply for leave, managers can approve/reject, and HR gets full analytics via Power BI.',
        tech: ['Power Apps', 'SharePoint', 'Power Automate', 'Power BI'],
        github: '', demo: '', image: ''
    },
    {
        id: '2',
        title: 'Asset Tracking Portal',
        desc: 'Enterprise asset management solution allowing IT teams to track hardware/software assets, assign them to employees, and automate renewal reminders via Power Automate.',
        tech: ['Power Apps', 'Dataverse', 'Power Automate'],
        github: '', demo: '', image: ''
    },
    {
        id: '3',
        title: 'Sales Dashboard',
        desc: 'Interactive Power BI dashboard with real-time sales KPIs, regional performance breakdowns, and automated weekly email reports using Power Automate.',
        tech: ['Power BI', 'Power Automate', 'SharePoint'],
        github: '', demo: '', image: ''
    }
];

const defaultExperience = [
    {
        id: '1',
        company: 'Tech Solutions Pvt. Ltd.',
        role: 'Power Platform Developer',
        duration: 'Jan 2022 – Present',
        desc: 'Designed and developed enterprise-grade Power Apps applications and automated business workflows using Power Automate. Built interactive Power BI dashboards for C-level reporting. Integrated SharePoint as a backend data source and managed Dataverse environments.'
    },
    {
        id: '2',
        company: 'Digital Innovations Inc.',
        role: 'Junior Power Platform Developer',
        duration: 'Jul 2021 – Dec 2021',
        desc: 'Assisted in building Power Apps canvas and model-driven apps. Created Power Automate flows for approval workflows and email notifications. Supported SharePoint site administration and governance.'
    }
];

const defaultTopics = [
    {
        id: '1',
        name: 'Delegation in Power Apps',
        notes: [
            { id: 'n1', content: 'When working with large datasets, Power Apps uses delegation to push queries to the data source.' },
            { id: 'n2', content: 'This avoids pulling all data into the app and improves performance significantly.' },
            { id: 'n3', content: 'Delegation warnings (yellow triangles) should be avoided for better scalability.' },
            { id: 'n4', content: 'Use delegable functions like Filter, Search, and LookUp with supported connectors whenever possible.' }
        ]
    },
    {
        id: '2',
        name: 'Power Automate Best Practices',
        notes: [
            { id: 'n5', content: 'Always use Compose actions to store intermediate values and avoid redundant expressions.' },
            { id: 'n6', content: 'Use Scope actions to group related steps for better error handling with Try/Catch patterns.' },
            { id: 'n7', content: 'Minimize API calls by batching requests and using parallel branches where applicable.' }
        ]
    }
];

const defaultSocials = [
    { id: '1', label: 'LinkedIn', url: '#', icon: 'fab fa-linkedin' },
    { id: '2', label: 'GitHub', url: '#', icon: 'fab fa-github' },
    { id: '3', label: 'Twitter', url: '#', icon: 'fab fa-twitter' }
];

// Init storage
if (!load('skills')) save('skills', defaultSkills);
if (!load('projects')) save('projects', defaultProjects);
if (!load('experience')) save('experience', defaultExperience);
if (!load('topics')) save('topics', defaultTopics);
if (!load('socials')) save('socials', defaultSocials);

// ========================
// UTILITY
// ========================
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.className = 'toast', 3000);
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) overlay.classList.remove('active');
    });
});

// ========================
// THEME TOGGLE
// ========================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    currentTheme = theme;
    localStorage.setItem('theme', theme);
}

applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// ========================
// CUSTOM CURSOR
// ========================
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ========================
// NAVBAR SCROLL + ACTIVE
// ========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightNav();
});

function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 140) current = s.id;
    });
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
}

// ========================
// HAMBURGER
// ========================
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

// ========================
// TYPED TEXT
// ========================
const phrases = [
    'Power Apps',
    'Power Automate',
    'Power BI Dashboards',
    'SharePoint Solutions',
    'Business Solutions'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
        typedEl.textContent = phrase.slice(0, ++charIdx);
        if (charIdx === phrase.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    } else {
        typedEl.textContent = phrase.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    }
    setTimeout(typeLoop, deleting ? 60 : 90);
}
typeLoop();

// ========================
// SCROLL REVEAL
// ========================
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

function addReveal(el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
}

// ========================
// STAT COUNTER
// ========================
const statObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target;
            const target = +el.dataset.target;
            let cur = 0;
            const step = Math.ceil(target / 40);
            const t = setInterval(() => {
                cur = Math.min(cur + step, target);
                el.textContent = cur;
                if (cur >= target) clearInterval(t);
            }, 40);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ========================
// ADMIN AUTH
// ========================
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');

adminLoginBtn.addEventListener('click', () => {
    if (isAdmin) {
        logout();
    } else {
        document.getElementById('adminEmail').value = '';
        document.getElementById('adminPassword').value = '';
        loginError.textContent = '';
        openModal('adminLoginModal');
    }
});

document.getElementById('closeAdminLogin').addEventListener('click', () => closeModal('adminLoginModal'));

adminLoginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const pass = document.getElementById('adminPassword').value;
    if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
        isAdmin = true;
        closeModal('adminLoginModal');
        adminLoginBtn.innerHTML = '<i class="fas fa-lock-open"></i> Logout';
        adminLoginBtn.classList.add('admin-active');
        showToast('Welcome back, Admin! 🎉', 'success');
        renderAll();
    } else {
        loginError.textContent = 'Invalid email or password.';
    }
});

function logout() {
    isAdmin = false;
    adminLoginBtn.innerHTML = '<i class="fas fa-lock"></i> Admin';
    adminLoginBtn.classList.remove('admin-active');
    showToast('Logged out.', '');
    renderAll();
}

// Eye toggle
document.getElementById('eyeBtn').addEventListener('click', () => {
    const inp = document.getElementById('adminPassword');
    const ico = document.getElementById('eyeBtn').querySelector('i');
    if (inp.type === 'password') { inp.type = 'text'; ico.className = 'fas fa-eye-slash'; }
    else { inp.type = 'password'; ico.className = 'fas fa-eye'; }
});

// ========================
// RENDER SKILLS (FLIP CARDS)
// ========================
function renderSkills() {
    const grid = document.getElementById('skillsGrid');
    const bar = document.getElementById('adminAddSkillBar');
    const skills = load('skills') || [];

    grid.innerHTML = '';
    skills.forEach(sk => {
        const card = document.createElement('div');
        card.className = 'skill-card reveal';

        card.innerHTML = `
      <div class="skill-card-inner">
        <div class="skill-front">
          ${isAdmin ? `<div class="skill-admin-btns">
            <button class="btn-icon edit" data-id="${sk.id}" data-action="editSkill"><i class="fas fa-pen"></i></button>
            <button class="btn-icon del"  data-id="${sk.id}" data-action="delSkill"><i class="fas fa-trash"></i></button>
          </div>` : ''}
          <div class="skill-front-icon" style="color:${sk.color || 'var(--accent2)'}">
            <i class="${sk.icon || 'fas fa-code'}"></i>
          </div>
          <div class="skill-front-name">${sk.name}</div>
        </div>
        <div class="skill-back">
          <div class="skill-back-icon"><i class="${sk.icon || 'fas fa-code'}"></i></div>
          ${sk.name}
        </div>
      </div>`;

        grid.appendChild(card);
        revealObserver.observe(card);
    });

    bar.style.display = isAdmin ? 'flex' : 'none';

    // Event delegation
    grid.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const id = btn.dataset.id;
            if (btn.dataset.action === 'editSkill') openSkillModal(id);
            if (btn.dataset.action === 'delSkill') deleteSkill(id);
        });
    });
}

// Skill modal
const skillModal = document.getElementById('skillModal');
const skillForm = document.getElementById('skillForm');
const skillModalTitle = document.getElementById('skillModalTitle');

document.getElementById('addSkillBtn').addEventListener('click', () => openSkillModal());
document.getElementById('closeSkillModal').addEventListener('click', () => closeModal('skillModal'));

function openSkillModal(id) {
    skillForm.reset();
    document.getElementById('skillId').value = '';
    skillModalTitle.textContent = 'Add Skill';
    if (id) {
        const sk = (load('skills') || []).find(s => s.id === id);
        if (sk) {
            skillModalTitle.textContent = 'Edit Skill';
            document.getElementById('skillId').value = sk.id;
            document.getElementById('skillName').value = sk.name;
            document.getElementById('skillIcon').value = sk.icon || '';
            document.getElementById('skillColor').value = sk.color || '';
        }
    }
    openModal('skillModal');
}

skillForm.addEventListener('submit', e => {
    e.preventDefault();
    const skills = load('skills') || [];
    const id = document.getElementById('skillId').value;
    const obj = {
        id: id || uid(),
        name: document.getElementById('skillName').value.trim(),
        icon: document.getElementById('skillIcon').value.trim() || 'fas fa-code',
        color: document.getElementById('skillColor').value.trim() || 'var(--accent2)'
    };
    if (id) {
        const idx = skills.findIndex(s => s.id === id);
        if (idx > -1) skills[idx] = obj;
    } else {
        skills.push(obj);
    }
    save('skills', skills);
    closeModal('skillModal');
    renderSkills();
    showToast(id ? 'Skill updated!' : 'Skill added!', 'success');
});

function deleteSkill(id) {
    if (!confirm('Delete this skill?')) return;
    save('skills', (load('skills') || []).filter(s => s.id !== id));
    renderSkills();
    showToast('Skill deleted.', '');
}

// ========================
// RENDER PROJECTS
// ========================
function renderProjects() {
    const grid = document.getElementById('projectsGrid');
    const bar = document.getElementById('adminAddProjectBar');
    const projects = load('projects') || [];

    grid.innerHTML = '';
    projects.forEach(p => {
        const techHTML = (p.tech || []).map(t => `<span class="tech-badge">${t}</span>`).join('');
        const card = document.createElement('div');
        card.className = 'project-card reveal';

        card.innerHTML = `
      <div class="project-img">
        ${isAdmin ? `<div class="project-admin-btns">
          <button class="btn-icon edit" data-id="${p.id}" data-action="editProject"><i class="fas fa-pen"></i></button>
          <button class="btn-icon del"  data-id="${p.id}" data-action="delProject"><i class="fas fa-trash"></i></button>
        </div>` : ''}
        ${p.image
                ? `<img src="${p.image}" alt="${p.title}" loading="lazy" />`
                : `<div class="project-img-placeholder"><i class="fas fa-layer-group"></i></div>`}
      </div>
      <div class="project-body">
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tech">${techHTML}</div>
        <div class="project-links">
          ${p.github ? `<a href="${p.github}" target="_blank" class="project-link-btn gh"><i class="fab fa-github"></i> GitHub</a>` : ''}
          ${p.demo ? `<a href="${p.demo}"   target="_blank" class="project-link-btn live"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
          ${!p.github && !p.demo ? `<span style="color:var(--text2);font-size:.82rem">Links coming soon</span>` : ''}
        </div>
      </div>`;

        grid.appendChild(card);
        revealObserver.observe(card);
    });

    bar.style.display = isAdmin ? 'flex' : 'none';

    grid.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const id = btn.dataset.id;
            if (btn.dataset.action === 'editProject') openProjectModal(id);
            if (btn.dataset.action === 'delProject') deleteProject(id);
        });
    });
}

const projectForm = document.getElementById('projectForm');
const projectModalTitle = document.getElementById('projectModalTitle');

document.getElementById('addProjectBtn').addEventListener('click', () => openProjectModal());
document.getElementById('closeProjectModal').addEventListener('click', () => closeModal('projectModal'));

function openProjectModal(id) {
    projectForm.reset();
    document.getElementById('projectId').value = '';
    projectModalTitle.textContent = 'Add Project';
    if (id) {
        const p = (load('projects') || []).find(x => x.id === id);
        if (p) {
            projectModalTitle.textContent = 'Edit Project';
            document.getElementById('projectId').value = p.id;
            document.getElementById('projectTitle').value = p.title;
            document.getElementById('projectDesc').value = p.desc;
            document.getElementById('projectTech').value = (p.tech || []).join(', ');
            document.getElementById('projectGithub').value = p.github || '';
            document.getElementById('projectDemo').value = p.demo || '';
            document.getElementById('projectImage').value = p.image || '';
        }
    }
    openModal('projectModal');
}

projectForm.addEventListener('submit', e => {
    e.preventDefault();
    const projects = load('projects') || [];
    const id = document.getElementById('projectId').value;
    const obj = {
        id: id || uid(),
        title: document.getElementById('projectTitle').value.trim(),
        desc: document.getElementById('projectDesc').value.trim(),
        tech: document.getElementById('projectTech').value.split(',').map(t => t.trim()).filter(Boolean),
        github: document.getElementById('projectGithub').value.trim(),
        demo: document.getElementById('projectDemo').value.trim(),
        image: document.getElementById('projectImage').value.trim()
    };
    if (id) {
        const idx = projects.findIndex(p => p.id === id);
        if (idx > -1) projects[idx] = obj;
    } else {
        projects.push(obj);
    }
    save('projects', projects);
    closeModal('projectModal');
    renderProjects();
    showToast(id ? 'Project updated!' : 'Project added!', 'success');
});

function deleteProject(id) {
    if (!confirm('Delete this project?')) return;
    save('projects', (load('projects') || []).filter(p => p.id !== id));
    renderProjects();
    showToast('Project deleted.', '');
}

// ========================
// RENDER EXPERIENCE
// ========================
function renderExperience() {
    const tl = document.getElementById('experienceTimeline');
    const bar = document.getElementById('adminAddExpBar');
    const exps = load('experience') || [];

    tl.innerHTML = '';
    exps.forEach(exp => {
        const item = document.createElement('div');
        item.className = 'timeline-item reveal';
        item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <div class="timeline-role">${exp.role}</div>
          <span class="timeline-duration">${exp.duration}</span>
        </div>
        <div class="timeline-company"><i class="fas fa-building"></i> ${exp.company}</div>
        <p class="timeline-desc">${exp.desc || ''}</p>
        ${isAdmin ? `<div class="timeline-admin-btns">
          <button class="btn-icon edit" data-id="${exp.id}" data-action="editExp"><i class="fas fa-pen"></i></button>
          <button class="btn-icon del"  data-id="${exp.id}" data-action="delExp"><i class="fas fa-trash"></i></button>
        </div>` : ''}
      </div>`;

        tl.appendChild(item);
        revealObserver.observe(item);
    });

    bar.style.display = isAdmin ? 'flex' : 'none';

    tl.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (btn.dataset.action === 'editExp') openExpModal(id);
            if (btn.dataset.action === 'delExp') deleteExp(id);
        });
    });
}

const expForm = document.getElementById('expForm');
const expModalTitle = document.getElementById('expModalTitle');

document.getElementById('addExpBtn').addEventListener('click', () => openExpModal());
document.getElementById('closeExpModal').addEventListener('click', () => closeModal('expModal'));

function openExpModal(id) {
    expForm.reset();
    document.getElementById('expId').value = '';
    expModalTitle.textContent = 'Add Experience';
    if (id) {
        const exp = (load('experience') || []).find(x => x.id === id);
        if (exp) {
            expModalTitle.textContent = 'Edit Experience';
            document.getElementById('expId').value = exp.id;
            document.getElementById('expCompany').value = exp.company;
            document.getElementById('expRole').value = exp.role;
            document.getElementById('expDuration').value = exp.duration;
            document.getElementById('expDesc').value = exp.desc || '';
        }
    }
    openModal('expModal');
}

expForm.addEventListener('submit', e => {
    e.preventDefault();
    const exps = load('experience') || [];
    const id = document.getElementById('expId').value;
    const obj = {
        id: id || uid(),
        company: document.getElementById('expCompany').value.trim(),
        role: document.getElementById('expRole').value.trim(),
        duration: document.getElementById('expDuration').value.trim(),
        desc: document.getElementById('expDesc').value.trim()
    };
    if (id) {
        const idx = exps.findIndex(x => x.id === id);
        if (idx > -1) exps[idx] = obj;
    } else {
        exps.push(obj);
    }
    save('experience', exps);
    closeModal('expModal');
    renderExperience();
    showToast(id ? 'Experience updated!' : 'Experience added!', 'success');
});

function deleteExp(id) {
    if (!confirm('Delete this experience?')) return;
    save('experience', (load('experience') || []).filter(x => x.id !== id));
    renderExperience();
    showToast('Experience deleted.', '');
}

// ========================
// RENDER NOTES & TOPICS
// ========================
function renderNotes() {
    const container = document.getElementById('notesContainer');
    const bar = document.getElementById('adminAddTopicBar');
    const topics = load('topics') || [];

    container.innerHTML = '';
    topics.forEach(topic => {
        const block = document.createElement('div');
        block.className = 'topic-block reveal';

        const notesHTML = isAdmin
            ? topic.notes.map(n => `
          <div class="note-item">
            <div class="note-dot"></div>
            <span>${n.content}</span>
            <div class="note-admin-btns">
              <button class="btn-icon edit" data-tid="${topic.id}" data-nid="${n.id}" data-action="editNote"><i class="fas fa-pen"></i></button>
              <button class="btn-icon del"  data-tid="${topic.id}" data-nid="${n.id}" data-action="delNote"><i class="fas fa-trash"></i></button>
            </div>
          </div>`).join('')
            : ''; // Notes hidden from non-admins (show count only)

        const noteCount = topic.notes.length;
        block.innerHTML = `
      <div class="topic-header">
        <div class="topic-title-row">
          <div class="topic-icon"><i class="fas fa-book-open"></i></div>
          <div class="topic-name">${topic.name}</div>
        </div>
        <div class="topic-right">
          ${isAdmin ? `<div class="topic-admin-btns">
            <button class="btn-icon edit" data-id="${topic.id}" data-action="editTopic"><i class="fas fa-pen"></i></button>
            <button class="btn-icon del"  data-id="${topic.id}" data-action="delTopic"><i class="fas fa-trash"></i></button>
          </div>` : `<span style="color:var(--text2);font-size:.78rem">${noteCount} note${noteCount !== 1 ? 's' : ''}</span>`}
          <i class="fas fa-chevron-down topic-chevron"></i>
        </div>
      </div>
      <div class="topic-notes">
        ${isAdmin
                ? (notesHTML + `<button class="admin-add-note-btn" data-tid="${topic.id}" data-action="addNote"><i class="fas fa-plus"></i> Add Note</button>`)
                : `<p style="color:var(--text2);font-size:.9rem;padding:12px 0"><i class="fas fa-lock" style="margin-right:6px"></i>Notes are visible to admins only. Login as admin to view.</p>`}
      </div>`;

        container.appendChild(block);
        revealObserver.observe(block);

        // Toggle open/close
        block.querySelector('.topic-header').addEventListener('click', e => {
            if (e.target.closest('[data-action]')) return;
            block.classList.toggle('open');
        });
    });

    bar.style.display = isAdmin ? 'flex' : 'none';

    // Event delegation for notes / topics
    container.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const action = btn.dataset.action;
            if (action === 'editTopic') openTopicModal(btn.dataset.id);
            if (action === 'delTopic') deleteTopic(btn.dataset.id);
            if (action === 'addNote') openNoteModal(btn.dataset.tid);
            if (action === 'editNote') openNoteModal(btn.dataset.tid, btn.dataset.nid);
            if (action === 'delNote') deleteNote(btn.dataset.tid, btn.dataset.nid);
        });
    });
}

// Topic modal
const topicForm = document.getElementById('topicForm');
const topicModalTitle = document.getElementById('topicModalTitle');

document.getElementById('addTopicBtn').addEventListener('click', () => openTopicModal());
document.getElementById('closeTopicModal').addEventListener('click', () => closeModal('topicModal'));

function openTopicModal(id) {
    topicForm.reset();
    document.getElementById('topicId').value = '';
    topicModalTitle.textContent = 'Add Topic';
    if (id) {
        const topic = (load('topics') || []).find(t => t.id === id);
        if (topic) {
            topicModalTitle.textContent = 'Edit Topic';
            document.getElementById('topicId').value = topic.id;
            document.getElementById('topicName').value = topic.name;
        }
    }
    openModal('topicModal');
}

topicForm.addEventListener('submit', e => {
    e.preventDefault();
    const topics = load('topics') || [];
    const id = document.getElementById('topicId').value;
    const name = document.getElementById('topicName').value.trim();
    if (id) {
        const idx = topics.findIndex(t => t.id === id);
        if (idx > -1) topics[idx].name = name;
    } else {
        topics.push({ id: uid(), name, notes: [] });
    }
    save('topics', topics);
    closeModal('topicModal');
    renderNotes();
    showToast(id ? 'Topic updated!' : 'Topic added!', 'success');
});

function deleteTopic(id) {
    if (!confirm('Delete this topic and all its notes?')) return;
    save('topics', (load('topics') || []).filter(t => t.id !== id));
    renderNotes();
    showToast('Topic deleted.', '');
}

// Note modal
const noteForm = document.getElementById('noteForm');
const noteModalTitle = document.getElementById('noteModalTitle');

document.getElementById('closeNoteModal').addEventListener('click', () => closeModal('noteModal'));

function openNoteModal(topicId, noteId) {
    noteForm.reset();
    document.getElementById('noteId').value = '';
    document.getElementById('noteTopicId').value = topicId;
    noteModalTitle.textContent = 'Add Note';
    if (noteId) {
        const topic = (load('topics') || []).find(t => t.id === topicId);
        const note = topic && topic.notes.find(n => n.id === noteId);
        if (note) {
            noteModalTitle.textContent = 'Edit Note';
            document.getElementById('noteId').value = note.id;
            document.getElementById('noteContent').value = note.content;
        }
    }
    openModal('noteModal');
}

noteForm.addEventListener('submit', e => {
    e.preventDefault();
    const topics = load('topics') || [];
    const topicId = document.getElementById('noteTopicId').value;
    const noteId = document.getElementById('noteId').value;
    const content = document.getElementById('noteContent').value.trim();
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    if (noteId) {
        const idx = topic.notes.findIndex(n => n.id === noteId);
        if (idx > -1) topic.notes[idx].content = content;
    } else {
        topic.notes.push({ id: uid(), content });
    }
    save('topics', topics);
    closeModal('noteModal');
    renderNotes();
    showToast(noteId ? 'Note updated!' : 'Note added!', 'success');
});

function deleteNote(topicId, noteId) {
    if (!confirm('Delete this note?')) return;
    const topics = load('topics') || [];
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
        topic.notes = topic.notes.filter(n => n.id !== noteId);
        save('topics', topics);
        renderNotes();
        showToast('Note deleted.', '');
    }
}

// ========================
// RENDER SOCIALS
// ========================
function renderSocials() {
    const footer = document.getElementById('footerSocial');
    const bar = document.getElementById('adminSocialBar');
    const socials = load('socials') || [];

    footer.innerHTML = '';
    socials.forEach(s => {
        const a = document.createElement('a');
        a.href = s.url || '#';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'social-link';
        a.title = s.label;
        a.innerHTML = `<i class="${s.icon || 'fas fa-link'}"></i>
      ${isAdmin ? `<div class="social-admin-overlay">
        <button class="btn-icon edit" style="width:22px;height:22px;font-size:.65rem" data-id="${s.id}" data-action="editSocial"><i class="fas fa-pen"></i></button>
        <button class="btn-icon del"  style="width:22px;height:22px;font-size:.65rem" data-id="${s.id}" data-action="delSocial"><i class="fas fa-trash"></i></button>
      </div>` : ''}`;
        footer.appendChild(a);
    });

    bar.style.display = isAdmin ? 'flex' : 'none';

    // Update contact section info
    const li = socials.find(s => s.label.toLowerCase().includes('linkedin'));
    const gh = socials.find(s => s.label.toLowerCase().includes('github'));
    const liEl = document.getElementById('contactLinkedIn');
    const ghEl = document.getElementById('contactGitHub');
    if (liEl) liEl.innerHTML = li ? `<a href="${li.url}" target="_blank" style="color:var(--accent2)">${li.url}</a>` : '—';
    if (ghEl) ghEl.innerHTML = gh ? `<a href="${gh.url}" target="_blank" style="color:var(--accent2)">${gh.url}</a>` : '—';

    footer.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            const id = btn.dataset.id;
            if (btn.dataset.action === 'editSocial') openSocialModal(id);
            if (btn.dataset.action === 'delSocial') deleteSocial(id);
        });
    });
}

const socialForm = document.getElementById('socialForm');
const socialModalTitle = document.getElementById('socialModalTitle');

document.getElementById('addSocialBtn').addEventListener('click', () => openSocialModal());
document.getElementById('closeSocialModal').addEventListener('click', () => closeModal('socialModal'));

function openSocialModal(id) {
    socialForm.reset();
    document.getElementById('socialId').value = '';
    socialModalTitle.textContent = 'Add Social Link';
    if (id) {
        const s = (load('socials') || []).find(x => x.id === id);
        if (s) {
            socialModalTitle.textContent = 'Edit Social Link';
            document.getElementById('socialId').value = s.id;
            document.getElementById('socialLabel').value = s.label;
            document.getElementById('socialUrl').value = s.url;
            document.getElementById('socialIcon').value = s.icon || '';
        }
    }
    openModal('socialModal');
}

socialForm.addEventListener('submit', e => {
    e.preventDefault();
    const socials = load('socials') || [];
    const id = document.getElementById('socialId').value;
    const obj = {
        id: id || uid(),
        label: document.getElementById('socialLabel').value.trim(),
        url: document.getElementById('socialUrl').value.trim(),
        icon: document.getElementById('socialIcon').value.trim() || 'fas fa-link'
    };
    if (id) {
        const idx = socials.findIndex(s => s.id === id);
        if (idx > -1) socials[idx] = obj;
    } else {
        socials.push(obj);
    }
    save('socials', socials);
    closeModal('socialModal');
    renderSocials();
    showToast(id ? 'Social link updated!' : 'Social link added!', 'success');
});

function deleteSocial(id) {
    if (!confirm('Delete this social link?')) return;
    save('socials', (load('socials') || []).filter(s => s.id !== id));
    renderSocials();
    showToast('Social link deleted.', '');
}

// ========================
// RESUME — OTP FLOW
// ========================
const resumeBtn = document.getElementById('resumeBtn');

resumeBtn.addEventListener('click', () => {
    if (isAdmin) {
        // Admin opens resume management
        renderResumeAdmin();
        openModal('resumeAdminModal');
        return;
    }
    const resume = load('resumeData');
    if (!resume) { showToast('Resume not uploaded yet.', 'error'); return; }
    // Reset OTP flow
    document.getElementById('otpStep1').style.display = 'block';
    document.getElementById('otpStep2').style.display = 'none';
    document.getElementById('userEmail').value = '';
    document.getElementById('otpError1').textContent = '';
    document.getElementById('otpError2').textContent = '';
    openModal('resumeModal');
});

document.getElementById('closeResumeModal').addEventListener('click', () => closeModal('resumeModal'));

// Send OTP
document.getElementById('sendOtpBtn').addEventListener('click', () => {
    const email = document.getElementById('userEmail').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('otpError1').textContent = 'Enter a valid email address.';
        return;
    }
    otpUserEmail = email;
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    // Simulate OTP send (in production, use EmailJS)
    console.log('[DEV] OTP for', email, ':', generatedOTP);
    tryEmailJS_OTP(email, generatedOTP);

    document.getElementById('otpEmailDisplay').textContent = email;
    document.getElementById('otpStep1').style.display = 'none';
    document.getElementById('otpStep2').style.display = 'block';
    showToast('OTP sent! Check console if EmailJS not configured.', 'success');
    focusOtpBoxes();
});

// OTP input navigation
function focusOtpBoxes() {
    const boxes = document.querySelectorAll('.otp-box');
    boxes.forEach((box, i) => {
        box.value = '';
        box.addEventListener('input', () => {
            if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
        });
        box.addEventListener('keydown', e => {
            if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
        });
    });
    boxes[0].focus();
}

// Verify OTP
document.getElementById('verifyOtpBtn').addEventListener('click', () => {
    const entered = [...document.querySelectorAll('.otp-box')].map(b => b.value).join('');
    if (entered.length < 6) {
        document.getElementById('otpError2').textContent = 'Enter the full 6-digit OTP.';
        return;
    }
    if (entered !== generatedOTP) {
        document.getElementById('otpError2').textContent = 'Invalid OTP. Please try again.';
        return;
    }
    // Verified — download resume & notify admin
    closeModal('resumeModal');
    downloadResume();
    notifyAdmin(otpUserEmail);
    showToast('OTP verified! Downloading resume...', 'success');
});

// Resend OTP
document.getElementById('resendOtpBtn').addEventListener('click', () => {
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('[DEV] New OTP for', otpUserEmail, ':', generatedOTP);
    tryEmailJS_OTP(otpUserEmail, generatedOTP);
    document.getElementById('otpError2').textContent = '';
    showToast('New OTP sent!', 'success');
    focusOtpBoxes();
});

function downloadResume() {
    const resume = load('resumeData');
    if (!resume) return;
    const a = document.createElement('a');
    a.href = resume.data;
    a.download = resume.name || 'Rizwan_Shaikh_Resume.pdf';
    a.click();
}

// EmailJS OTP sender
function tryEmailJS_OTP(email, otp) {
    if (typeof emailjs === 'undefined') return;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: email,
        otp_code: otp,
        from_name: 'Rizwan Shaikh Portfolio'
    }, EMAILJS_PUBLIC_KEY).catch(err => console.warn('EmailJS OTP error:', err));
}

// Notify admin after resume download
function notifyAdmin(userEmail) {
    if (typeof emailjs === 'undefined') return;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: ADMIN_EMAIL,
        user_email: userEmail,
        timestamp: new Date().toLocaleString(),
        message: `${userEmail} accessed and downloaded your resume on ${new Date().toLocaleString()}.`
    }, EMAILJS_PUBLIC_KEY).catch(err => console.warn('EmailJS notify error:', err));
}

// ========================
// RESUME ADMIN MANAGEMENT
// ========================
document.getElementById('closeResumeAdmin').addEventListener('click', () => closeModal('resumeAdminModal'));

function renderResumeAdmin() {
    const content = document.getElementById('resumeAdminContent');
    const resume = load('resumeData');
    content.innerHTML = resume
        ? `<div class="resume-link-row"><i class="fas fa-file-pdf" style="color:#ef4444"></i><a href="${resume.data}" target="_blank">${resume.name}</a></div>`
        : `<p style="color:var(--text2);font-size:.9rem;margin-bottom:8px">No resume uploaded yet.</p>`;
}

// File input label update
document.getElementById('resumeFileInput').addEventListener('change', e => {
    const file = e.target.files[0];
    document.getElementById('resumeFileLabel').innerHTML =
        `<i class="fas fa-file-pdf"></i> ${file ? file.name : 'Choose PDF'}
     <input type="file" id="resumeFileInput" accept=".pdf" style="display:none" />`;
    // Re-bind change (since we replaced the input)
    document.getElementById('resumeFileInput').addEventListener('change', arguments.callee);
});

document.getElementById('uploadResumeBtn').addEventListener('click', () => {
    // Find file input (may have been re-rendered)
    const inp = document.querySelector('#resumeAdminModal input[type=file]');
    const file = inp && inp.files[0];
    if (!file) { showToast('Please select a PDF file.', 'error'); return; }
    if (file.type !== 'application/pdf') { showToast('Only PDF files are allowed.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
        save('resumeData', { name: file.name, data: ev.target.result });
        renderResumeAdmin();
        showToast('Resume uploaded successfully!', 'success');
    };
    reader.readAsDataURL(file);
});

document.getElementById('deleteResumeBtn').addEventListener('click', () => {
    if (!confirm('Delete the resume?')) return;
    localStorage.removeItem('resumeData');
    renderResumeAdmin();
    showToast('Resume deleted.', '');
});

// ========================
// CONTACT FORM (simulated)
// ========================
document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    showToast('Message sent! (Configure EmailJS for real sending)', 'success');
    e.target.reset();
});

// ========================
// RENDER ALL
// ========================
function renderAll() {
    renderSkills();
    renderProjects();
    renderExperience();
    renderNotes();
    renderSocials();
}

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
    renderAll();

    // Reveal all static sections
    document.querySelectorAll('.about-card, .about-stats, .contact-form, .contact-info').forEach(el => {
        addReveal(el);
    });
});