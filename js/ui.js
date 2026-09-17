/* ============================================================
   ui.js — small render helpers + generic CRUD engine
   No framework: plain DOM / template strings.
   Every user-facing label is passed through t() (see i18n.js)
   so the whole generic engine is bilingual for free.
   ============================================================ */

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function fmtDate(d) {
  if (!d) return '—';
  try {
    const date = new Date(d);
    if (isNaN(date)) return d;
    const locale = (typeof getLang === 'function' && getLang() === 'ar') ? 'ar-EG' : 'en-GB';
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return d; }
}
function tr(s) { return (typeof t === 'function') ? t(s) : s; }

/* ---------- read-only (visitor) mode ---------- */
let READONLY = false;
function setReadOnly(v) { READONLY = !!v; }
function isReadOnly() { return READONLY; }

/* ---------- toast ---------- */
function toast(msg, kind = 'default') {
  const host = qs('#toast-host');
  const node = el(`<div class="toast toast--${kind}">${esc(tr(msg))}</div>`);
  host.appendChild(node);
  requestAnimationFrame(() => node.classList.add('show'));
  setTimeout(() => {
    node.classList.remove('show');
    setTimeout(() => node.remove(), 250);
  }, 2600);
}

/* ---------- confirm ---------- */
function confirmDialog(message, { title = 'Please confirm', okLabel = 'Delete', danger = true } = {}) {
  return new Promise(resolve => {
    const overlay = el(`
      <div class="modal-overlay">
        <div class="modal modal--sm">
          <div class="modal__header"><h3>${esc(tr(title))}</h3></div>
          <div class="modal__body"><p>${esc(tr(message))}</p></div>
          <div class="modal__footer">
            <button class="btn btn--ghost" data-act="cancel">${esc(tr('Cancel'))}</button>
            <button class="btn ${danger ? 'btn--danger' : 'btn--primary'}" data-act="ok">${esc(tr(okLabel))}</button>
          </div>
        </div>
      </div>`);
    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.dataset.act === 'cancel') { overlay.remove(); resolve(false); }
      if (e.target.dataset.act === 'ok') { overlay.remove(); resolve(true); }
    });
    document.body.appendChild(overlay);
  });
}
function confirmRemove(nameOrLabel) {
  return confirmDialog(`${tr('Delete this')} ${tr(nameOrLabel)}? ${tr('This cannot be undone.')}`);
}

/* ---------- progress bar ---------- */
function progressBar(value, { label, editable = false, onChange } = {}) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const wrap = el(`
    <div class="progress-item">
      <div class="progress-item__head">
        <span class="progress-item__label">${esc(tr(label || ''))}</span>
        <span class="progress-item__value">${v}%</span>
      </div>
      <div class="progress-track" ${editable ? 'tabindex="0"' : ''}>
        <div class="progress-fill" style="width:${v}%"></div>
      </div>
      ${editable ? `<input type="range" min="0" max="100" value="${v}" class="progress-range" />` : ''}
    </div>`);
  if (editable && onChange) {
    const range = qs('.progress-range', wrap);
    const valueEl = qs('.progress-item__value', wrap);
    const fill = qs('.progress-fill', wrap);
    range.addEventListener('input', () => {
      fill.style.width = range.value + '%';
      valueEl.textContent = range.value + '%';
    });
    range.addEventListener('change', () => onChange(Number(range.value)));
  }
  return wrap;
}

/* ---------- badge ---------- */
const STATUS_COLORS = {
  'Not Started': 'gray', 'Learning': 'blue', 'Practiced': 'amber', 'Competent': 'green',
  'Idea': 'gray', 'Planning': 'blue', 'Data Collection': 'blue', 'Analysis': 'amber',
  'Writing': 'amber', 'Submitted': 'purple', 'Under Review': 'purple', 'Published': 'green',
  'Not Started ': 'gray', 'In Progress': 'blue', 'Completed': 'green',
  'Attendee': 'gray', 'Presenter': 'blue', 'Poster': 'purple',
};
function badge(text, colorOverride) {
  const color = colorOverride || STATUS_COLORS[text] || 'gray';
  return `<span class="badge badge--${color}">${esc(tr(text))}</span>`;
}

