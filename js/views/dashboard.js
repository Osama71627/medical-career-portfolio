/* ============================================================
   views/dashboard.js
   ============================================================ */
window.Views = window.Views || {};

const PROGRESS_LABELS = {
  academicPerformance: 'Academic Performance', medicalKnowledge: 'Medical Knowledge',
  psychiatry: 'Psychiatry', clinicalSkills: 'Clinical Skills', research: 'Research',
  statistics: 'Statistics', english: 'English', volunteering: 'Volunteering',
  leadership: 'Leadership', publications: 'Publications',
};

Views.dashboard = function (root) {
  const data = Store.getData();
  const p = data.profile;

  root.appendChild(UI.sectionHeader({
    title: `${t('Welcome')}, ${p.name ? p.name : t('Future Psychiatrist')}`,
    subtitle: 'Here is a snapshot of your medical career journey.',
    actions: UI.isReadOnly() ? [] : [{ label: 'Edit Profile', className: 'btn--ghost', onClick: openProfileModal }],
  }));

  const grid = UI.el(`<div class="dash-grid"></div>`);
  root.appendChild(grid);

  /* ---- profile card ---- */
  const profileCard = UI.el(`<div class="card g-8"><h3>${t('Profile')}</h3><div class="profile-card"></div></div>`);
  grid.appendChild(profileCard);
  renderProfileCard(UI.qs('.profile-card', profileCard), p);

  /* ---- quick stats ---- */
  const stats = computeStats(data);
  const statsCard = UI.el(`
    <div class="card g-4">
      <h3>${t('At a Glance')}</h3>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:10px;">
        ${statRow('📄', 'Publications', stats.publications)}
        ${statRow('🔬', 'Research Projects', stats.researchProjects)}
        ${statRow('🎤', 'Conferences', stats.conferences)}
        ${statRow('🤝', 'Volunteering', stats.volunteering)}
      </div>
    </div>`);
  grid.appendChild(statsCard);

  /* ---- career vision ---- */
  const visionCard = UI.el(`<div class="card g-12"><h3>${t('Career Vision')}</h3><div class="vision-flow" style="margin-top:12px;"></div></div>`);
  grid.appendChild(visionCard);
  const flowHost = UI.qs('.vision-flow', visionCard);
  data.careerVision.forEach((stage, i) => {
    if (i > 0) flowHost.appendChild(UI.el(`<span class="vision-arrow">→</span>`));
    flowHost.appendChild(UI.el(`<span class="vision-node ${i === data.careerVisionCurrentIndex ? 'vision-node--current' : ''}">${UI.esc(t(stage))}</span>`));
  });
  if (!UI.isReadOnly()) {
    const editBtn = UI.el(`<button class="btn btn--ghost btn--sm" style="margin-top:10px;">✏️ ${t('Edit Career Path')}</button>`);
    visionCard.appendChild(editBtn);
    editBtn.addEventListener('click', openVisionModal);
  }

  /* ---- progress ---- */
  const progressCard = UI.el(`<div class="card g-12"><h3>${t('Current Progress')}</h3>${UI.isReadOnly() ? '' : `<p class="muted small">${t('Drag each slider to reflect your honest self-assessment.')}</p>`}<div class="progress-grid" style="margin-top:10px;"></div></div>`);
  grid.appendChild(progressCard);
  const pgrid = UI.qs('.progress-grid', progressCard);
  Object.entries(PROGRESS_LABELS).forEach(([key, label]) => {
    pgrid.appendChild(UI.progressBar(data.progress[key], {
      label, editable: !UI.isReadOnly(),
      onChange: (v) => { Store.updateObject('progress', { [key]: v }); },
    }));
  });

  /* ---- shortcuts ---- */
  const shortcuts = UI.el(`<div class="card g-12"><h3>${t('Jump To')}</h3><div class="card-grid" style="margin-top:10px;"></div></div>`);
  grid.appendChild(shortcuts);
  const shortcutGrid = UI.qs('.card-grid', shortcuts);
  [
    ['psychiatry-fundamentals', '🧠', 'Psychiatry Journey', 'Fundamentals, disorders, pharmacology, cases'],
    ['research', '🔬', 'Research Dashboard', 'Projects, publications, skills'],
    ['cv-builder', '📇', 'CV Builder', 'Generate an up-to-date CV in minutes'],
    ['goals', '🎯', 'Future Goals', '1-year, 3-year, 5-year and long-term goals — reviewed and updated over time.'],
    ['monthly-log', '🗓️', 'Monthly Log', "Reflect on this month's growth"],
    ['personal-statement', '✍️', 'Personal Statement', 'Why medicine, why psychiatry, why research'],
  ].forEach(([route, icon, title, desc]) => {
    const card = UI.el(`
      <div class="item-card" style="cursor:pointer;">
        <div style="font-size:22px;">${icon}</div>
        <h4 style="margin-top:8px;">${t(title)}</h4>
        <p class="muted small">${t(desc)}</p>
      </div>`);
    card.addEventListener('click', () => { location.hash = '#/' + route; });
    shortcutGrid.appendChild(card);
  });

  /* ---------- helpers ---------- */
  function statRow(icon, label, value) {
    return `<div class="stat-card__row"><div class="stat-card__icon">${icon}</div><div><div class="stat-card__value" style="font-size:20px;">${value}</div><div class="stat-card__label">${t(label)}</div></div></div>`;
  }

  function openProfileModal() {
    UI.openFormModal({
      title: 'Edit Profile', wide: true,
      fields: [
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'levelLabel', label: 'Current Status', type: 'text', placeholder: 'e.g. Medical Student — Level 5' },
        { key: 'futureGoal', label: 'Future Goal', type: 'text' },
        { key: 'researchInterest', label: 'Research Interest', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'bio', label: 'Short Bio', type: 'textarea', full: true, rows: 3 },
        { key: 'photoFileId', label: 'Profile Photo', type: 'file', full: true },
      ],
      values: p,
      onSubmit: (vals) => { Store.updateObject('profile', vals); router(); },
    });
  }

  function openVisionModal() {
    const overlay = UI.openFormModal({
      title: 'Edit Career Path', wide: true,
      fields: [
        { key: 'stagesText', label: 'One stage per line', type: 'textarea', rows: 8, full: true },
        { key: 'currentIndex', label: 'Current stage (0 = first line)', type: 'number' },
      ],
      values: { stagesText: data.careerVision.join('\n'), currentIndex: data.careerVisionCurrentIndex },
      onSubmit: (vals) => {
        const stages = vals.stagesText.split('\n').map(s => s.trim()).filter(Boolean);
        const idx = Math.max(0, Math.min(stages.length - 1, Number(vals.currentIndex) || 0));
        const d = Store.getData();
        d.careerVision = stages;
        d.careerVisionCurrentIndex = idx;
        Store.saveData();
        router();
      },
    });
  }
};

