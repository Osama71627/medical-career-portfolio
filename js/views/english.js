/* ============================================================
   views/english.js
   ============================================================ */
window.Views = window.Views || {};

const ENGLISH_SKILLS = {
  academicReading: 'Academic Reading', academicWriting: 'Academic Writing',
  speaking: 'Speaking', listening: 'Listening', medicalEnglish: 'Medical English',
  presentationSkills: 'Presentation Skills',
};

Views.english = function (root) {
  const data = Store.getData();
  const rec = data.englishRecord;

  root.appendChild(UI.sectionHeader({
    title: 'English & Academic Communication', subtitle: 'Track your development toward academic fluency.',
    actions: UI.isReadOnly() ? [] : [{ label: '✏️ Edit Levels', onClick: openEdit }],
  }));

  const grid = UI.el(`<div class="dash-grid"></div>`);
  root.appendChild(grid);

  const infoCard = UI.el(`
    <div class="card g-12">
      <div class="info-grid">
        <div class="info-tile"><div class="info-tile__label">${t('Current Level')}</div><div class="info-tile__value">${UI.esc(rec.currentLevel || '—')}</div></div>
        <div class="info-tile"><div class="info-tile__label">${t('Target Level')}</div><div class="info-tile__value">${UI.esc(rec.targetLevel || '—')}</div></div>
        <div class="info-tile"><div class="info-tile__label">${t('IELTS')}</div><div class="info-tile__value">${UI.esc(rec.ielts || '—')}</div></div>
        <div class="info-tile"><div class="info-tile__label">${t('TOEFL')}</div><div class="info-tile__value">${UI.esc(rec.toefl || '—')}</div></div>
      </div>
    </div>`);
  grid.appendChild(infoCard);

  const progCard = UI.el(`<div class="card g-12"><h3>${t('Skill Development')}</h3><div class="progress-grid" style="margin-top:12px;"></div></div>`);
  grid.appendChild(progCard);
  const pgrid = UI.qs('.progress-grid', progCard);
  Object.entries(ENGLISH_SKILLS).forEach(([key, label]) => {
    pgrid.appendChild(UI.progressBar(rec[key], {
      label, editable: !UI.isReadOnly(),
      onChange: (v) => { Store.updateObject('englishRecord', { [key]: v }); },
    }));
  });

  const evidenceHost = UI.el(`<div class="g-12"></div>`);
  grid.appendChild(evidenceHost);
  UI.renderCrudSection(evidenceHost, Schemas.englishEvidence);

  function openEdit() {
    UI.openFormModal({
      title: 'Edit English Levels', wide: true,
      fields: [
        { key: 'currentLevel', label: 'Current Level', type: 'text', placeholder: 'e.g. B2' },
        { key: 'targetLevel', label: 'Target Level', type: 'text', placeholder: 'e.g. C1' },
        { key: 'ielts', label: 'IELTS Score', type: 'text' },
        { key: 'toefl', label: 'TOEFL Score', type: 'text' },
      ],
      values: rec,
      onSubmit: (vals) => { Store.updateObject('englishRecord', vals); router(); },
    });
  }
};