/* ---------- empty state ---------- */
function emptyState({ icon = '📄', title = 'Nothing here yet', desc = '', actionLabel, onAction }) {
  const wrap = el(`
    <div class="empty-state">
      <div class="empty-state__icon">${icon}</div>
      <h3>${esc(tr(title))}</h3>
      <p>${esc(tr(desc))}</p>
      ${actionLabel ? `<button class="btn btn--primary" data-act="empty-action">${esc(tr(actionLabel))}</button>` : ''}
    </div>`);
  if (actionLabel && onAction) qs('[data-act="empty-action"]', wrap).addEventListener('click', onAction);
  return wrap;
}

/* ---------- section header ---------- */
function sectionHeader({ title, subtitle, actions = [] }) {
  const wrap = el(`
    <div class="section-header">
      <div>
        <h1>${esc(tr(title))}</h1>
        ${subtitle ? `<p class="muted">${esc(tr(subtitle))}</p>` : ''}
      </div>
      <div class="section-header__actions"></div>
    </div>`);
  const actionsHost = qs('.section-header__actions', wrap);
  actions.forEach(a => {
    const btn = el(`<button class="btn ${a.className || 'btn--primary'}">${a.icon || ''} ${esc(tr(a.label))}</button>`);
    btn.addEventListener('click', a.onClick);
    actionsHost.appendChild(btn);
  });
  return wrap;
}

/* ---------- file field widget ---------- */
async function renderFileField(container, { fileId, onChange, accept = '.pdf,.png,.jpg,.jpeg,.webp' }) {
  container.innerHTML = '';
  const wrap = el(`<div class="file-field"></div>`);
  container.appendChild(wrap);
  async function refresh(id) {
    wrap.innerHTML = '';
    if (id) {
      const rec = await Store.getFile(id);
      const url = rec ? URL.createObjectURL(rec.blob) : '#';
      wrap.appendChild(el(`
        <div class="file-chip">
          <a href="${url}" target="_blank" rel="noopener">📎 ${esc(rec ? rec.name : 'file')}</a>
          <button type="button" class="icon-btn" data-act="remove-file" title="${esc(tr('Remove'))}">✕</button>
        </div>`));
      qs('[data-act="remove-file"]', wrap).addEventListener('click', () => { onChange(null); refresh(null); });
    } else {
      const input = el(`<input type="file" accept="${accept}" class="file-input" />`);
      wrap.appendChild(input);
      input.addEventListener('change', async () => {
        if (input.files[0]) {
          const id2 = await Store.saveFile(input.files[0]);
          onChange(id2);
          refresh(id2);
        }
      });
    }
  }
  await refresh(fileId);
}

