/* ============================================================
   views/research.js
   ============================================================ */
window.Views = window.Views || {};

Views.researchDashboard = function (root) {
  const data = Store.getData();

  root.appendChild(UI.sectionHeader({
    title: 'Research Dashboard', subtitle: 'Every project, publication and skill — in one place.',
  }));

  const grid = UI.el(`<div class="dash-grid"></div>`);
  root.appendChild(grid);

  const stats = [
    ['🔬', 'Research Projects', data.researchProjects.length, 'research-projects'],
    ['📄', 'Publications', data.publications.length, 'publications'],
    ['🎤', 'Conference Presentations', data.conferences.length, 'conferences'],
    ['📊', 'Skills in Progress', data.researchSkills.filter(s => s.status !== 'Not Started').length, null],
  ];
  stats.forEach(([icon, label, value, route]) => {
    const card = UI.el(`
      <div class="card g-3 stat-card" ${route ? 'style="cursor:pointer;"' : ''}>
        <div class="stat-card__icon">${icon}</div>
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label">${t(label)}</div>
      </div>`);
    if (route) card.addEventListener('click', () => { location.hash = '#/' + route; });
    grid.appendChild(card);
  });

  const pipelineCard = UI.el(`<div class="card g-12"><h3>${t('Project Pipeline')}</h3><div class="tag-row" style="margin-top:10px;"></div></div>`);
  grid.appendChild(pipelineCard);
  const tagRow = UI.qs('.tag-row', pipelineCard);
  Consts.PROJECT_STATUS.forEach(status => {
    const count = data.researchProjects.filter(p => p.status === status).length;
    tagRow.appendChild(UI.el(`<span class="badge badge--${UI.STATUS_COLORS[status] || 'gray'}" style="font-size:12.5px;padding:6px 12px;">${t(status)}: ${count}</span>`));
  });

  const skillsCard = UI.el(`<div class="card g-12"><div class="checklist-host"></div></div>`);
  grid.appendChild(skillsCard);
  UI.renderStatusChecklist(UI.qs('.checklist-host', skillsCard), {
    collection: 'researchSkills', title: 'Research Skills', subtitle: 'Core competencies for producing good research.',
    statusOptions: Consts.SKILL_STATUS, allowAdd: true, newLabel: '+ Add Skill',
  });
};
