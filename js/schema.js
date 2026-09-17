/* ============================================================
   schema.js — field/column configs for every CRUD collection
   ============================================================ */

const SKILL_STATUS = ['Not Started', 'Learning', 'Practiced', 'Competent'];
const PROJECT_STATUS = ['Idea', 'Planning', 'Data Collection', 'Analysis', 'Writing', 'Submitted', 'Under Review', 'Published'];
const PUB_STATUS = ['Manuscript', 'Submitted', 'Under Review', 'Accepted', 'Published'];
const GOAL_STATUS = ['Not Started', 'In Progress', 'Completed'];
const PRIORITY = ['Low', 'Medium', 'High'];
const TIMEFRAME = ['1-Year', '3-Year', '5-Year', 'Long-Term'];
const COURSE_CATEGORIES = ['Psychiatry', 'Medicine', 'Research', 'Statistics', 'English', 'Leadership', 'Communication', 'Other'];
const BOOK_CATEGORIES = ['Psychiatry', 'Medicine', 'Psychology', 'Research', 'General Knowledge'];
const ACHIEVEMENT_CATEGORIES = ['Academic', 'Research', 'Scholarship', 'Competition', 'Recognition', 'Other'];
const ACADEMIC_TYPES = ['Award', 'Achievement', 'Exam', 'Certificate'];
const CONF_ROLE = ['Attendee', 'Presenter', 'Poster'];
const YES_NO_FILE = { key: 'evidenceFileId', label: 'Evidence / Certificate', type: 'file' };

