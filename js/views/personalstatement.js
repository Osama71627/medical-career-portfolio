/* ============================================================
   views/personalstatement.js
   ============================================================ */
window.Views = window.Views || {};

const PS_FIELDS = [
  ['whyMedicine', 'Why Medicine?'],
  ['whyPsychiatry', 'Why Psychiatry?'],
  ['whyResearch', 'Why Research?'],
  ['problemsInterest', 'What problems interest me?'],
  ['whatDone', 'What have I done?'],
  ['whatLearned', 'What have I learned?'],
  ['impact', 'What impact do I want to make?'],
  ['whyPostgrad', 'Why postgraduate study?'],
  ['futureVision', 'Future Career Vision'],
];

Views.personalStatement = function (root) {
  const ps = Store.getData().personalStatement;

  root.appendChild(UI.sectionHeader({
    title: 'Personal Statement / Academic Story',
    subtitle: 'Your evolving narrative — write it once, refine it for years.',
  }));

  if (ps.updatedAt) {
    root.appendChild(UI.el(`<p class="save-indicator" style="margin-bottom:14px;">${t('Last updated')} ${UI.fmtDate(ps.updatedAt)}</p>`));
  }

  const readonly = UI.isReadOnly();

  PS_FIELDS.forEach(([key, label]) => {
    if (readonly && !ps[key]) return; // skip empty sections for visitors

    if (readonly) {
      root.appendChild(UI.el(`
        <div class="card" style="margin-bottom:16px;">
          <h3>${t(label)}</h3>
          <p style="white-space:pre-wrap;margin-top:8px;">${UI.esc(ps[key])}</p>
        </div>`));
      return;
    }

    const card = UI.el(`
      <div class="card" style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>${t(label)}</h3>
          <span class="save-indicator" data-indicator="${key}"></span>
        </div>
        <textarea class="textarea-autosave" data-key="${key}" placeholder="${t('Write your thoughts here...')}">${UI.esc(ps[key] || '')}</textarea>
      </div>`);
    root.appendChild(card);
    const textarea = UI.qs('textarea', card);
    const indicator = UI.qs('[data-indicator]', card);
    let timer;
    textarea.addEventListener('input', () => {
      indicator.textContent = t('Typing…');
      clearTimeout(timer);
      timer = setTimeout(() => {
        Store.updateObject('personalStatement', { [key]: textarea.value, updatedAt: new Date().toISOString() });
        indicator.textContent = t('Saved ✓');
        setTimeout(() => { indicator.textContent = ''; }, 1500);
      }, 500);
    });
  });

  if (readonly && PS_FIELDS.every(([key]) => !ps[key])) {
    root.appendChild(UI.emptyState({ icon: '✍️', title: 'Nothing here yet', desc: '' }));
  }
};
