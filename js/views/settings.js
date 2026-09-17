/* ============================================================
   views/settings.js — backup, languages, public mode, danger zone
   ============================================================ */
window.Views = window.Views || {};

Views.settings = function (root) {
  root.appendChild(UI.sectionHeader({ title: 'Settings & Backup', subtitle: 'Security, data backup and portfolio configuration.' }));

  const grid = UI.el(`<div class="dash-grid"></div>`);
  root.appendChild(grid);

  /* ---- owner access ---- */
  const secCard = UI.el(`
    <div class="card g-12">
      <h3>${t('Owner Access')}</h3>
      <p class="muted small">${t('Your owner password is the same everywhere — it is stored in your site\'s files (js/owner-config.js), not in this browser. To change it, generate a new hash below, paste it into that file, then commit and redeploy your site.')}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
        <button class="btn btn--ghost btn--sm" id="change-pw">🔑 ${t('Generate New Password Hash')}</button>
      </div>
    </div>`);
  grid.appendChild(secCard);

  UI.qs('#change-pw', secCard).addEventListener('click', () => {
    UI.openFormModal({
      title: 'Generate New Password Hash',
      fields: [{ key: 'pw', label: 'New Password', type: 'text', required: true }],
      onSubmit: async (vals) => {
        if (vals.pw.length < 4) { UI.toast('Password must be at least 4 characters', 'danger'); return; }
        const hash = await Auth.hashForNewPassword(vals.pw);
        showHashResult(hash);
      },
    });
  });

  function showHashResult(hash) {
    UI.openFormModal({
      title: 'Copy This Into js/owner-config.js', wide: true,
      fields: [
        { key: 'hash', label: 'New OWNER_PASSWORD_HASH value', type: 'text', full: true },
        { key: 'note', label: 'Instructions', type: 'textarea', full: true, rows: 3 },
      ],
      values: {
        hash,
        note: t('Open js/owner-config.js, replace the OWNER_PASSWORD_HASH value with the text above (keep the quotes), save, then commit and redeploy your site. Every browser will accept the new password immediately after that.'),
      },
      onSubmit: () => {},
    });
  }

  /* ---- backup ---- */
  const backupCard = UI.el(`
    <div class="card g-6">
      <h3>${t('Backup & Restore')}</h3>
      <p class="muted small">${t('Your data lives only in this browser. Export regularly so you never lose years of work.')}</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-top:10px;">
        <button class="btn btn--primary btn--block" id="export-btn">⬇️ ${t('Export Full Backup (JSON)')}</button>
        <label class="btn btn--ghost btn--block" style="text-align:center;">
          ⬆️ ${t('Import Backup (Replace All)')}
          <input type="file" accept=".json" id="import-replace" style="display:none;" />
        </label>
        <label class="btn btn--ghost btn--block" style="text-align:center;">
          🔀 ${t('Import Backup (Merge Data Only)')}
          <input type="file" accept=".json" id="import-merge" style="display:none;" />
        </label>
      </div>
    </div>`);
  grid.appendChild(backupCard);

  UI.qs('#export-btn', backupCard).addEventListener('click', async () => {
    UI.toast('Preparing backup...');
    const payload = await Store.exportBackup();
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `medical-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    UI.toast('Backup downloaded');
  });
  UI.qs('#import-replace', backupCard).addEventListener('change', (e) => handleImport(e, false));
  UI.qs('#import-merge', backupCard).addEventListener('change', (e) => handleImport(e, true));

  async function handleImport(e, merge) {
    const file = e.target.files[0];
    if (!file) return;
    const ok = await UI.confirmDialog(merge ? 'Merge this backup into your current data?' : 'Replace ALL current data with this backup? This cannot be undone.', { okLabel: 'Import' });
    if (!ok) { e.target.value = ''; return; }
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      await Store.importBackup(payload, { merge });
      UI.toast('Backup imported');
      render();
    } catch (err) {
      UI.toast('Invalid backup file', 'danger');
      console.error(err);
    }
    e.target.value = '';
  }

  /* ---- languages ---- */
  const langCard = UI.el(`<div class="card g-6"><h3>${t('Languages')}</h3><div class="checklist-grid" id="lang-list" style="margin-top:10px;"></div><button class="btn btn--ghost btn--sm" id="add-lang" style="margin-top:10px;">+ ${t('Add Language')}</button></div>`);
  grid.appendChild(langCard);
  renderLanguages();

  UI.qs('#add-lang', langCard).addEventListener('click', () => {
    UI.openFormModal({
      title: 'Add Language',
      fields: [{ key: 'language', label: 'Language', type: 'text', required: true }, { key: 'level', label: 'Level', type: 'text', placeholder: 'e.g. Native, B2, Fluent' }],
      onSubmit: (vals) => { Store.addItem('languages', vals); renderLanguages(); },
    });
  });

  function renderLanguages() {
    const host = UI.qs('#lang-list', langCard);
    host.innerHTML = '';
    Store.listOf('languages').forEach(l => {
      const row = UI.el(`<div class="checklist-row"><div class="checklist-row__main"><strong>${UI.esc(t(l.language))}</strong> <span class="muted small">${UI.esc(l.level || '')}</span></div><button class="icon-btn icon-btn--danger" data-act="del">🗑️</button></div>`);
      UI.qs('[data-act="del"]', row).addEventListener('click', () => { Store.deleteItem('languages', l.id); renderLanguages(); });
      host.appendChild(row);
    });
  }

  /* ---- public mode info ---- */
  const publicCard = UI.el(`
    <div class="card g-12">
      <h3>${t('Private / Public Mode')}</h3>
      <p class="muted small">${t('Every section you fill in is visible to anyone who opens this link — read-only, with no edit buttons. Only you, after logging in as owner, can add, edit or delete anything. Use "Preview as Visitor" any time to see exactly what visitors see.')}</p>
      <button class="btn btn--ghost btn--sm" id="open-public">👁️ ${t('Preview as Visitor')}</button>
    </div>`);
  grid.appendChild(publicCard);
  UI.qs('#open-public', publicCard).addEventListener('click', () => togglePreview());

  /* ---- danger zone ---- */
  const dangerCard = UI.el(`
    <div class="card g-12" style="border-color:var(--danger);">
      <h3 style="color:var(--danger);">${t('Danger Zone')}</h3>
      <p class="muted small">${t('Permanently erase all portfolio data and files from this browser. Export a backup first.')}</p>
      <button class="btn btn--danger" id="reset-all">🗑️ ${t('Erase All Data')}</button>
    </div>`);
  grid.appendChild(dangerCard);
  UI.qs('#reset-all', dangerCard).addEventListener('click', async () => {
    const ok = await UI.confirmDialog('This permanently deletes all portfolio data and uploaded files from this browser. Have you exported a backup?', { okLabel: 'Erase Everything' });
    if (!ok) return;
    await Store.resetAllData();
    location.reload();
  });
};
