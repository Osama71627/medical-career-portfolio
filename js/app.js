/* ============================================================
   app.js — shell, router, navigation, theme, language, owner mode
   One shell, two modes:
   - Visitor (default): full navigation, everything read-only.
   - Owner (after password): same shell, full editing unlocked.
   Editing anything as the owner updates the exact same data the
   visitor view reads, live — there is only one copy of the data,
   this browser's localStorage/IndexedDB.
   ============================================================ */

const NAV = [
  { group: 'Overview', items: [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'timeline', label: 'Timeline', icon: '🕘' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
  ]},
  { group: 'Academic', items: [
    { id: 'academic', label: 'Academic Record', icon: '🎓' },
    { id: 'english', label: 'English & Communication', icon: '🗣️' },
    { id: 'courses', label: 'Courses & Certifications', icon: '📚' },
  ]},
  { group: 'Psychiatry', items: [
    { id: 'psychiatry-fundamentals', label: 'Fundamentals', icon: '🧠' },
    { id: 'psychiatry-disorders', label: 'Major Disorders', icon: '🧩' },
    { id: 'psychopharm', label: 'Psychopharmacology', icon: '💊' },
    { id: 'psychotherapy', label: 'Psychotherapy', icon: '🗨️' },
    { id: 'clinical-cases', label: 'Topics & Clinical Cases', icon: '📋' },
    { id: 'clinical-skills', label: 'Clinical Skills', icon: '🩺' },
  ]},
  { group: 'Research', items: [
    { id: 'research', label: 'Research Dashboard', icon: '🔬' },
    { id: 'research-projects', label: 'Research Projects', icon: '🧪' },
    { id: 'publications', label: 'Publications', icon: '📄' },
    { id: 'conferences', label: 'Conferences', icon: '🎤' },
  ]},
  { group: 'Growth', items: [
    { id: 'volunteering', label: 'Volunteering', icon: '🤝' },
    { id: 'leadership', label: 'Leadership', icon: '🧭' },
    { id: 'books', label: 'Books & Articles', icon: '📖' },
    { id: 'mentors', label: 'Mentors & Network', icon: '🧑‍🏫' },
    { id: 'recommendations', label: 'Recommendation Letters', icon: '✉️' },
    { id: 'achievements', label: 'Achievements & Awards', icon: '🏆' },
    { id: 'evidence-impact', label: 'Evidence of Impact', icon: '🌍' },
  ]},
  { group: 'Career Tools', items: [
    { id: 'personal-statement', label: 'Personal Statement', icon: '✍️' },
    { id: 'goals', label: 'Future Goals', icon: '🎯' },
    { id: 'monthly-log', label: 'Monthly Log', icon: '🗓️' },
    { id: 'cv-builder', label: 'CV Builder', icon: '📇' },
  ]},
];

const OWNER_ONLY_NAV = { group: 'System', items: [
  { id: 'search', label: 'Search & Filter', icon: '🔍' },
  { id: 'settings', label: 'Settings & Backup', icon: '⚙️' },
]};
const VISITOR_NAV_EXTRA = { group: 'System', items: [
  { id: 'search', label: 'Search & Filter', icon: '🔍' },
]};

