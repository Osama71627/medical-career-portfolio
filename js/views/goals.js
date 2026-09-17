/* ============================================================
   views/goals.js — goals grouped by timeframe
   ============================================================ */
window.Views = window.Views || {};

Views.goals = function (root) {
  const fields = Schemas.goals.fields;

  function render() {
    root.innerHTML = '';
    root.appendChild(UI.sectionHeader({
      title: 'Future Goals', subtitle: '1-year, 3-year, 5-year and long-term goals — reviewed and updated over time.',
      actions: UI.isReadOnly() ? [] : [{ label: '+ Add Goal', onClick: () => openForm(null) }],
    }));

    const board = UI.el(`<div class="dash-grid"></div>`);
    root.appendChild(board);

    Consts.TIMEFRAME.forEach(tf => {
      const items = Store.listOf('goals').filter(g => g.timeframe === tf);
      const col = UI.el(`
        <div class="card g-6">
          <h3>${UI.esc(t(tf))} ${UI.esc(t('Goals'))} <span class="muted small">(${items.length})</span></h3>
          <div class="goal-list" style="margin-top:10px;display:flex;flex-direction:column;gap:10px;"></div>
        </div>`);
      board.appendChild(col);
      const list = UI.qs('.goal-list', col);
      if (!items.length) {
        list.appendChild(UI.el(`<p class="muted small">${UI.esc(t('No {tf} goals yet.').replace('{tf}', t(tf)))}</p>`));
      }
      items.forEach(g => list.appendChild(goalCard(g)));
    });
  }

  function goalCard(g) {
    const readonly = UI.isReadOnly();
    const card = UI.el(`
      <div class="item-card">
        <div class="item-card__head">
          <h4>${UI.esc(g.goal)}</h4>
          <div class="item-card__actions"></div>
        </div>
        <div class="item-card__body">
          <div class="item-card__row"><span class="item-card__label">${t('Status')}</span>${UI.badge(g.status || 'Not Started')}</div>
          <div class="item-card__row"><span class="item-card__label">${t('Priority')}</span>${UI.badge(g.priority || 'Medium', g.priority === 'High' ? 'red' : g.priority === 'Low' ? 'gray' : 'amber')}</div>
          <div class="item-card__row"><span class="item-card__label">${t('Deadline')}</span><span>${UI.fmtDate(g.deadline)}</span></div>
          <div class="progress-track" style="margin-top:4px;"><div class="progress-fill" style="width:${g.progress || 0}%"></div></div>
        </div>
      </div>`);
    if (!readonly) {
      const actionsHost = UI.qs('.item-card__actions', card);
      actionsHost.innerHTML = `<button class="icon-btn" data-act="edit">✏️</button><button class="icon-btn icon-btn--danger" data-act="del">🗑️</button>`;
      UI.qs('[data-act="edit"]', card).addEventListener('click', () => openForm(g));
      UI.qs('[data-act="del"]', card).addEventListener('click', async () => {
        const ok = await UI.confirmRemove(t('Goal'));
        if (ok) { Store.deleteItem('goals', g.id); render(); }
      });
    }
    return card;
  }

  function openForm(item) {
    UI.openFormModal({
      title: item ? 'Edit Goal' : 'Add Goal', wide: true, fields, values: item || {},
      onSubmit: (vals) => {
        if (item) Store.updateItem('goals', item.id, vals); else Store.addItem('goals', vals);
        render();
      },
    });
  }

  render();
};