/* ---------- generic form modal, driven by field schema ---------- */
/*
  field = { key, label, type, options?, required?, placeholder?, help?, rows?, full? }
  type: text | textarea | date | number | percent | select | checkbox | file | link | month
*/
function openFormModal({ title, fields, values = {}, onSubmit, wide = false }) {
  const overlay = el(`
    <div class="modal-overlay">
      <div class="modal ${wide ? 'modal--lg' : ''}">
        <div class="modal__header">
          <h3>${esc(tr(title))}</h3>
          <button class="icon-btn" data-act="close">✕</button>
        </div>
        <form class="modal__body form-grid"></form>
        <div class="modal__footer">
          <button class="btn btn--ghost" data-act="close">${esc(tr('Cancel'))}</button>
          <button class="btn btn--primary" data-act="save">${esc(tr('Save'))}</button>
        </div>
      </div>
    </div>`);
  const form = qs('form', overlay);
  const localValues = { ...values };
  const fileChanges = {};

  fields.forEach(f => {
    const fieldWrap = el(`<div class="form-field ${f.full ? 'form-field--full' : ''}"></div>`);
    const labelHtml = `<label>${esc(tr(f.label))}${f.required ? ' <span class="req">*</span>' : ''}</label>`;
    if (f.type === 'textarea') {
      fieldWrap.innerHTML = `${labelHtml}<textarea rows="${f.rows || 4}" placeholder="${esc(tr(f.placeholder || ''))}" data-key="${f.key}">${esc(localValues[f.key] || '')}</textarea>${f.help ? `<small>${esc(tr(f.help))}</small>` : ''}`;
    } else if (f.type === 'select') {
      const opts = (f.options || []).map(o => {
        const val = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        return `<option value="${esc(val)}" ${localValues[f.key] === val ? 'selected' : ''}>${esc(tr(label))}</option>`;
      }).join('');
      fieldWrap.innerHTML = `${labelHtml}<select data-key="${f.key}"><option value="">${esc(tr('— Select —'))}</option>${opts}</select>`;
    } else if (f.type === 'checkbox') {
      fieldWrap.innerHTML = `<label class="checkbox-label"><input type="checkbox" data-key="${f.key}" ${localValues[f.key] ? 'checked' : ''}/> ${esc(tr(f.label))}</label>`;
    } else if (f.type === 'percent') {
      fieldWrap.innerHTML = `${labelHtml}<input type="number" min="0" max="100" data-key="${f.key}" value="${esc(localValues[f.key] ?? 0)}" />`;
    } else if (f.type === 'file') {
      fieldWrap.innerHTML = `${labelHtml}<div class="file-field-host" data-key="${f.key}"></div>`;
    } else if (f.type === 'date' || f.type === 'month') {
      fieldWrap.innerHTML = `${labelHtml}<input type="${f.type}" data-key="${f.key}" value="${esc(localValues[f.key] || '')}" />`;
    } else if (f.type === 'number') {
      fieldWrap.innerHTML = `${labelHtml}<input type="number" data-key="${f.key}" value="${esc(localValues[f.key] ?? '')}" placeholder="${esc(tr(f.placeholder || ''))}"/>`;
    } else {
      fieldWrap.innerHTML = `${labelHtml}<input type="text" data-key="${f.key}" value="${esc(localValues[f.key] || '')}" placeholder="${esc(tr(f.placeholder || ''))}"/>${f.help ? `<small>${esc(tr(f.help))}</small>` : ''}`;
    }
    form.appendChild(fieldWrap);
    if (f.type === 'file') {
      const host = qs('.file-field-host', fieldWrap);
      renderFileField(host, {
        fileId: localValues[f.key] || null,
        onChange: (id) => { fileChanges[f.key] = id; },
      });
    }
  });

  function collect() {
    const out = { ...fileChanges };
    fields.forEach(f => {
      if (f.type === 'file') { if (!(f.key in out)) out[f.key] = localValues[f.key] || null; return; }
      const input = qs(`[data-key="${f.key}"]`, form);
      if (!input) return;
      if (f.type === 'checkbox') out[f.key] = input.checked;
      else if (f.type === 'percent' || f.type === 'number') out[f.key] = input.value === '' ? '' : Number(input.value);
      else out[f.key] = input.value;
    });
    return out;
  }

  function close() { overlay.remove(); }
  overlay.addEventListener('click', e => {
    if (e.target === overlay || e.target.closest('[data-act="close"]')) close();
  });
  qs('[data-act="save"]', overlay).addEventListener('click', e => {
    e.preventDefault();
    const required = fields.filter(f => f.required);
    const vals = collect();
    for (const f of required) {
      if (!vals[f.key] && vals[f.key] !== 0) { toast(`"${tr(f.label)}" ${tr('is required')}`, 'danger'); return; }
    }
    onSubmit(vals);
    close();
  });
  document.body.appendChild(overlay);
  return overlay;
}

