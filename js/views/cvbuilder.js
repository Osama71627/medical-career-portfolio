/* ============================================================
   views/cvbuilder.js — CV assembled live from portfolio data
   ============================================================ */
window.Views = window.Views || {};

const CV_SECTIONS = [
  ['profile', 'Personal Information'],
  ['education', 'Education'],
  ['academicAchievements', 'Academic Achievements'],
  ['clinical', 'Clinical Experience (Skills)'],
  ['psychiatry', 'Psychiatry Experience'],
  ['research', 'Research'],
  ['publications', 'Publications'],
  ['conferences', 'Conferences & Presentations'],
  ['volunteering', 'Volunteering'],
  ['leadership', 'Leadership'],
  ['courses', 'Courses & Certifications'],
  ['skills', 'Skills Summary'],
  ['languages', 'Languages'],
  ['awards', 'Achievements & Awards'],
];

Views.cvBuilder = function (root) {
  const data = Store.getData();

  root.appendChild(UI.sectionHeader({
    title: 'CV Builder', subtitle: 'Generated automatically from your portfolio data.',
    actions: [{ label: '🖨️ Print / Export PDF', onClick: () => window.print() }],
  }));

  const layout = UI.el(`<div class="cv-layout"></div>`);
  root.appendChild(layout);

  const options = UI.el(`
    <div class="cv-options card">
      <h3>${t('Sections to include')}</h3>
      <div class="cv-check-list" style="margin-top:8px;"></div>
      <hr style="border:none;border-top:1px solid var(--border);margin:14px 0;" />
      <p class="muted small">${t('Use your browser\'s Print dialog and choose "Save as PDF" to export.')}</p>
    </div>`);
  layout.appendChild(options);

  const previewWrap = UI.el(`<div><div id="cv-preview"></div></div>`);
  layout.appendChild(previewWrap);

  const checkList = UI.qs('.cv-check-list', options);
  const included = new Set(data.cvSettings.includedSections);
  const readonly = UI.isReadOnly();
  CV_SECTIONS.forEach(([key, label]) => {
    const row = UI.el(`<label class="cv-check-row"><input type="checkbox" data-key="${key}" ${included.has(key) ? 'checked' : ''} ${readonly ? 'disabled' : ''}/> ${UI.esc(t(label))}</label>`);
    if (!readonly) {
      UI.qs('input', row).addEventListener('change', (e) => {
        if (e.target.checked) included.add(key); else included.delete(key);
        Store.updateObject('cvSettings', { includedSections: Array.from(included) });
        renderPreview();
      });
    }
    checkList.appendChild(row);
  });

  renderPreview();

  function renderPreview() {
    const d = Store.getData();
    const p = d.profile;
    let html = `
      <h1>${UI.esc(p.name || t('Your Name'))}</h1>
      <div class="cv-contact">${[p.levelLabel, p.location, p.email].filter(Boolean).map(UI.esc).join(' · ')}</div>`;

    if (included.has('profile') && p.bio) {
      html += `<p>${UI.esc(p.bio)}</p>`;
    }

    if (included.has('education')) {
      const info = d.academicInfo;
      html += `<h2>${t('Education')}</h2>`;
      html += cvEntry(info.university || t('Medical School'), `${info.currentLevel || ''} ${info.academicYears ? '· ' + info.academicYears : ''}`,
        [info.medicalSchool, info.gpa && `${t('GPA:')} ${info.gpa}`, info.classRanking && `${t('Rank:')} ${info.classRanking}`].filter(Boolean).join(' · '));
    }

    if (included.has('academicAchievements') && d.academicItems.length) {
      html += `<h2>${t('Academic Achievements')}</h2>`;
      d.academicItems.forEach(i => { html += cvEntry(i.title, UI.fmtDate(i.date), `${t(i.type)}${i.description ? ' — ' + i.description : ''}`); });
    }

    if (included.has('clinical') && d.clinicalSkills.some(s => s.status !== 'Not Started')) {
      html += `<h2>${t('Clinical Experience')}</h2><p>${d.clinicalSkills.filter(s => s.status !== 'Not Started').map(s => `${esc(t(s.skill))} (${esc(t(s.status))})`).join(' · ')}</p>`;
    }

    if (included.has('psychiatry')) {
      const disorders = d.psychiatryDisorders.filter(x => x.status !== 'Not Started');
      const fundamentals = d.psychiatryFundamentals.filter(x => x.status !== 'Not Started');
      if (disorders.length || fundamentals.length || d.clinicalCases.length) {
        html += `<h2>${t('Psychiatry Experience')}</h2>`;
        if (fundamentals.length) html += `<p><strong>${t('Fundamentals:')}</strong> ${fundamentals.map(x => esc(t(x.name))).join(', ')}</p>`;
        if (disorders.length) html += `<p><strong>${t('Disorders studied:')}</strong> ${disorders.map(x => esc(t(x.name))).join(', ')}</p>`;
        if (d.clinicalCases.length) html += `<p><strong>${t('Topics / cases documented:')}</strong> ${d.clinicalCases.length}</p>`;
      }
    }

    if (included.has('research') && d.researchProjects.length) {
      html += `<h2>${t('Research Experience')}</h2>`;
      d.researchProjects.forEach(r => { html += cvEntry(r.projectTitle, `${r.startDate ? UI.fmtDate(r.startDate) : ''}${r.endDate ? ' – ' + UI.fmtDate(r.endDate) : ''}`, [r.myRole, r.institution, t(r.status)].filter(Boolean).join(' · ')); });
    }

    if (included.has('publications') && d.publications.length) {
      html += `<h2>${t('Publications')}</h2>`;
      d.publications.forEach(pub => { html += cvEntry(pub.title, UI.fmtDate(pub.publicationDate), [pub.authors, pub.journal, pub.doi && `DOI: ${pub.doi}`].filter(Boolean).join(' · ')); });
    }

    if (included.has('conferences') && d.conferences.length) {
      html += `<h2>${t('Conferences & Presentations')}</h2>`;
      d.conferences.forEach(c => { html += cvEntry(c.presentationTitle || c.conferenceName, UI.fmtDate(c.date), [c.conferenceName, t(c.role), c.location].filter(Boolean).join(' · ')); });
    }

    if (included.has('volunteering') && d.volunteering.length) {
      html += `<h2>${t('Volunteering')}</h2>`;
      d.volunteering.forEach(v => { html += cvEntry(`${t(v.role) || t('Volunteer')} — ${v.organization}`, `${v.startDate ? UI.fmtDate(v.startDate) : ''}${v.endDate ? ' – ' + UI.fmtDate(v.endDate) : ''}`, v.impact || v.project || ''); });
    }

    if (included.has('leadership') && d.leadership.length) {
      html += `<h2>${t('Leadership')}</h2>`;
      d.leadership.forEach(l => { html += cvEntry(`${l.position} — ${l.organization}`, `${l.startDate ? UI.fmtDate(l.startDate) : ''}${l.endDate ? ' – ' + UI.fmtDate(l.endDate) : ''}`, l.outcome || l.project || ''); });
    }

    if (included.has('courses') && d.courses.length) {
      html += `<h2>${t('Courses & Certifications')}</h2>`;
      d.courses.forEach(c => { html += cvEntry(c.courseName, UI.fmtDate(c.completionDate), [c.provider, t(c.category)].filter(Boolean).join(' · ')); });
    }

    if (included.has('skills')) {
      const skills = [
        ...d.clinicalSkills.filter(s => s.status !== 'Not Started').map(s => t(s.skill)),
        ...d.researchSkills.filter(s => s.status !== 'Not Started').map(s => t(s.name)),
      ];
      if (skills.length) html += `<h2>${t('Skills')}</h2><p>${skills.map(esc).join(' · ')}</p>`;
    }

    if (included.has('languages') && d.languages.length) {
      html += `<h2>${t('Languages')}</h2><p>${d.languages.map(l => `${esc(t(l.language))} (${esc(l.level)})`).join(' · ')}</p>`;
    }

    if (included.has('awards') && d.achievements.length) {
      html += `<h2>${t('Achievements & Awards')}</h2>`;
      d.achievements.forEach(a => { html += cvEntry(a.title, UI.fmtDate(a.date), a.description || ''); });
    }

    UI.qs('#cv-preview', previewWrap).innerHTML = html;
  }

  function cvEntry(title, meta, desc) {
    return `<div class="cv-entry"><div class="cv-entry__head"><span>${esc(title || '')}</span><span class="cv-entry__meta">${esc(meta || '')}</span></div>${desc ? `<div>${esc(desc)}</div>` : ''}</div>`;
  }
  function esc(s) { return UI.esc(s); }
};