function renderProfileCard(host, p) {
  host.innerHTML = `
    <div class="profile-photo" id="profile-photo-slot">${p.photoFileId ? '' : (p.name ? p.name[0].toUpperCase() : '👤')}</div>
    <div>
      <h2 style="margin-bottom:2px;">${UI.esc(p.name || t('Your Name'))}</h2>
      <p class="muted" style="margin-bottom:6px;">${UI.esc(p.levelLabel || t('Medical Student'))}</p>
      ${p.bio ? `<p class="small">${UI.esc(p.bio)}</p>` : ''}
      <div class="profile-meta">
        <span>🎯 ${t('Goal:')} ${UI.esc(p.futureGoal || '—')}</span>
        <span>🔬 ${t('Research:')} ${UI.esc(p.researchInterest || '—')}</span>
        <span>📍 ${UI.esc(p.location || '—')}</span>
        <span>✉️ ${UI.esc(p.email || '—')}</span>
      </div>
    </div>`;
  if (p.photoFileId) {
    Store.getFile(p.photoFileId).then(rec => {
      if (rec) {
        const url = URL.createObjectURL(rec.blob);
        UI.qs('#profile-photo-slot', host).innerHTML = `<img src="${url}" alt="Profile photo" />`;
      }
    });
  }
}

function computeStats(data) {
  return {
    publications: data.publications.length,
    researchProjects: data.researchProjects.length,
    conferences: data.conferences.length,
    volunteering: data.volunteering.length,
  };
}