/* ---------- generic CRUD section renderer ---------- */
/*
  config = {
    collection, title, subtitle, icon,
    fields: [...],               // used both for form + fallback column list
    columns: [{key,label,render(item)}],  // table columns, render optional
    searchKeys: [...],
    filters: [{key,label,options}],
    emptyIcon, emptyTitle, emptyDesc,
    newLabel, itemLabel: 'item',
    sort: (a,b)=>...
    onCardExtra(item) -> html string  (optional, for card layout)
    layout: 'table' | 'cards'
  }
*/
function renderCrudSection(container, config) {
  const {
    collection, title, subtitle, fields, columns, searchKeys = [], filters = [],
    emptyIcon = '📁', emptyTitle = 'No records yet', emptyDesc = 'Add your first entry to start tracking this area.',
    newLabel = '+ Add', itemLabel = 'item', layout = 'table', sort,
  } = config;

  let searchTerm = '';
  let activeFilters = {};

  function getFiltered() {
    let items = Store.listOf(collection).slice();
    if (sort) items.sort(sort); else items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      items = items.filter(item => searchKeys.some(k => String(item[k] || '').toLowerCase().includes(q)));
    }
    Object.entries(activeFilters).forEach(([k, v]) => {
      if (v) items = items.filter(item => item[k] === v);
    });
    return items;
  }

  function openForm(item) {
    openFormModal({
      title: item ? `${tr('Edit')} ${tr(itemLabel)}` : `${tr('Add')} ${tr(itemLabel)}`,
      fields,
      values: item || {},
      wide: true,
      onSubmit: (vals) => {
        if (item) { Store.updateItem(collection, item.id, vals); toast('Saved'); }
        else { Store.addItem(collection, vals); toast('Added'); }
        render();
      },
    });
  }

  async function removeItem(item) {
    const ok = await confirmRemove(itemLabel);
    if (!ok) return;
    if (item.evidenceFileId) await Store.deleteFile(item.evidenceFileId);
    Store.deleteItem(collection, item.id);
    toast('Deleted');
    render();
  }

  function render() {
    container.innerHTML = '';
    container.appendChild(sectionHeader({
      title, subtitle,
      actions: READONLY ? [] : [{ label: newLabel, onClick: () => openForm(null) }],
    }));

    const toolbar = el(`
      <div class="toolbar">
        <input type="search" class="search-input" placeholder="${esc(tr('Search'))} ${esc(tr(title))}..." value="${esc(searchTerm)}" />
        <div class="toolbar__filters"></div>
      </div>`);
    const filterHost = qs('.toolbar__filters', toolbar);
    filters.forEach(f => {
      const sel = el(`<select data-filter="${f.key}"><option value="">${esc(tr(f.label))}: ${esc(tr('All'))}</option>${f.options.map(o => `<option value="${esc(o)}" ${activeFilters[f.key] === o ? 'selected' : ''}>${esc(tr(o))}</option>`).join('')}</select>`);
      sel.addEventListener('change', () => { activeFilters[f.key] = sel.value; render(); });
      filterHost.appendChild(sel);
    });
    qs('.search-input', toolbar).addEventListener('input', (e) => { searchTerm = e.target.value; renderList(); });
    container.appendChild(toolbar);

    const listHost = el(`<div class="crud-list"></div>`);
    container.appendChild(listHost);
    renderList();

    function renderList() {
      const items = getFiltered();
      listHost.innerHTML = '';
      if (items.length === 0) {
        listHost.appendChild(emptyState({
          icon: emptyIcon, title: Store.listOf(collection).length ? 'No matches' : emptyTitle,
          desc: Store.listOf(collection).length ? 'Try a different search or filter.' : emptyDesc,
          actionLabel: (READONLY || Store.listOf(collection).length) ? null : newLabel,
          onAction: () => openForm(null),
        }));
        return;
      }
      if (layout === 'cards') {
        const grid = el(`<div class="card-grid"></div>`);
        items.forEach(item => grid.appendChild(renderItemCard(item, columns, config, openForm, removeItem)));
        listHost.appendChild(grid);
      } else {
        listHost.appendChild(renderItemTable(items, columns, openForm, removeItem));
      }
    }
  }

  render();
  return { render };
}

function renderItemTable(items, columns, openForm, removeItem) {
  const table = el(`
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr>${columns.map(c => `<th>${esc(tr(c.label))}</th>`).join('')}${READONLY ? '' : `<th class="col-actions">${esc(tr('Actions'))}</th>`}</tr></thead>
        <tbody></tbody>
      </table>
    </div>`);
  const tbody = qs('tbody', table);
  items.forEach(item => {
    const tr_ = el(`<tr></tr>`);
    columns.forEach(c => {
      const td = document.createElement('td');
      td.innerHTML = c.render ? c.render(item) : esc(item[c.key] ?? '—');
      tr_.appendChild(td);
    });
    if (!READONLY) {
      const actionsTd = el(`
        <td class="col-actions">
          <button class="icon-btn" data-act="edit" title="${esc(tr('Edit'))}">✏️</button>
          <button class="icon-btn icon-btn--danger" data-act="del" title="${esc(tr('Delete'))}">🗑️</button>
        </td>`);
      qs('[data-act="edit"]', actionsTd).addEventListener('click', () => openForm(item));
      qs('[data-act="del"]', actionsTd).addEventListener('click', () => removeItem(item));
      tr_.appendChild(actionsTd);
    }
    tbody.appendChild(tr_);
  });
  return table;
}

