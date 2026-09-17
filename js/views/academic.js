/* ============================================================
   views/academic.js
   ============================================================ */
window.Views = window.Views || {};

Views.academic = function (root) {
  const data = Store.getData();
  const info = data.academicInfo;

  root.appendChild(UI.sectionHeader({
    title: 'Academic Record', subtitle: 'Your institutional record, awards, exams and certificates.',
  }));

  const infoCard = UI.el(`
    <div class="card" style="margin-bottom:20px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <h3>${t('Institution Details')}</h3>
        ${UI.isReadOnly() ? '' : `<button class="btn btn--ghost btn--sm" id="edit-academic-info">✏️ ${t('Edit')}</button>`}
      </div>
      <div class="info-grid" style="margin-top:12px;"></div>
    </div>`);
  root.appendChild(infoCard);
  renderInfoGrid();

  const listHost = UI.el(`<div></div>`);
  root.appendChild(listHost);
  UI.renderCrudSection(listHost, Schemas.academicItems);

  function renderInfoGrid() {
    const grid = UI.qs('.info-grid', infoCard);
    const tiles = [
      ['University', info.university], ['Medical School', info.medicalSchool],
      ['Current Level', info.currentLevel], ['Academic Years', info.academicYears],
      ['GPA / Average', info.gpa], ['Class Ranking', info.classRanking],
    ];
    grid.innerHTML = tiles.map(([label, val]) => `
      <div class="info-tile">
        <div class="info-tile__label">${UI.esc(t(label))}</div>
        <div class="info-tile__value">${UI.esc(val || '—')}</div>
      </div>`).join('');
  }

  const editBtn = UI.qs('#edit-academic-info', infoCard);
  if (editBtn) editBtn.addEventListener('click', () => {
    UI.openFormModal({
      title: 'Edit Institution Details', wide: true,
      fields: [
        { key: 'university', label: 'University', type: 'text' },
        { key: 'medicalSchool', label: 'Medical School', type: 'text' },
        { key: 'currentLevel', label: 'Current Level', type: 'text' },
        { key: 'academicYears', label: 'Academic Years', type: 'text', placeholder: 'e.g. 2021 – Present' },
        { key: 'gpa', label: 'GPA / Average', type: 'text' },
        { key: 'classRanking', label: 'Class Ranking', type: 'text' },
      ],
      values: info,
      onSubmit: (vals) => { Store.updateObject('academicInfo', vals); renderInfoGrid(); },
    });
  });
};
