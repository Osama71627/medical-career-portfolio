/* ============================================================
   views/search.js — global search & filter across the portfolio
   ============================================================ */
window.Views = window.Views || {};

const SEARCH_SOURCES = [
  { collection: 'academicItems', route: 'academic', icon: '🎓', type: 'Academic', titleKey: 'title', descKey: 'description', dateKey: 'date' },
  { collection: 'clinicalCases', route: 'clinical-cases', icon: '🧠', type: 'Psychiatry Topic', titleKey: 'topic', descKey: 'whatLearned', dateKey: 'dateStudied' },
  { collection: 'clinicalSkills', route: 'clinical-skills', icon: '🩺', type: 'Clinical Skill', titleKey: 'skill', descKey: 'notes', dateKey: 'date' },
  { collection: 'researchProjects', route: 'research-projects', icon: '🔬', type: 'Research Project', titleKey: 'projectTitle', descKey: 'researchQuestion', dateKey: 'startDate' },
  { collection: 'publications', route: 'publications', icon: '📄', type: 'Publication', titleKey: 'title', descKey: 'journal', dateKey: 'publicationDate' },
  { collection: 'conferences', route: 'conferences', icon: '🎤', type: 'Conference', titleKey: 'conferenceName', descKey: 'presentationTitle', dateKey: 'date' },
  { collection: 'courses', route: 'courses', icon: '📚', type: 'Course', titleKey: 'courseName', descKey: 'provider', dateKey: 'completionDate' },
  { collection: 'volunteering', route: 'volunteering', icon: '🤝', type: 'Volunteering', titleKey: 'organization', descKey: 'role', dateKey: 'startDate' },
  { collection: 'leadership', route: 'leadership', icon: '🧭', type: 'Leadership', titleKey: 'position', descKey: 'organization', dateKey: 'startDate' },
  { collection: 'books', route: 'books', icon: '📖', type: 'Book', titleKey: 'title', descKey: 'author', dateKey: 'finishDate' },
  { collection: 'mentors', route: 'mentors', icon: '🧑‍🏫', type: 'Mentor', titleKey: 'name', descKey: 'specialty', dateKey: null },
  { collection: 'achievements', route: 'achievements', icon: '🏆', type: 'Achievement', titleKey: 'title', descKey: 'description', dateKey: 'date' },
  { collection: 'goals', route: 'goals', icon: '🎯', type: 'Goal', titleKey: 'goal', descKey: 'notes', dateKey: 'deadline' },
  { collection: 'monthlyLogs', route: 'monthly-log', icon: '🗓️', type: 'Monthly Log', titleKey: 'month', descKey: 'whatStudied', dateKey: 'month' },
  { collection: 'evidenceImpact', route: 'evidence-impact', icon: '🌍', type: 'Impact Record', titleKey: 'activity', descKey: 'outcome', dateKey: null },
  { collection: 'psychiatryFundamentals', route: 'psychiatry-fundamentals', icon: '🧠', type: 'Psychiatry Fundamental', titleKey: 'name', descKey: 'notes', dateKey: null },
  { collection: 'psychiatryDisorders', route: 'psychiatry-disorders', icon: '🧩', type: 'Disorder', titleKey: 'name', descKey: 'notes', dateKey: null },
  { collection: 'psychopharm', route: 'psychopharm', icon: '💊', type: 'Psychopharmacology', titleKey: 'name', descKey: 'notes', dateKey: null },
];

Views.search = function (root) {
  let term = '';
  let typeFilter = '';
  let yearFilter = '';

  root.appendChild(UI.sectionHeader({ title: 'Search & Filter', subtitle: 'Search across every section of your portfolio at once.' }));

  const toolbar = UI.el(`
    <div class="toolbar">
      <input type="search" class="search-input" id="search-page-input" placeholder="${t('Search everything (e.g. Psychiatry, PubMed, Depression)...')}" />
      <div class="toolbar__filters">
        <select id="filter-type"><option value="">${t('All Types')}</option>${[...new Set(SEARCH_SOURCES.map(s => s.type))].map(ty => `<option value="${ty}">${t(ty)}</option>`).join('')}</select>
        <select id="filter-year"><option value="">${t('All Years')}</option></select>
      </div>
    </div>`);
  root.appendChild(toolbar);
  const resultsHost = UI.el(`<div></div>`);
  root.appendChild(resultsHost);

  populateYears();

  UI.qs('#search-page-input', toolbar).addEventListener('input', (e) => { term = e.target.value; renderResults(); });
  UI.qs('#filter-type', toolbar).addEventListener('change', (e) => { typeFilter = e.target.value; renderResults(); });
  UI.qs('#filter-year', toolbar).addEventListener('change', (e) => { yearFilter = e.target.value; renderResults(); });

  window.addEventListener('global-search', (e) => {
    term = e.detail;
    UI.qs('#search-page-input', toolbar).value = term;
    renderResults();
  });

  renderResults();

  function populateYears() {
    const years = new Set();
    SEARCH_SOURCES.forEach(src => {
      if (!src.dateKey) return;
      Store.listOf(src.collection).forEach(item => {
        const val = item[src.dateKey];
        if (val) {
          const y = String(val).slice(0, 4);
          if (/^\d{4}$/.test(y)) years.add(y);
        }
      });
    });
    const sel = UI.qs('#filter-year', toolbar);
    Array.from(years).sort().reverse().forEach(y => sel.appendChild(UI.el(`<option value="${y}">${y}</option>`)));
  }

  function renderResults() {
    resultsHost.innerHTML = '';
    if (!term && !typeFilter && !yearFilter) {
      resultsHost.appendChild(UI.emptyState({ icon: '🔍', title: 'Start typing to search', desc: 'Search titles, notes and descriptions across every section — courses, research, books, skills, conferences and more.' }));
      return;
    }
    const q = term.toLowerCase();
    let results = [];
    SEARCH_SOURCES.forEach(src => {
      if (typeFilter && typeFilter !== src.type) return;
      Store.listOf(src.collection).forEach(item => {
        const title = String(item[src.titleKey] || '');
        const desc = String(item[src.descKey] || '');
        if (q && !(title.toLowerCase().includes(q) || desc.toLowerCase().includes(q))) return;
        if (yearFilter && src.dateKey && String(item[src.dateKey] || '').slice(0, 4) !== yearFilter) return;
        if (yearFilter && !src.dateKey) return;
        results.push({ ...src, item, title, desc });
      });
    });

    if (!results.length) {
      resultsHost.appendChild(UI.emptyState({ icon: '🤷', title: 'No matches found', desc: 'Try a different keyword or clear your filters.' }));
      return;
    }

    const list = UI.el(`<div class="card-grid"></div>`);
    results.forEach(r => {
      const card = UI.el(`
        <div class="item-card" style="cursor:pointer;">
          <div class="item-card__head"><h4>${r.icon} ${UI.esc(r.title || '(untitled)')}</h4></div>
          <div class="item-card__body">
            <div class="item-card__row"><span class="item-card__label">${t('Type')}</span>${UI.badge(r.type, 'blue')}</div>
            ${r.desc ? `<p class="muted small">${UI.esc(r.desc.slice(0, 100))}</p>` : ''}
          </div>
        </div>`);
      card.addEventListener('click', () => { location.hash = '#/' + r.route; });
      list.appendChild(card);
    });
    resultsHost.appendChild(UI.el(`<p class="muted small" style="margin-bottom:10px;">${results.length} ${t(results.length === 1 ? 'result' : 'results')}</p>`));
    resultsHost.appendChild(list);
  }
};