const VIEW_RENDERERS = {
  'dashboard': (root) => Views.dashboard(root),
  'academic': (root) => Views.academic(root),
  'psychiatry-fundamentals': (root) => Views.psychiatryFundamentals(root),
  'psychiatry-disorders': (root) => Views.psychiatryDisorders(root),
  'psychopharm': (root) => UI.renderCrudSection(root, Schemas.psychopharm),
  'psychotherapy': (root) => UI.renderCrudSection(root, Schemas.psychotherapy),
  'clinical-cases': (root) => UI.renderCrudSection(root, Schemas.clinicalCases),
  'clinical-skills': (root) => UI.renderCrudSection(root, Schemas.clinicalSkills),
  'research': (root) => Views.researchDashboard(root),
  'research-projects': (root) => UI.renderCrudSection(root, Schemas.researchProjects),
  'publications': (root) => UI.renderCrudSection(root, Schemas.publications),
  'conferences': (root) => UI.renderCrudSection(root, Schemas.conferences),
  'english': (root) => Views.english(root),
  'courses': (root) => UI.renderCrudSection(root, Schemas.courses),
  'volunteering': (root) => UI.renderCrudSection(root, Schemas.volunteering),
  'leadership': (root) => UI.renderCrudSection(root, Schemas.leadership),
  'books': (root) => UI.renderCrudSection(root, Schemas.books),
  'mentors': (root) => UI.renderCrudSection(root, Schemas.mentors),
  'recommendations': (root) => UI.renderCrudSection(root, Schemas.recommendations),
  'achievements': (root) => UI.renderCrudSection(root, Schemas.achievements),
  'evidence-impact': (root) => UI.renderCrudSection(root, Schemas.evidenceImpact),
  'personal-statement': (root) => Views.personalStatement(root),
  'goals': (root) => Views.goals(root),
  'monthly-log': (root) => UI.renderCrudSection(root, Schemas.monthlyLogs),
  'cv-builder': (root) => Views.cvBuilder(root),
  'timeline': (root) => Views.timeline(root),
  'analytics': (root) => Views.analytics(root),
  'search': (root) => Views.search(root),
  'settings': (root) => Views.settings(root),
};
const OWNER_ONLY_ROUTES = new Set(['settings']);

/* ---------- mode state ---------- */
let PREVIEW_MODE = false; // owner temporarily viewing as a visitor would
function isOwnerActive() { return Auth.isOwnerUnlocked() && !PREVIEW_MODE; }

function buildSidebar() {
  const nav = UI.qs('#sidebar-nav');
  nav.innerHTML = '';
  const groups = NAV.concat([isOwnerActive() ? OWNER_ONLY_NAV : VISITOR_NAV_EXTRA]);
  groups.forEach(g => {
    const group = UI.el(`<div class="nav-group"><div class="nav-group__title">${UI.esc(t(g.group))}</div></div>`);
    g.items.forEach(item => {
      const link = UI.el(`<div class="nav-link" data-route="${item.id}"><span class="nav-link__icon">${item.icon}</span><span>${UI.esc(t(item.label))}</span></div>`);
      link.addEventListener('click', () => { location.hash = '#/' + item.id; closeSidebarOnMobile(); });
      group.appendChild(link);
    });
    nav.appendChild(group);
  });
}

function closeSidebarOnMobile() {
  UI.qs('#sidebar').classList.remove('open');
  UI.qs('#sidebar-overlay').classList.remove('show');
}

function setActiveNav(routeId) {
  UI.qsa('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.route === routeId));
}

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, '');
  return hash || 'dashboard';
}

function router() {
  let route = currentRoute();
  if (!isOwnerActive() && OWNER_ONLY_ROUTES.has(route)) {
    route = 'dashboard';
    location.hash = '#/dashboard';
  }
  const root = UI.qs('#view-root');
  setActiveNav(route);
  root.innerHTML = '';
  const renderer = VIEW_RENDERERS[route];
  if (renderer) {
    try { renderer(root); }
    catch (e) {
      console.error(e);
      root.appendChild(UI.el(`<div class="card"><h3>Something went wrong rendering this section.</h3><p class="muted">${UI.esc(e.message)}</p></div>`));
    }
  } else {
    Views.dashboard(root);
  }
  window.scrollTo(0, 0);
}

/* ---------- theme ---------- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = theme === 'dark' ? '☀️' : '🌙';
  const btn = UI.qs('#theme-toggle');
  if (btn) btn.firstChild.textContent = icon + ' ';
}
function toggleTheme() {
  const data = Store.getData();
  const next = data.settings.theme === 'dark' ? 'light' : 'dark';
  Store.updateObject('settings', { theme: next });
  applyTheme(next);
}

/* ---------- language ---------- */
function refreshUiLanguage() {
  applyLangToDocument();
  updateShellChrome();
  router();
}

