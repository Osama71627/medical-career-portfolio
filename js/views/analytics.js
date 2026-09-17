/* ============================================================
   views/analytics.js — personal development analytics
   ============================================================ */
window.Views = window.Views || {};

Views.analytics = function (root) {
  const d = Store.getData();

  root.appendChild(UI.sectionHeader({
    title: 'Personal Development Analytics', subtitle: 'How your portfolio has grown over time.',
  }));

  const grid = UI.el(`<div class="dash-grid"></div>`);
  root.appendChild(grid);

  const counts = [
    ['Courses', d.courses.length], ['Research Projects', d.researchProjects.length],
    ['Publications', d.publications.length], ['Conference Presentations', d.conferences.length],
    ['Volunteer Activities', d.volunteering.length], ['Leadership Experiences', d.leadership.length],
    ['Books Read', d.books.length], ['Clinical Skills Tracked', d.clinicalSkills.length],
    ['Psychiatry Topics', d.clinicalCases.length], ['Achievements', d.achievements.length],
  ];
  counts.forEach(([label, value]) => {
    grid.appendChild(UI.el(`
      <div class="card g-3 stat-card">
        <div class="stat-card__value">${value}</div>
        <div class="stat-card__label">${UI.esc(t(label))}</div>
      </div>`));
  });

  const progressChart = UI.el(`<div class="card g-12"><h3>${t('Progress Overview')}</h3><div style="margin-top:16px;"></div></div>`);
  grid.appendChild(progressChart);
  renderBarChart(UI.qs('div > div', progressChart), Object.entries(PROGRESS_LABELS).map(([k, l]) => ({ label: shortLabel(t(l)), value: d.progress[k] })));

  const skillsChart = UI.el(`<div class="card g-12"><h3>${t('Clinical Skills — Status Breakdown')}</h3><div style="margin-top:16px;"></div></div>`);
  grid.appendChild(skillsChart);
  const statusCounts = Consts.SKILL_STATUS.map(s => ({ label: t(s), value: d.clinicalSkills.filter(sk => sk.status === s).length }));
  renderBarChart(UI.qs('div > div', skillsChart), statusCounts, true);

  const researchChart = UI.el(`<div class="card g-12"><h3>${t('Research Pipeline')}</h3><div style="margin-top:16px;"></div></div>`);
  grid.appendChild(researchChart);
  const pipelineCounts = Consts.PROJECT_STATUS.map(s => ({ label: shortLabel(t(s)), value: d.researchProjects.filter(p => p.status === s).length }));
  renderBarChart(UI.qs('div > div', researchChart), pipelineCounts, true);

  const logCard = UI.el(`<div class="card g-12"><h3>${t('Monthly Logs Recorded')}</h3><p class="stat-card__value" style="margin-top:8px;">${d.monthlyLogs.length}</p><p class="muted small">${t('Consistent monthly reflection is one of the strongest predictors of long-term growth.')}</p></div>`);
  grid.appendChild(logCard);

  function shortLabel(l) { return l.length > 12 ? l.slice(0, 11) + '…' : l; }
};

function renderBarChart(host, items, wholeNumbers) {
  const max = Math.max(1, ...items.map(i => i.value));
  const bar = UI.el(`<div class="kpi-chart-bar"></div>`);
  items.forEach(i => {
    const pct = Math.max(2, (i.value / max) * 100);
    bar.appendChild(UI.el(`<div class="kpi-chart-bar__col" style="height:${pct}%;"><span>${wholeNumbers ? i.value : i.value + '%'}</span></div>`));
  });
  host.appendChild(bar);
  const labels = UI.el(`<div class="chart-labels"></div>`);
  items.forEach(i => labels.appendChild(UI.el(`<span>${UI.esc(i.label)}</span>`)));
  host.appendChild(labels);
}