function renderItemCard(item, columns, config, openForm, removeItem) {
  const primary = columns[0] ? (columns[0].render ? columns[0].render(item) : esc(item[columns[0].key])) : '';
  const rest = columns.slice(1);
  const card = el(`
    <div class="item-card">
      <div class="item-card__head">
        <h4>${primary}</h4>
        <div class="item-card__actions"></div>
      </div>
      <div class="item-card__body">
        ${rest.map(c => `<div class="item-card__row"><span class="item-card__label">${esc(tr(c.label))}</span><span>${c.render ? c.render(item) : esc(item[c.key] ?? '—')}</span></div>`).join('')}
      </div>
    </div>`);
  if (!READONLY) {
    const actionsHost = qs('.item-card__actions', card);
    actionsHost.innerHTML = `
      <button class="icon-btn" data-act="edit" title="${esc(tr('Edit'))}">✏️</button>
      <button class="icon-btn icon-btn--danger" data-act="del" title="${esc(tr('Delete'))}">🗑️</button>`;
    qs('[data-act="edit"]', card).addEventListener('click', () => openForm(item));
    qs('[data-act="del"]', card).addEventListener('click', () => removeItem(item));
  }
  return card;
}

/* ---------- simple status checklist renderer (fundamentals/disorders/skills lists) ---------- */
function renderStatusChecklist(container, { collection, title, subtitle, statusOptions, allowAdd = true, newLabel = '+ Add Topic' }) {
  function render() {
    container.innerHTML = '';
    container.appendChild(sectionHeader({
      title, subtitle,
      actions: (allowAdd && !READONLY) ? [{ label: newLabel, onClick: addNew }] : [],
    }));
    const items = Store.listOf(collection);
    const grid = el(`<div class="checklist-grid"></div>`);
    items.forEach(item => {
      const controlsHtml = READONLY
        ? `<div class="checklist-row__controls">${badge(item.status || 'Not Started')}</div>`
        : `
          <div class="checklist-row__controls">
            <select data-key="status">${statusOptions.map(s => `<option value="${esc(s)}" ${item.status === s ? 'selected' : ''}>${esc(tr(s))}</option>`).join('')}</select>
            <button class="icon-btn" data-act="edit" title="${esc(tr('Notes'))}">📝</button>
            <button class="icon-btn icon-btn--danger" data-act="del" title="${esc(tr('Remove'))}">🗑️</button>
          </div>`;
      const row = el(`
        <div class="checklist-row">
          <div class="checklist-row__main">
            <strong>${esc(tr(item.name))}</strong>
            ${item.notes ? `<p class="muted small">${esc(item.notes)}</p>` : ''}
          </div>
          ${controlsHtml}
        </div>`);
      if (!READONLY) {
        qs('[data-key="status"]', row).addEventListener('change', (e) => {
          Store.updateItem(collection, item.id, { status: e.target.value });
          render();
        });
        qs('[data-act="edit"]', row).addEventListener('click', () => {
          openFormModal({
            title: `${tr('Edit')} — ${tr(item.name)}`,
            fields: [
              { key: 'date', label: 'Date studied', type: 'date' },
              { key: 'notes', label: 'Notes / key points', type: 'textarea', rows: 5, full: true },
            ],
            values: item,
            onSubmit: (vals) => { Store.updateItem(collection, item.id, vals); render(); },
          });
        });
        qs('[data-act="del"]', row).addEventListener('click', async () => {
          const ok = await confirmDialog(`${tr('Remove')} "${tr(item.name)}"?`);
          if (ok) { Store.deleteItem(collection, item.id); render(); }
        });
      }
      grid.appendChild(row);
    });
    container.appendChild(grid);
  }
  function addNew() {
    openFormModal({
      title: 'Add Topic',
      fields: [{ key: 'name', label: 'Topic name', type: 'text', required: true }],
      onSubmit: (vals) => { Store.addItem(collection, { ...vals, status: 'Not Started', notes: '', date: '' }); render(); },
    });
  }
  render();
}

window.UI = {
  el, qs, qsa, esc, fmtDate, toast, confirmDialog, confirmRemove, progressBar, badge, emptyState,
  sectionHeader, renderFileField, openFormModal, renderCrudSection, renderStatusChecklist,
  setReadOnly, isReadOnly,
  STATUS_COLORS,
};
