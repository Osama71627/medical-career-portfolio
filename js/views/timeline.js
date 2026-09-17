/* ============================================================
   views/timeline.js — dynamic timeline built from dated records
   ============================================================ */
window.Views = window.Views || {};

Views.timeline = function (root) {
  render();

  function render() {
    root.innerHTML = '';
    const readonly = UI.isReadOnly();
    root.appendChild(UI.sectionHeader({
      title: 'Timeline', subtitle: 'Automatically compiled from every dated record in your portfolio.',
      actions: readonly ? [] : [{ label: '+ Add Milestone', onClick: addMilestone }],
    }));

    const events = collectEvents();
    if (!events.length) {
      root.appendChild(UI.emptyState({
        icon: '🕘', title: 'No dated records yet',
        desc: 'As you add academic items, research, publications, courses and more with dates, they will appear here automatically.',
        actionLabel: readonly ? null : '+ Add Milestone', onAction: addMilestone,
      }));
      return;
    }

    const timeline = UI.el(`<div class="timeline"></div>`);
    events.forEach(ev => {
      timeline.appendChild(UI.el(`
        <div class="timeline-item">
          <div class="timeline-item__date">${UI.fmtDate(ev.date)} · ${UI.esc(t(ev.category))}</div>
          <div class="timeline-item__title">${UI.esc(ev.title)}</div>
          ${ev.desc ? `<div class="timeline-item__desc">${UI.esc(ev.desc)}</div>` : ''}
        </div>`));
    });
    root.appendChild(timeline);
  }

  function collectEvents() {
    const d = Store.getData();
    const events = [];
    const push = (date, category, title, desc) => { if (date) events.push({ date, category, title, desc }); };

    d.academicItems.forEach(i => push(i.date, 'Academic', i.title, i.type));
    d.researchProjects.forEach(r => push(r.startDate, 'Research', r.projectTitle, r.status));
    d.publications.forEach(p => push(p.publicationDate, 'Publication', p.title, p.journal));
    d.conferences.forEach(c => push(c.date, 'Conference', c.conferenceName, c.presentationTitle));
    d.courses.forEach(c => push(c.completionDate, 'Course', c.courseName, c.provider));
    d.volunteering.forEach(v => push(v.startDate, 'Volunteering', `${v.role || 'Volunteer'} — ${v.organization}`, v.project));
    d.leadership.forEach(l => push(l.startDate, 'Leadership', `${l.position} — ${l.organization}`, l.project));
    d.achievements.forEach(a => push(a.date, 'Achievement', a.title, a.category));
    d.milestones.forEach(m => push(m.date, 'Milestone', m.title, m.description));

    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    return events.filter(e => e.date && !isNaN(new Date(e.date)));
  }

  function addMilestone() {
    UI.openFormModal({
      title: 'Add Milestone', wide: true,
      fields: Schemas.milestones.fields,
      onSubmit: (vals) => { Store.addItem('milestones', vals); render(); },
    });
  }
};