const Schemas = {
  academicItems: {
    collection: 'academicItems', title: 'Academic Achievements', subtitle: 'Awards, honors, exams and certificates from your academic record.',
    itemLabel: 'academic item', newLabel: '+ Add Item', layout: 'cards', emptyIcon: '🎓',
    emptyTitle: 'No academic items yet', emptyDesc: 'Log awards, exams and certificates as you earn them.',
    searchKeys: ['title', 'description'],
    filters: [{ key: 'type', label: 'Type', options: ACADEMIC_TYPES }],
    fields: [
      { key: 'type', label: 'Type', type: 'select', options: ACADEMIC_TYPES, required: true },
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
      { key: 'link', label: 'Link', type: 'text' },
      YES_NO_FILE,
    ],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type', render: i => UI.badge(i.type) },
      { key: 'date', label: 'Date', render: i => UI.fmtDate(i.date) },
    ],
  },

  clinicalCases: {
    collection: 'clinicalCases', title: 'Psychiatry Topics & Clinical Cases', subtitle: 'Track what you study — from fundamentals to real cases.',
    itemLabel: 'topic / case', newLabel: '+ Add Topic', layout: 'cards', emptyIcon: '🧠',
    emptyTitle: 'No topics logged yet', emptyDesc: 'Record what you study in psychiatry, with resources and clinical application.',
    searchKeys: ['topic', 'whatLearned', 'resources'],
    filters: [{ key: 'completionStatus', label: 'Status', options: SKILL_STATUS }],
    fields: [
      { key: 'topic', label: 'Topic', type: 'text', required: true, full: true },
      { key: 'dateStudied', label: 'Date studied', type: 'date' },
      { key: 'completionStatus', label: 'Completion status', type: 'select', options: SKILL_STATUS },
      { key: 'resources', label: 'Resources', type: 'text', full: true },
      { key: 'whatLearned', label: 'What I learned', type: 'textarea', full: true },
      { key: 'importantPoints', label: 'Important points', type: 'textarea', full: true },
      { key: 'clinicalApplication', label: 'Clinical application', type: 'textarea', full: true },
      { key: 'personalNotes', label: 'Personal notes', type: 'textarea', full: true },
    ],
    columns: [
      { key: 'topic', label: 'Topic' },
      { key: 'completionStatus', label: 'Status', render: i => UI.badge(i.completionStatus || 'Not Started') },
      { key: 'dateStudied', label: 'Date', render: i => UI.fmtDate(i.dateStudied) },
    ],
  },

  psychotherapy: {
    collection: 'psychotherapy', title: 'Psychotherapy', subtitle: 'Therapeutic modalities studied or practiced.',
    itemLabel: 'modality', newLabel: '+ Add Modality', layout: 'table', emptyIcon: '🗣️',
    emptyTitle: 'No modalities yet', emptyDesc: 'Add CBT, psychodynamic therapy, DBT, supportive therapy, etc.',
    searchKeys: ['modality', 'notes'],
    fields: [
      { key: 'modality', label: 'Modality', type: 'text', required: true },
      { key: 'status', label: 'Status', type: 'select', options: SKILL_STATUS },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
    columns: [
      { key: 'modality', label: 'Modality' },
      { key: 'status', label: 'Status', render: i => UI.badge(i.status || 'Not Started') },
      { key: 'date', label: 'Date', render: i => UI.fmtDate(i.date) },
    ],
  },

  psychopharm: {
    collection: 'psychopharm', title: 'Psychopharmacology', subtitle: 'Track what you have studied by drug category.',
    itemLabel: 'topic', newLabel: '+ Add Topic', layout: 'table', emptyIcon: '💊',
    emptyTitle: 'No topics yet', emptyDesc: 'Add a category (e.g. Antidepressants) and track your progress.',
    searchKeys: ['name', 'notes'],
    fields: [
      { key: 'name', label: 'Category / Drug', type: 'text', required: true },
      { key: 'status', label: 'Status', type: 'select', options: SKILL_STATUS },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
    columns: [
      { key: 'name', label: 'Category / Drug' },
      { key: 'status', label: 'Status', render: i => UI.badge(i.status || 'Not Started') },
      { key: 'date', label: 'Date', render: i => UI.fmtDate(i.date) },
    ],
  },

  researchProjects: {
    collection: 'researchProjects', title: 'Research Projects', subtitle: 'Every project from idea to publication.',
    itemLabel: 'research project', newLabel: '+ Add Project', layout: 'cards', emptyIcon: '🔬',
    emptyTitle: 'No research projects yet', emptyDesc: 'Add your first project — you can update its status as it progresses.',
    searchKeys: ['projectTitle', 'researchQuestion', 'researchField'],
    filters: [{ key: 'status', label: 'Status', options: PROJECT_STATUS }],
    fields: [
      { key: 'projectTitle', label: 'Project Title', type: 'text', required: true, full: true },
      { key: 'researchQuestion', label: 'Research Question', type: 'textarea', full: true },
      { key: 'status', label: 'Current Status', type: 'select', options: PROJECT_STATUS, required: true },
      { key: 'supervisor', label: 'Supervisor', type: 'text' },
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'studyDesign', label: 'Study Design', type: 'text' },
      { key: 'researchField', label: 'Research Field', type: 'text' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'myRole', label: 'My Role', type: 'text' },
      { key: 'responsibilities', label: 'Responsibilities', type: 'textarea', full: true },
      { key: 'skillsLearned', label: 'Skills Learned', type: 'textarea', full: true },
      { key: 'dataset', label: 'Dataset', type: 'text' },
      { key: 'analysis', label: 'Analysis', type: 'text' },
      { key: 'manuscript', label: 'Manuscript', type: 'text' },
      { key: 'journal', label: 'Journal', type: 'text' },
      { key: 'submissionDate', label: 'Submission Date', type: 'date' },
      { key: 'publicationStatus', label: 'Publication Status', type: 'text' },
      { key: 'doi', label: 'DOI', type: 'text' },
      { key: 'link', label: 'Link', type: 'text' },
      { key: 'abstract', label: 'Abstract', type: 'textarea', full: true },
      { key: 'pdfFileId', label: 'PDF', type: 'file' },
    ],
    columns: [
      { key: 'projectTitle', label: 'Project' },
      { key: 'status', label: 'Status', render: i => UI.badge(i.status) },
      { key: 'researchField', label: 'Field' },
      { key: 'startDate', label: 'Start', render: i => UI.fmtDate(i.startDate) },
    ],
  },

  publications: {
    collection: 'publications', title: 'Publications', subtitle: 'Peer-reviewed and published research output.',
    itemLabel: 'publication', newLabel: '+ Add Publication', layout: 'cards', emptyIcon: '📄',
    emptyTitle: 'No publications yet', emptyDesc: 'Your published research will appear here — and count automatically on the dashboard.',
    searchKeys: ['title', 'journal', 'authors'],
    filters: [{ key: 'researchField', label: 'Field', options: [] }],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'authors', label: 'Authors', type: 'text', full: true },
      { key: 'journal', label: 'Journal', type: 'text' },
      { key: 'publicationDate', label: 'Publication Date', type: 'date' },
      { key: 'researchField', label: 'Research Field', type: 'text' },
      { key: 'myContribution', label: 'My Contribution', type: 'textarea', full: true },
      { key: 'doi', label: 'DOI', type: 'text' },
      { key: 'pubmedLink', label: 'PubMed Link', type: 'text' },
      { key: 'journalLink', label: 'Journal Link', type: 'text' },
      { key: 'abstract', label: 'Abstract', type: 'textarea', full: true },
      { key: 'pdfFileId', label: 'PDF', type: 'file' },
    ],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'journal', label: 'Journal' },
      { key: 'publicationDate', label: 'Date', render: i => UI.fmtDate(i.publicationDate) },
    ],
  },

  conferences: {
    collection: 'conferences', title: 'Conferences & Presentations', subtitle: 'Attendance, posters and talks.',
    itemLabel: 'conference', newLabel: '+ Add Conference', layout: 'cards', emptyIcon: '🎤',
    emptyTitle: 'No conferences yet', emptyDesc: 'Add conferences you attended or presented at.',
    searchKeys: ['conferenceName', 'presentationTitle', 'location'],
    filters: [{ key: 'role', label: 'Role', options: CONF_ROLE }],
    fields: [
      { key: 'conferenceName', label: 'Conference Name', type: 'text', required: true, full: true },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'role', label: 'Role', type: 'select', options: CONF_ROLE },
      { key: 'presentationTitle', label: 'Presentation Title', type: 'text', full: true },
      { key: 'abstract', label: 'Abstract', type: 'textarea', full: true },
      { key: 'whatLearned', label: 'What I Learned', type: 'textarea', full: true },
      { key: 'certificateFileId', label: 'Certificate', type: 'file' },
      { key: 'posterFileId', label: 'Poster / Slides', type: 'file' },
    ],
    columns: [
      { key: 'conferenceName', label: 'Conference' },
      { key: 'role', label: 'Role', render: i => UI.badge(i.role || 'Attendee') },
      { key: 'date', label: 'Date', render: i => UI.fmtDate(i.date) },
    ],
  },

  courses: {
    collection: 'courses', title: 'Courses & Certifications', subtitle: 'Structured learning outside the medical curriculum.',
    itemLabel: 'course', newLabel: '+ Add Course', layout: 'cards', emptyIcon: '📚',
    emptyTitle: 'No courses yet', emptyDesc: 'Log courses, workshops and certifications as you complete them.',
    searchKeys: ['courseName', 'provider', 'skillsLearned'],
    filters: [{ key: 'category', label: 'Category', options: COURSE_CATEGORIES }],
    fields: [
      { key: 'courseName', label: 'Course Name', type: 'text', required: true, full: true },
      { key: 'provider', label: 'Provider', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: COURSE_CATEGORIES },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'completionDate', label: 'Completion Date', type: 'date' },
      { key: 'duration', label: 'Duration', type: 'text' },
      { key: 'skillsLearned', label: 'Skills Learned', type: 'textarea', full: true },
      { key: 'relevance', label: 'Relevance to Career', type: 'textarea', full: true },
      { key: 'link', label: 'Link', type: 'text' },
      { key: 'certificateFileId', label: 'Certificate', type: 'file' },
    ],
    columns: [
      { key: 'courseName', label: 'Course' },
      { key: 'category', label: 'Category', render: i => UI.badge(i.category || 'Other') },
      { key: 'completionDate', label: 'Completed', render: i => UI.fmtDate(i.completionDate) },
    ],
  },

  volunteering: {
    collection: 'volunteering', title: 'Volunteering', subtitle: 'Community impact — not just certificates.',
    itemLabel: 'activity', newLabel: '+ Add Activity', layout: 'cards', emptyIcon: '🤝',
    emptyTitle: 'No volunteering activities yet', emptyDesc: 'Document the organizations, roles and real impact of your volunteer work.',
    searchKeys: ['organization', 'project', 'role'],
    fields: [
      { key: 'organization', label: 'Organization', type: 'text', required: true },
      { key: 'project', label: 'Project', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'duration', label: 'Duration', type: 'text' },
      { key: 'responsibilities', label: 'Responsibilities', type: 'textarea', full: true },
      { key: 'skills', label: 'Skills', type: 'text', full: true },
      { key: 'impact', label: 'Impact', type: 'textarea', full: true },
      { key: 'peopleReached', label: 'People Reached', type: 'number' },
      { key: 'certificateFileId', label: 'Certificate', type: 'file' },
    ],
    columns: [
      { key: 'organization', label: 'Organization' },
      { key: 'role', label: 'Role' },
      { key: 'peopleReached', label: 'Impact', render: i => i.peopleReached ? `${i.peopleReached} reached` : '—' },
    ],
  },

  leadership: {
    collection: 'leadership', title: 'Leadership', subtitle: 'Roles where you led teams or initiatives.',
    itemLabel: 'leadership role', newLabel: '+ Add Role', layout: 'cards', emptyIcon: '🧭',
    emptyTitle: 'No leadership experience yet', emptyDesc: 'Document team roles, problems solved and outcomes achieved.',
    searchKeys: ['organization', 'position', 'project'],
    fields: [
      { key: 'organization', label: 'Organization', type: 'text', required: true },
      { key: 'position', label: 'Position', type: 'text', required: true },
      { key: 'project', label: 'Project', type: 'text' },
      { key: 'teamSize', label: 'Team Size', type: 'number' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'responsibilities', label: 'Responsibilities', type: 'textarea', full: true },
      { key: 'problem', label: 'Problem', type: 'textarea', full: true },
      { key: 'whatIDid', label: 'What I Did', type: 'textarea', full: true },
      { key: 'outcome', label: 'Outcome', type: 'textarea', full: true },
      { key: 'skillsLearned', label: 'Skills Learned', type: 'text', full: true },
      { key: 'evidenceFileId', label: 'Evidence', type: 'file' },
    ],
    columns: [
      { key: 'position', label: 'Position' },
      { key: 'organization', label: 'Organization' },
      { key: 'startDate', label: 'Start', render: i => UI.fmtDate(i.startDate) },
    ],
  },

  books: {
    collection: 'books', title: 'Books & Articles', subtitle: 'A learning log, not just a reading list.',
    itemLabel: 'book / article', newLabel: '+ Add Book', layout: 'cards', emptyIcon: '📖',
    emptyTitle: 'No books logged yet', emptyDesc: 'Capture key ideas and how you can apply them — not just titles.',
    searchKeys: ['title', 'author', 'keyIdeas'],
    filters: [{ key: 'category', label: 'Category', options: BOOK_CATEGORIES }],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'author', label: 'Author', type: 'text' },
      { key: 'category', label: 'Category', type: 'select', options: BOOK_CATEGORIES },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'finishDate', label: 'Finish Date', type: 'date' },
      { key: 'rating', label: 'Rating (1-5)', type: 'number' },
      { key: 'keyIdeas', label: 'Key Ideas', type: 'textarea', full: true },
      { key: 'whatLearned', label: 'What I Learned', type: 'textarea', full: true },
      { key: 'howToApply', label: 'How I Can Apply It', type: 'textarea', full: true },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category', render: i => UI.badge(i.category || 'General Knowledge') },
      { key: 'rating', label: 'Rating', render: i => i.rating ? '★'.repeat(i.rating) : '—' },
    ],
  },

  mentors: {
    collection: 'mentors', title: 'Mentors & Academic Network', subtitle: 'Professors and supervisors who shaped your journey.',
    itemLabel: 'mentor', newLabel: '+ Add Mentor', layout: 'cards', emptyIcon: '🧑‍🏫',
    emptyTitle: 'No mentors added yet', emptyDesc: 'Keep track of the people guiding your academic path.',
    searchKeys: ['name', 'specialty', 'institution'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'specialty', label: 'Specialty', type: 'text' },
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'howWeWorked', label: 'How We Worked Together', type: 'textarea', full: true },
      { key: 'projects', label: 'Research Projects', type: 'text', full: true },
      { key: 'dates', label: 'Dates', type: 'text' },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'specialty', label: 'Specialty' },
      { key: 'institution', label: 'Institution' },
    ],
  },

  recommendations: {
    collection: 'recommendations', title: 'Recommendation Letters', subtitle: 'Track who can vouch for you, and where the letters are.',
    itemLabel: 'recommendation', newLabel: '+ Add Recommendation', layout: 'table', emptyIcon: '✉️',
    emptyTitle: 'No recommendation letters yet', emptyDesc: 'Log professors who have written or could write letters for you.',
    searchKeys: ['professor', 'institution'],
    fields: [
      { key: 'professor', label: 'Professor', type: 'text', required: true },
      { key: 'institution', label: 'Institution', type: 'text' },
      { key: 'relationship', label: 'Relationship', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'type', label: 'Type of Recommendation', type: 'text' },
      { key: 'fileId', label: 'PDF', type: 'file' },
    ],
    columns: [
      { key: 'professor', label: 'Professor' },
      { key: 'institution', label: 'Institution' },
      { key: 'date', label: 'Date', render: i => UI.fmtDate(i.date) },
    ],
  },

  achievements: {
    collection: 'achievements', title: 'Achievements & Awards', subtitle: 'Academic, research and other recognitions.',
    itemLabel: 'achievement', newLabel: '+ Add Achievement', layout: 'cards', emptyIcon: '🏆',
    emptyTitle: 'No achievements yet', emptyDesc: 'Awards, scholarships and competitions will appear here.',
    searchKeys: ['title', 'description'],
    filters: [{ key: 'category', label: 'Category', options: ACHIEVEMENT_CATEGORIES }],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true, full: true },
      { key: 'category', label: 'Category', type: 'select', options: ACHIEVEMENT_CATEGORIES },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
      { key: 'evidenceFileId', label: 'Evidence', type: 'file' },
    ],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'category', label: 'Category', render: i => UI.badge(i.category || 'Other') },
      { key: 'date', label: 'Date', render: i => UI.fmtDate(i.date) },
    ],
  },

  goals: {
    collection: 'goals', title: 'Future Goals', subtitle: '1-year, 3-year, 5-year and long-term goals.',
    itemLabel: 'goal', newLabel: '+ Add Goal', layout: 'cards', emptyIcon: '🎯',
    emptyTitle: 'No goals set yet', emptyDesc: 'Define what you want to achieve and by when.',
    searchKeys: ['goal', 'notes'],
    filters: [{ key: 'timeframe', label: 'Timeframe', options: TIMEFRAME }, { key: 'status', label: 'Status', options: GOAL_STATUS }],
    fields: [
      { key: 'goal', label: 'Goal', type: 'text', required: true, full: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'timeframe', label: 'Timeframe', type: 'select', options: TIMEFRAME, required: true },
      { key: 'deadline', label: 'Deadline', type: 'date' },
      { key: 'priority', label: 'Priority', type: 'select', options: PRIORITY },
      { key: 'progress', label: 'Progress (%)', type: 'percent' },
      { key: 'status', label: 'Status', type: 'select', options: GOAL_STATUS },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
    ],
    columns: [
      { key: 'goal', label: 'Goal' },
      { key: 'timeframe', label: 'Timeframe', render: i => UI.badge(i.timeframe, 'blue') },
      { key: 'status', label: 'Status', render: i => UI.badge(i.status || 'Not Started') },
      { key: 'progress', label: 'Progress', render: i => `${i.progress || 0}%` },
    ],
  },

  monthlyLogs: {
    collection: 'monthlyLogs', title: 'Monthly Development Log', subtitle: 'A running record of your growth, month by month.',
    itemLabel: 'monthly log', newLabel: '+ New Month', layout: 'cards', emptyIcon: '🗓️',
    emptyTitle: 'No monthly logs yet', emptyDesc: 'Start a monthly habit of reflecting on your progress.',
    searchKeys: ['month', 'whatStudied', 'nextPriorities'],
    sort: (a, b) => (b.month || '').localeCompare(a.month || ''),
    fields: [
      { key: 'month', label: 'Month', type: 'month', required: true },
      { key: 'whatStudied', label: 'What I Studied', type: 'textarea', full: true },
      { key: 'whatLearned', label: 'What I Learned', type: 'textarea', full: true },
      { key: 'whatIDid', label: 'What I Did', type: 'textarea', full: true },
      { key: 'psychiatryProgress', label: 'Psychiatry Progress', type: 'textarea', full: true },
      { key: 'researchProgress', label: 'Research Progress', type: 'textarea', full: true },
      { key: 'englishProgress', label: 'English Progress', type: 'textarea', full: true },
      { key: 'clinicalSkills', label: 'Clinical Skills', type: 'textarea', full: true },
      { key: 'achievements', label: 'Achievements', type: 'textarea', full: true },
      { key: 'challenges', label: 'Challenges', type: 'textarea', full: true },
      { key: 'interests', label: 'What I Discovered About My Interests', type: 'textarea', full: true },
      { key: 'nextPriorities', label: "Next Month's Priorities", type: 'textarea', full: true },
    ],
    columns: [
      { key: 'month', label: 'Month' },
      { key: 'whatStudied', label: 'Highlights', render: i => esc((i.whatStudied || '').slice(0, 60)) + ((i.whatStudied || '').length > 60 ? '…' : '') },
    ],
  },

  evidenceImpact: {
    collection: 'evidenceImpact', title: 'Evidence of Impact', subtitle: 'Real experience, not just certificates.',
    itemLabel: 'impact record', newLabel: '+ Add Impact Record', layout: 'cards', emptyIcon: '🌍',
    emptyTitle: 'No impact records yet', emptyDesc: 'Document the real-world problem you addressed and the outcome achieved.',
    searchKeys: ['activity', 'organization', 'outcome'],
    fields: [
      { key: 'activity', label: 'Activity', type: 'text', required: true, full: true },
      { key: 'organization', label: 'Organization', type: 'text' },
      { key: 'myRole', label: 'My Role', type: 'text' },
      { key: 'problem', label: 'Problem', type: 'textarea', full: true },
      { key: 'whatIDid', label: 'What I Did', type: 'textarea', full: true },
      { key: 'outcome', label: 'Outcome', type: 'textarea', full: true },
      { key: 'peopleReached', label: 'Number of People Reached', type: 'number' },
      { key: 'evidenceFileId', label: 'Evidence', type: 'file' },
      { key: 'certificateFileId', label: 'Certificate', type: 'file' },
    ],
    columns: [
      { key: 'activity', label: 'Activity' },
      { key: 'organization', label: 'Organization' },
      { key: 'peopleReached', label: 'People Reached', render: i => i.peopleReached || '—' },
    ],
  },

  englishEvidence: {
    collection: 'englishEvidence', title: 'English Evidence', subtitle: 'Certificates, writing samples and presentations.',
    itemLabel: 'evidence', newLabel: '+ Add Evidence', layout: 'table', emptyIcon: '🗂️',
    emptyTitle: 'No evidence uploaded yet', emptyDesc: 'Attach IELTS/TOEFL results, writing samples or presentations.',
    searchKeys: ['title'],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'type', label: 'Type', type: 'select', options: ['Certificate', 'IELTS/TOEFL Result', 'Writing Sample', 'Presentation', 'Academic Work'] },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'fileId', label: 'File', type: 'file' },
    ],
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'type', label: 'Type', render: i => UI.badge(i.type || 'Certificate') },
      { key: 'date', label: 'Date', render: i => UI.fmtDate(i.date) },
    ],
  },

  clinicalSkills: {
    collection: 'clinicalSkills', title: 'Clinical Skills', subtitle: 'Track what you have learned, practiced and been supervised on.',
    itemLabel: 'skill', newLabel: '+ Add Skill', layout: 'table', emptyIcon: '🩺',
    emptyTitle: 'No skills yet', emptyDesc: 'Add clinical skills and track your progress on each.',
    searchKeys: ['skill', 'notes'],
    filters: [{ key: 'status', label: 'Status', options: SKILL_STATUS }],
    fields: [
      { key: 'skill', label: 'Skill', type: 'text', required: true, full: true },
      { key: 'status', label: 'Status', type: 'select', options: SKILL_STATUS, required: true },
      { key: 'learned', label: 'Learned', type: 'checkbox' },
      { key: 'practiced', label: 'Practiced', type: 'checkbox' },
      { key: 'supervised', label: 'Supervised', type: 'checkbox' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'notes', label: 'Notes', type: 'textarea', full: true },
      { key: 'evidenceFileId', label: 'Evidence', type: 'file' },
    ],
    columns: [
      { key: 'skill', label: 'Skill' },
      { key: 'learned', label: 'Learned', render: i => i.learned ? '✅' : '—' },
      { key: 'practiced', label: 'Practiced', render: i => i.practiced ? '✅' : '—' },
      { key: 'supervised', label: 'Supervised', render: i => i.supervised ? '✅' : '—' },
      { key: 'status', label: 'Status', render: i => UI.badge(i.status || 'Not Started') },
    ],
  },

  milestones: {
    collection: 'milestones', title: 'Manual Milestones', subtitle: 'Add custom milestones to enrich your timeline.',
    itemLabel: 'milestone', newLabel: '+ Add Milestone', layout: 'table', emptyIcon: '📌',
    emptyTitle: 'No manual milestones yet', emptyDesc: 'Your timeline already auto-fills from dated records — add extra milestones here.',
    searchKeys: ['title', 'description'],
    fields: [
      { key: 'date', label: 'Date', type: 'date', required: true },
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', full: true },
    ],
    columns: [
      { key: 'date', label: 'Date', render: i => UI.fmtDate(i.date) },
      { key: 'title', label: 'Title' },
    ],
  },
};

function esc(s) { return UI.esc(s); }

window.Schemas = Schemas;
window.Consts = { SKILL_STATUS, PROJECT_STATUS, PUB_STATUS, GOAL_STATUS, PRIORITY, TIMEFRAME, COURSE_CATEGORIES, BOOK_CATEGORIES, ACHIEVEMENT_CATEGORIES, ACADEMIC_TYPES, CONF_ROLE };