/* ---------- shell chrome (buttons/banners that depend on mode) ---------- */
function updateShellChrome() {
  UI.setReadOnly(!isOwnerActive());
  const unlocked = Auth.isOwnerUnlocked();

  UI.qs('#owner-login-btn').style.display = unlocked ? 'none' : '';
  UI.qs('#lock-btn').style.display = unlocked ? '' : 'none';

  const previewBtn = UI.qs('#preview-toggle-btn');
  previewBtn.style.display = unlocked ? '' : 'none';
  UI.qs('span', previewBtn).textContent = PREVIEW_MODE ? t('Exit Preview') : t('Preview as Visitor');
  previewBtn.firstChild.textContent = (PREVIEW_MODE ? '↩️' : '👁️') + ' ';

  UI.qs('#preview-banner').style.display = (unlocked && PREVIEW_MODE) ? 'flex' : 'none';

  buildSidebar();
}

/* ---------- owner login ---------- */
function openOwnerLogin() {
  if (!Auth.hasPasswordConfigured()) {
    UI.toast('Owner password is not configured yet — see js/owner-config.js', 'danger');
    return;
  }
  UI.openFormModal({
    title: 'Owner Login',
    fields: [{ key: 'password', label: 'Password', type: 'text', required: true }],
    onSubmit: async (vals) => {
      const ok = await Auth.checkPassword(vals.password);
      if (!ok) { UI.toast('Incorrect password', 'danger'); return; }
      Auth.markOwnerUnlocked();
      PREVIEW_MODE = false;
      render();
    },
  });
}

function exitOwnerMode() {
  Auth.lockOwnerMode();
  PREVIEW_MODE = false;
  location.hash = '#/dashboard';
  render();
}

function togglePreview() {
  PREVIEW_MODE = !PREVIEW_MODE;
  if (OWNER_ONLY_ROUTES.has(currentRoute()) && PREVIEW_MODE) location.hash = '#/dashboard';
  render();
}

/* ---------- render (single entry point for both modes) ---------- */
function render() {
  const data = Store.getData();
  applyTheme(data.settings.theme || 'light');
  applyLangToDocument();
  updateShellChrome();
  UI.qs('#app').style.display = 'flex';
  router();
}

function initShellEvents() {
  UI.qs('#theme-toggle').addEventListener('click', toggleTheme);
  UI.qs('#lang-toggle').addEventListener('click', () => { toggleLang(); refreshUiLanguage(); });
  UI.qs('#owner-login-btn').addEventListener('click', openOwnerLogin);
  UI.qs('#lock-btn').addEventListener('click', exitOwnerMode);
  UI.qs('#preview-toggle-btn').addEventListener('click', togglePreview);
  UI.qs('#exit-preview-btn').addEventListener('click', togglePreview);
  UI.qs('#menu-toggle').addEventListener('click', () => {
    UI.qs('#sidebar').classList.toggle('open');
    UI.qs('#sidebar-overlay').classList.toggle('show');
  });
  UI.qs('#sidebar-overlay').addEventListener('click', closeSidebarOnMobile);
  UI.qs('#cv-shortcut-btn').addEventListener('click', () => { location.hash = '#/cv-builder'; });
  const search = UI.qs('#global-search');
  let searchTimer;
  search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      if (search.value.trim()) {
        location.hash = '#/search';
        setTimeout(() => window.dispatchEvent(new CustomEvent('global-search', { detail: search.value.trim() })), 30);
      }
    }, 300);
  });
  window.addEventListener('hashchange', router);
}

function init() {
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  initShellEvents();
  applyLangToDocument();
  init();
  // ?owner=1 is a bookmarkable shortcut straight to the owner login prompt
  const params = new URLSearchParams(location.search);
  if (params.get('owner') === '1' && !Auth.isOwnerUnlocked()) {
    setTimeout(openOwnerLogin, 50);
  }
});
