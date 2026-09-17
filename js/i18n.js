/* ============================================================
   i18n.js — lightweight English/Arabic translation layer
   t(text) looks up the exact English string in DICT and returns
   the Arabic version when the current language is Arabic; any
   string without a match (e.g. user-entered data) is returned
   unchanged. This lets the rest of the app stay written in
   plain English strings while still being fully translatable.
   ============================================================ */

const DICT = {
  /* ---------- common actions / words ---------- */
  'Save': 'حفظ', 'Cancel': 'إلغاء', 'Delete': 'حذف', 'Edit': 'تعديل', 'Add': 'إضافة',
  'Search': 'بحث', 'Close': 'إغلاق', 'Confirm': 'تأكيد', 'Please confirm': 'يرجى التأكيد',
  'Remove': 'إزالة', 'Notes': 'ملاحظات', 'Back': 'رجوع', 'Theme': 'المظهر',
  'Public View': 'العرض العام', 'CV Builder': 'إنشاء السيرة الذاتية',
  'Search the whole portfolio...': 'ابحث في كل الملف...',
  'This field is required': 'هذا الحقل مطلوب', 'is required': 'مطلوب',
  'Saved': 'تم الحفظ', 'Added': 'تمت الإضافة', 'Deleted': 'تم الحذف',
  'All Types': 'كل الأنواع', 'All Years': 'كل السنوات',
  'Not Started ': 'لم يبدأ', 'Nothing here yet': 'لا يوجد شيء هنا بعد',

  /* ---------- status enums (skill/project/goal progress) ---------- */
  'Not Started': 'لم يبدأ', 'Learning': 'قيد التعلم', 'Competent': 'متقن',
  'Idea': 'فكرة', 'Planning': 'تخطيط', 'Writing': 'كتابة', 'Submitted': 'مُرسل',
  'Under Review': 'قيد المراجعة', 'Published': 'منشور', 'In Progress': 'قيد التنفيذ',
  'Completed': 'مكتمل', 'Attendee': 'حاضر', 'Presenter': 'متحدث',

  /* ---------- app shell ---------- */
  'Medical Career Portfolio': 'الملف المهني الطبي', 'Academic & Research Record': 'السجل الأكاديمي والبحثي',

  /* ---------- nav groups ---------- */
  'Overview': 'نظرة عامة', 'Academic': 'أكاديمي', 'Psychiatry': 'الطب النفسي',
  'Research': 'البحث العلمي', 'Growth': 'النمو والتطور', 'Career Tools': 'أدوات مهنية', 'System': 'النظام',

  /* ---------- nav items ---------- */
  'Dashboard': 'الرئيسية', 'Home': 'الرئيسية', 'Timeline': 'الخط الزمني', 'Analytics': 'الإحصائيات',
  'Academic Record': 'السجل الأكاديمي', 'English & Communication': 'اللغة الإنجليزية والتواصل',
  'Courses & Certifications': 'الدورات والشهادات', 'Fundamentals': 'الأساسيات',
  'Major Disorders': 'الاضطرابات الرئيسية', 'Psychopharmacology': 'علم الأدوية النفسية',
  'Psychotherapy': 'العلاج النفسي', 'Topics & Clinical Cases': 'المواضيع والحالات السريرية',
  'Clinical Skills': 'المهارات السريرية', 'Research Dashboard': 'لوحة البحث العلمي',
  'Research Projects': 'المشاريع البحثية', 'Publications': 'الأبحاث المنشورة',
  'Conferences': 'المؤتمرات', 'Volunteering': 'التطوع', 'Leadership': 'القيادة',
  'Books & Articles': 'الكتب والمقالات', 'Mentors & Network': 'المرشدون والشبكة الأكاديمية',
  'Recommendation Letters': 'خطابات التوصية', 'Achievements & Awards': 'الإنجازات والجوائز',
  'Evidence of Impact': 'أدلة الأثر', 'Personal Statement': 'البيان الشخصي',
  'Future Goals': 'الأهداف المستقبلية', 'Monthly Log': 'السجل الشهري',
  'Search & Filter': 'البحث والتصفية', 'Settings & Backup': 'الإعدادات والنسخ الاحتياطي',

  /* ---------- dashboard ---------- */
  'Welcome': 'مرحبًا', 'Future Psychiatrist': 'طبيب نفسي مستقبلي',
  'Here is a snapshot of your medical career journey.': 'هذه لمحة عن مسيرتك المهنية الطبية.',
  'Edit Profile': 'تعديل الملف الشخصي', 'Profile': 'الملف الشخصي',
  'At a Glance': 'نظرة سريعة', 'Career Vision': 'الرؤية المهنية', 'Edit Career Path': 'تعديل المسار المهني',
  'Current Progress': 'التقدم الحالي', "Drag each slider to reflect your honest self-assessment.": 'حرّك كل شريط ليعكس تقييمك الصادق لنفسك.',
  'Jump To': 'انتقل إلى', 'Full Name': 'الاسم الكامل', 'Current Status': 'الحالة الحالية',
  'Future Goal': 'الهدف المستقبلي', 'Research Interest': 'الاهتمام البحثي', 'Location': 'الموقع',
  'Email': 'البريد الإلكتروني', 'Short Bio': 'نبذة مختصرة', 'Profile Photo': 'الصورة الشخصية',
  'Show profile in public portfolio': 'إظهار الملف الشخصي في النسخة العامة',
  'One stage per line': 'مرحلة واحدة في كل سطر', 'Current stage (0 = first line)': 'المرحلة الحالية (0 = السطر الأول)',
  'Psychiatry Journey': 'رحلة الطب النفسي', 'Fundamentals, disorders, pharmacology, cases': 'الأساسيات، الاضطرابات، الأدوية، الحالات',
  'Projects, publications, skills': 'المشاريع، المنشورات، المهارات',
  'Generate an up-to-date CV in minutes': 'أنشئ سيرة ذاتية محدثة خلال دقائق',
  '1-year, 3-year, 5-year and long-term goals': 'أهداف سنة، 3 سنوات، 5 سنوات وطويلة المدى',
  "Reflect on this month's growth": 'تأمل في نمو هذا الشهر',
  'Why medicine, why psychiatry, why research': 'لماذا الطب، لماذا الطب النفسي، لماذا البحث',
  'Publications': 'الأبحاث المنشورة',

  'Your Name': 'اسمك', 'Medical Student': 'طالب طب', 'Goal:': 'الهدف:', 'Research:': 'البحث:',
  'Arabic': 'العربية', 'Native': 'لغة أم',

  /* ---------- progress labels ---------- */
  'Academic Performance': 'الأداء الأكاديمي', 'Medical Knowledge': 'المعرفة الطبية',
  'Statistics': 'الإحصاء', 'English': 'اللغة الإنجليزية',

  /* ---------- academic ---------- */
  'Your institutional record, awards, exams and certificates.': 'سجلك الجامعي وجوائزك وامتحاناتك وشهاداتك.',
  'Institution Details': 'تفاصيل الجامعة', 'Edit Institution Details': 'تعديل تفاصيل الجامعة',
  'University': 'الجامعة', 'Medical School': 'كلية الطب', 'Current Level': 'المستوى الحالي',
  'Academic Years': 'السنوات الدراسية', 'GPA / Average': 'المعدل التراكمي', 'Class Ranking': 'الترتيب على الدفعة',
  'Academic Achievements': 'الإنجازات الأكاديمية', 'Awards, honors, exams and certificates from your academic record.': 'الجوائز والتكريمات والامتحانات والشهادات من سجلك الأكاديمي.',
  'academic item': 'عنصر أكاديمي', '+ Add Item': '+ إضافة عنصر', 'No academic items yet': 'لا توجد عناصر أكاديمية بعد',
  'Log awards, exams and certificates as you earn them.': 'سجّل الجوائز والامتحانات والشهادات فور حصولك عليها.',

  /* ---------- psychiatry ---------- */
  'Psychiatry Fundamentals': 'أساسيات الطب النفسي',
  'Psychiatric history, MSE, psychopathology, diagnosis, differential diagnosis and management.': 'التاريخ النفسي، الفحص العقلي، علم الأمراض النفسية، التشخيص، التشخيص التفريقي والعلاج.',
  'Track your study progress across the major psychiatric disorders.': 'تابع تقدمك الدراسي عبر الاضطرابات النفسية الرئيسية.',
  '+ Add Topic': '+ إضافة موضوع', 'Add Topic': 'إضافة موضوع', 'Topic name': 'اسم الموضوع',
  'Edit —': 'تعديل —', 'Notes / key points': 'ملاحظات / نقاط مهمة', 'Date studied': 'تاريخ الدراسة',
  'Remove "': 'إزالة "',

  'Psychiatry Topics & Clinical Cases': 'مواضيع وحالات الطب النفسي السريرية',
  'Track what you study — from fundamentals to real cases.': 'تابع ما تدرسه — من الأساسيات إلى الحالات الحقيقية.',
  'topic / case': 'موضوع / حالة', 'No topics logged yet': 'لا توجد مواضيع مسجلة بعد',
  'Record what you study in psychiatry, with resources and clinical application.': 'سجّل ما تدرسه في الطب النفسي، مع المصادر والتطبيق السريري.',
  'Topic': 'الموضوع', 'Completion status': 'حالة الإنجاز', 'Resources': 'المصادر',
  'What I learned': 'ما تعلمته', 'Important points': 'نقاط مهمة', 'Clinical application': 'التطبيق السريري',
  'Personal notes': 'ملاحظات شخصية',

  'Psychotherapy Modalities': 'أساليب العلاج النفسي',
  'Therapeutic modalities studied or practiced.': 'أساليب العلاج التي درستها أو مارستها.',
  'modality': 'أسلوب', '+ Add Modality': '+ إضافة أسلوب', 'No modalities yet': 'لا توجد أساليب بعد',
  'Add CBT, psychodynamic therapy, DBT, supportive therapy, etc.': 'أضف العلاج المعرفي السلوكي، الديناميكي، الجدلي السلوكي، الداعم، إلخ.',
  'Modality': 'الأسلوب', 'Status': 'الحالة', 'Date': 'التاريخ',

  'Psychopharmacology': 'علم الأدوية النفسية',
  'Track what you have studied by drug category.': 'تابع ما درسته حسب فئة الدواء.',
  'topic': 'موضوع', 'No topics yet': 'لا توجد مواضيع بعد',
  'Add a category (e.g. Antidepressants) and track your progress.': 'أضف فئة (مثل مضادات الاكتئاب) وتابع تقدمك.',
  'Category / Drug': 'الفئة / الدواء',

  /* ---------- clinical skills ---------- */
  'Clinical Skills': 'المهارات السريرية', 'Track what you have learned, practiced and been supervised on.': 'تابع ما تعلمته ومارسته وأُشرف عليك فيه.',
  'skill': 'مهارة', '+ Add Skill': '+ إضافة مهارة', 'No skills yet': 'لا توجد مهارات بعد',
  'Add clinical skills and track your progress on each.': 'أضف مهارات سريرية وتابع تقدمك في كل منها.',
  'Skill': 'المهارة', 'Learned': 'تعلّمتها', 'Practiced': 'ممارَس', 'Supervised': 'تحت إشراف',
  'Evidence': 'دليل',

  /* ---------- research ---------- */
  'Research Dashboard': 'لوحة البحث العلمي', 'Every project, publication and skill — in one place.': 'كل مشروع ومنشور ومهارة — في مكان واحد.',
  'Research Projects': 'المشاريع البحثية', 'Conference Presentations': 'العروض في المؤتمرات', 'Skills in Progress': 'مهارات قيد التطور',
  'Project Pipeline': 'مسار المشاريع', 'Research Skills': 'المهارات البحثية', 'Core competencies for producing good research.': 'الكفاءات الأساسية لإنتاج بحث جيد.',

  'Every project from idea to publication.': 'كل مشروع من الفكرة إلى النشر.',
  'research project': 'مشروع بحثي', '+ Add Project': '+ إضافة مشروع', 'No research projects yet': 'لا توجد مشاريع بحثية بعد',
  'Add your first project — you can update its status as it progresses.': 'أضف مشروعك الأول — يمكنك تحديث حالته مع تقدمه.',
  'Project Title': 'عنوان المشروع', 'Research Question': 'سؤال البحث', 'Supervisor': 'المشرف',
  'Institution': 'المؤسسة', 'Study Design': 'تصميم الدراسة', 'Research Field': 'مجال البحث',
  'Start Date': 'تاريخ البدء', 'End Date': 'تاريخ الانتهاء', 'My Role': 'دوري', 'Responsibilities': 'المسؤوليات',
  'Skills Learned': 'المهارات المكتسبة', 'Dataset': 'مجموعة البيانات', 'Analysis': 'التحليل',
  'Manuscript': 'المخطوطة', 'Journal': 'المجلة', 'Submission Date': 'تاريخ التقديم', 'Publication Status': 'حالة النشر',
  'DOI': 'المعرّف الرقمي DOI', 'Link': 'الرابط', 'Abstract': 'الملخص', 'PDF': 'ملف PDF',
  'Show in public portfolio': 'إظهار في النسخة العامة',

  'Publications': 'الأبحاث المنشورة', 'Peer-reviewed and published research output.': 'الأبحاث المنشورة والمحكّمة.',
  'publication': 'بحث منشور', '+ Add Publication': '+ إضافة بحث منشور', 'No publications yet': 'لا توجد أبحاث منشورة بعد',
  'Your published research will appear here — and count automatically on the dashboard.': 'ستظهر أبحاثك المنشورة هنا — وتُحتسب تلقائيًا في الرئيسية.',
  'Title': 'العنوان', 'Authors': 'المؤلفون', 'Publication Date': 'تاريخ النشر',
  'My Contribution': 'مساهمتي', 'PubMed Link': 'رابط PubMed', 'Journal Link': 'رابط المجلة',

  'Conferences & Presentations': 'المؤتمرات والعروض التقديمية', 'Attendance, posters and talks.': 'الحضور والملصقات العلمية والعروض.',
  'conference': 'مؤتمر', '+ Add Conference': '+ إضافة مؤتمر', 'No conferences yet': 'لا توجد مؤتمرات بعد',
  'Add conferences you attended or presented at.': 'أضف المؤتمرات التي حضرتها أو قدّمت فيها.',
  'Conference Name': 'اسم المؤتمر', 'Location': 'المكان', 'Role': 'الدور', 'Presentation Title': 'عنوان العرض',
  'What I Learned': 'ما تعلمته', 'Certificate': 'الشهادة', 'Poster / Slides': 'الملصق / الشرائح',
  'Attendee': 'حاضر', 'Presenter': 'متحدث', 'Poster': 'ملصق علمي',

  /* ---------- english ---------- */
  'English & Academic Communication': 'اللغة الإنجليزية والتواصل الأكاديمي',
  'Track your development toward academic fluency.': 'تابع تطورك نحو الطلاقة الأكاديمية.',
  '✏️ Edit Levels': '✏️ تعديل المستويات', 'Edit Levels': 'تعديل المستويات',
  'Current Level': 'المستوى الحالي', 'Target Level': 'المستوى المستهدف', 'IELTS': 'آيلتس', 'TOEFL': 'توفل',
  'Skill Development': 'تطور المهارات', 'Academic Reading': 'القراءة الأكاديمية', 'Academic Writing': 'الكتابة الأكاديمية',
  'Speaking': 'التحدث', 'Listening': 'الاستماع', 'Medical English': 'الإنجليزية الطبية', 'Presentation Skills': 'مهارات العرض',
  'Edit English Levels': 'تعديل مستويات اللغة الإنجليزية', 'IELTS Score': 'درجة آيلتس', 'TOEFL Score': 'درجة توفل',
  'English Evidence': 'أدلة اللغة الإنجليزية', 'Certificates, writing samples and presentations.': 'الشهادات وعينات الكتابة والعروض التقديمية.',
  'evidence': 'دليل', '+ Add Evidence': '+ إضافة دليل', 'No evidence uploaded yet': 'لا توجد أدلة مرفوعة بعد',
  'Attach IELTS/TOEFL results, writing samples or presentations.': 'أرفق نتائج آيلتس/توفل أو عينات كتابة أو عروضًا تقديمية.',
  'Type': 'النوع', 'Certificate': 'شهادة', 'IELTS/TOEFL Result': 'نتيجة آيلتس/توفل', 'Writing Sample': 'عينة كتابة',
  'Presentation': 'عرض تقديمي', 'Academic Work': 'عمل أكاديمي',

  /* ---------- courses ---------- */
  'Courses & Certifications': 'الدورات والشهادات', 'Structured learning outside the medical curriculum.': 'تعلّم منظم خارج المنهج الطبي.',
  'course': 'دورة', '+ Add Course': '+ إضافة دورة', 'No courses yet': 'لا توجد دورات بعد',
  'Log courses, workshops and certifications as you complete them.': 'سجّل الدورات وورش العمل والشهادات فور إكمالها.',
  'Course Name': 'اسم الدورة', 'Provider': 'الجهة المقدمة', 'Category': 'الفئة', 'Completion Date': 'تاريخ الإكمال',
  'Duration': 'المدة', 'Relevance to Career': 'الصلة بالمسار المهني',
  'Medicine': 'الطب', 'Communication': 'التواصل', 'Other': 'أخرى',

  /* ---------- volunteering / leadership ---------- */
  'Volunteering': 'التطوع', 'Community impact — not just certificates.': 'أثر مجتمعي — وليس مجرد شهادات.',
  'activity': 'نشاط', '+ Add Activity': '+ إضافة نشاط', 'No volunteering activities yet': 'لا توجد أنشطة تطوعية بعد',
  'Document the organizations, roles and real impact of your volunteer work.': 'وثّق الجهات والأدوار والأثر الحقيقي لعملك التطوعي.',
  'Organization': 'الجهة', 'Project': 'المشروع', 'People Reached': 'عدد المستفيدين',

  'Leadership': 'القيادة', 'Roles where you led teams or initiatives.': 'الأدوار التي قدت فيها فرقًا أو مبادرات.',
  'leadership role': 'دور قيادي', '+ Add Role': '+ إضافة دور', 'No leadership experience yet': 'لا توجد خبرة قيادية بعد',
  'Document team roles, problems solved and outcomes achieved.': 'وثّق الأدوار القيادية والمشكلات المحلولة والنتائج المحققة.',
  'Position': 'المنصب', 'Team Size': 'حجم الفريق', 'Problem': 'المشكلة', 'What I Did': 'ما فعلته', 'Outcome': 'النتيجة',

  /* ---------- books ---------- */
  'Books & Articles': 'الكتب والمقالات', 'A learning log, not just a reading list.': 'سجل تعلّم، وليس مجرد قائمة قراءة.',
  'book / article': 'كتاب / مقال', '+ Add Book': '+ إضافة كتاب', 'No books logged yet': 'لا توجد كتب مسجلة بعد',
  'Capture key ideas and how you can apply them — not just titles.': 'دوّن الأفكار الأساسية وكيفية تطبيقها — وليس فقط العناوين.',
  'Author': 'المؤلف', 'Finish Date': 'تاريخ الانتهاء', 'Rating (1-5)': 'التقييم (١-٥)',
  'Key Ideas': 'الأفكار الأساسية', 'How I Can Apply It': 'كيف يمكنني تطبيقه', 'General Knowledge': 'معرفة عامة',

  /* ---------- mentors / recommendations ---------- */
  'Mentors & Academic Network': 'المرشدون والشبكة الأكاديمية', 'Professors and supervisors who shaped your journey.': 'الأساتذة والمشرفون الذين شكّلوا مسيرتك.',
  'mentor': 'مرشد', '+ Add Mentor': '+ إضافة مرشد', 'No mentors added yet': 'لم يُضف مرشدون بعد',
  'Keep track of the people guiding your academic path.': 'تابع الأشخاص الذين يوجهون مسارك الأكاديمي.',
  'Name': 'الاسم', 'Specialty': 'التخصص', 'How We Worked Together': 'كيف عملنا معًا', 'Dates': 'التواريخ',

  'Recommendation Letters': 'خطابات التوصية', 'Track who can vouch for you, and where the letters are.': 'تابع من يمكنه الشهادة لك، وأين توجد الخطابات.',
  'recommendation': 'خطاب توصية', '+ Add Recommendation': '+ إضافة توصية', 'No recommendation letters yet': 'لا توجد خطابات توصية بعد',
  'Log professors who have written or could write letters for you.': 'سجّل الأساتذة الذين كتبوا أو يمكنهم كتابة خطابات لك.',
  'Professor': 'الأستاذ', 'Relationship': 'العلاقة', 'Type of Recommendation': 'نوع التوصية',

  /* ---------- achievements ---------- */
  'Achievements & Awards': 'الإنجازات والجوائز', 'Academic, research and other recognitions.': 'تكريمات أكاديمية وبحثية وغيرها.',
  'achievement': 'إنجاز', '+ Add Achievement': '+ إضافة إنجاز', 'No achievements yet': 'لا توجد إنجازات بعد',
  'Awards, scholarships and competitions will appear here.': 'ستظهر هنا الجوائز والمنح والمسابقات.',
  'Description': 'الوصف', 'Academic': 'أكاديمي', 'Scholarship': 'منحة دراسية', 'Competition': 'مسابقة', 'Recognition': 'تكريم',

  /* ---------- goals ---------- */
  'Future Goals': 'الأهداف المستقبلية', '1-year, 3-year, 5-year and long-term goals — reviewed and updated over time.': 'أهداف سنة، 3 سنوات، 5 سنوات وطويلة المدى — تُراجع وتُحدّث بمرور الوقت.',
  '+ Add Goal': '+ إضافة هدف', 'Add Goal': 'إضافة هدف', 'Edit Goal': 'تعديل الهدف',
  'Goal': 'الهدف', 'Deadline': 'الموعد النهائي', 'Priority': 'الأولوية', 'Progress (%)': 'التقدم (%)',
  'Low': 'منخفضة', 'Medium': 'متوسطة', 'High': 'عالية',
  '1-Year': 'سنة واحدة', '3-Year': '3 سنوات', '5-Year': '5 سنوات', 'Long-Term': 'طويلة المدى',
  'Goals': 'أهداف', 'No {tf} goals yet.': 'لا توجد أهداف بعد.',

  /* ---------- monthly log ---------- */
  'Monthly Development Log': 'سجل التطور الشهري', 'A running record of your growth, month by month.': 'سجل مستمر لنموك، شهرًا بشهر.',
  'monthly log': 'سجل شهري', '+ New Month': '+ شهر جديد', 'No monthly logs yet': 'لا توجد سجلات شهرية بعد',
  'Start a monthly habit of reflecting on your progress.': 'ابدأ عادة شهرية للتأمل في تقدمك.',
  'Month': 'الشهر', 'What I Studied': 'ما درسته', 'Psychiatry Progress': 'تقدم الطب النفسي',
  'Research Progress': 'تقدم البحث', 'English Progress': 'تقدم اللغة الإنجليزية', 'Achievements': 'الإنجازات',
  'Challenges': 'التحديات', 'What I Discovered About My Interests': 'ما اكتشفته عن اهتماماتي',
  "Next Month's Priorities": 'أولويات الشهر القادم', 'Highlights': 'أبرز النقاط',

  /* ---------- evidence of impact ---------- */
  'Evidence of Impact': 'أدلة الأثر', 'Real experience, not just certificates.': 'خبرة حقيقية، وليست مجرد شهادات.',
  'impact record': 'سجل أثر', '+ Add Impact Record': '+ إضافة سجل أثر', 'No impact records yet': 'لا توجد سجلات أثر بعد',
  'Document the real-world problem you addressed and the outcome achieved.': 'وثّق المشكلة الواقعية التي عالجتها والنتيجة المحققة.',
  'Activity': 'النشاط', 'Number of People Reached': 'عدد المستفيدين',

  /* ---------- personal statement ---------- */
  'Personal Statement / Academic Story': 'البيان الشخصي / القصة الأكاديمية',
  'Your evolving narrative — write it once, refine it for years.': 'سردك المتطور — اكتبه مرة وطوّره لسنوات.',
  'Last updated': 'آخر تحديث', 'Why Medicine?': 'لماذا الطب؟', 'Why Psychiatry?': 'لماذا الطب النفسي؟',
  'Why Research?': 'لماذا البحث؟', 'What problems interest me?': 'ما المشكلات التي تهمني؟',
  'What have I done?': 'ماذا فعلت؟', 'What have I learned?': 'ماذا تعلمت؟',
  'What impact do I want to make?': 'ما الأثر الذي أريد تحقيقه؟', 'Why postgraduate study?': 'لماذا الدراسات العليا؟',
  'Future Career Vision': 'رؤية المسار المهني المستقبلي', 'Write your thoughts here...': 'اكتب أفكارك هنا...',
  'Typing…': 'جارٍ الكتابة…', 'Saved ✓': 'تم الحفظ ✓',

  /* ---------- CV builder ---------- */
  'Generated automatically from your portfolio data.': 'يُنشأ تلقائيًا من بيانات ملفك.',
  '🖨️ Print / Export PDF': '🖨️ طباعة / تصدير PDF', 'Print / Export PDF': 'طباعة / تصدير PDF',
  'Sections to include': 'الأقسام المضمّنة',
  'Use your browser\'s Print dialog and choose "Save as PDF" to export.': 'استخدم نافذة الطباعة في متصفحك واختر "حفظ كـ PDF" للتصدير.',
  'Personal Information': 'المعلومات الشخصية', 'Education': 'التعليم', 'Clinical Experience (Skills)': 'الخبرة السريرية (المهارات)',
  'Psychiatry Experience': 'خبرة الطب النفسي', 'Skills Summary': 'ملخص المهارات', 'Languages': 'اللغات',
  'Education': 'التعليم', 'Clinical Experience': 'الخبرة السريرية', 'Research Experience': 'الخبرة البحثية',
  'Fundamentals:': 'الأساسيات:', 'Disorders studied:': 'الاضطرابات المدروسة:', 'Topics / cases documented:': 'المواضيع/الحالات الموثقة:',
  'Skills': 'المهارات', 'GPA:': 'المعدل:', 'Rank:': 'الترتيب:', 'Volunteer': 'متطوع',
  'Use your browser\'s Print dialog and choose "Save as PDF" to export.': 'استخدم نافذة الطباعة في متصفحك واختر "حفظ كـ PDF" للتصدير.',

  /* ---------- timeline ---------- */
  'Timeline': 'الخط الزمني', 'Automatically compiled from every dated record in your portfolio.': 'يُجمّع تلقائيًا من كل سجل مؤرخ في ملفك.',
  '+ Add Milestone': '+ إضافة محطة', 'Add Milestone': 'إضافة محطة', 'No dated records yet': 'لا توجد سجلات مؤرخة بعد',
  'As you add academic items, research, publications, courses and more with dates, they will appear here automatically.': 'عندما تضيف عناصر أكاديمية وبحوثًا ومنشورات ودورات وغيرها بتواريخ، ستظهر هنا تلقائيًا.',
  'Milestone': 'محطة', 'Academic': 'أكاديمي', 'Publication': 'منشور', 'Conference': 'مؤتمر', 'Course': 'دورة', 'Achievement': 'إنجاز',

  /* ---------- analytics ---------- */
  'Personal Development Analytics': 'إحصائيات التطور الشخصي', 'How your portfolio has grown over time.': 'كيف نما ملفك بمرور الوقت.',
  'Courses': 'الدورات', 'Books Read': 'الكتب المقروءة', 'Clinical Skills Tracked': 'المهارات السريرية المتابعة',
  'Psychiatry Topics': 'مواضيع الطب النفسي', 'Progress Overview': 'نظرة عامة على التقدم',
  'Clinical Skills — Status Breakdown': 'المهارات السريرية — توزيع الحالة', 'Research Pipeline': 'مسار الأبحاث',
  'Monthly Logs Recorded': 'السجلات الشهرية المسجلة',
  "Consistent monthly reflection is one of the strongest predictors of long-term growth.": 'التأمل الشهري المنتظم من أقوى مؤشرات النمو طويل المدى.',

  /* ---------- search ---------- */
  'Search & Filter': 'البحث والتصفية', 'Search across every section of your portfolio at once.': 'ابحث في كل أقسام ملفك دفعة واحدة.',
  'Search everything (e.g. Psychiatry, PubMed, Depression)...': 'ابحث عن أي شيء (مثال: طب نفسي، PubMed، اكتئاب)...',
  'Start typing to search': 'ابدأ الكتابة للبحث',
  'Search titles, notes and descriptions across every section — courses, research, books, skills, conferences and more.': 'ابحث في العناوين والملاحظات والأوصاف عبر كل الأقسام — الدورات، الأبحاث، الكتب، المهارات، المؤتمرات وغيرها.',
  'No matches found': 'لا توجد نتائج', 'Try a different keyword or clear your filters.': 'جرّب كلمة مختلفة أو امسح عوامل التصفية.',
  'Psychiatry Topic': 'موضوع طب نفسي', 'Research Project': 'مشروع بحثي', 'Mentor': 'مرشد', 'Impact Record': 'سجل أثر',
  'Psychiatry Fundamental': 'أساسية طب نفسي', 'Disorder': 'اضطراب',
  'Clinical Skill': 'مهارة سريرية', 'Book': 'كتاب', 'result': 'نتيجة', 'results': 'نتائج',

  /* ---------- settings ---------- */
  'Settings & Backup': 'الإعدادات والنسخ الاحتياطي', 'Security, data backup and portfolio configuration.': 'الأمان، النسخ الاحتياطي، وإعدادات الملف.',
  'Backup & Restore': 'النسخ الاحتياطي والاستعادة',
  'Your data lives only in this browser. Export regularly so you never lose years of work.': 'بياناتك محفوظة فقط في هذا المتصفح. صدّرها بانتظام حتى لا تفقد سنوات من العمل.',
  '⬇️ Export Full Backup (JSON)': '⬇️ تصدير نسخة احتياطية كاملة (JSON)', 'Export Full Backup (JSON)': 'تصدير نسخة احتياطية كاملة (JSON)',
  '⬆️ Import Backup (Replace All)': '⬆️ استيراد نسخة احتياطية (استبدال الكل)', 'Import Backup (Replace All)': 'استيراد نسخة احتياطية (استبدال الكل)',
  '🔀 Import Backup (Merge Data Only)': '🔀 استيراد نسخة احتياطية (دمج البيانات فقط)', 'Import Backup (Merge Data Only)': 'استيراد نسخة احتياطية (دمج البيانات فقط)',
  'Languages': 'اللغات', '+ Add Language': '+ إضافة لغة', 'Add Language': 'إضافة لغة',
  'Language': 'اللغة', 'Level': 'المستوى', 'e.g. Native, B2, Fluent': 'مثال: لغة أم، B2، طليق',
  'Private / Public Mode': 'الوضع الخاص / العام',
  'Every section you fill in is visible to anyone who opens this link — read-only, with no edit buttons. Only you, after logging in as owner, can add, edit or delete anything. Use "Preview as Visitor" any time to see exactly what visitors see.':
    'كل قسم تملأه يكون مرئيًا لأي شخص يفتح هذا الرابط — للقراءة فقط، بدون أزرار تعديل. أنت فقط، بعد تسجيل الدخول كمالك، يمكنك الإضافة أو التعديل أو الحذف. استخدم "معاينة كزائر" في أي وقت لترى بالضبط ما يراه الزوار.',
  'Danger Zone': 'منطقة الخطر', 'Permanently erase all portfolio data and files from this browser. Export a backup first.': 'حذف كل بيانات وملفات الملف نهائيًا من هذا المتصفح. صدّر نسخة احتياطية أولًا.',
  '🗑️ Erase All Data': '🗑️ حذف كل البيانات', 'Erase All Data': 'حذف كل البيانات', 'Erase Everything': 'حذف كل شيء',
  'This permanently deletes all portfolio data and uploaded files from this browser. Have you exported a backup?': 'سيؤدي هذا إلى حذف كل بيانات وملفات الملف نهائيًا من هذا المتصفح. هل صدّرت نسخة احتياطية؟',
  'Preparing backup...': 'جارٍ تحضير النسخة الاحتياطية...', 'Backup downloaded': 'تم تنزيل النسخة الاحتياطية',
  'Merge this backup into your current data?': 'دمج هذه النسخة الاحتياطية مع بياناتك الحالية؟',
  'Replace ALL current data with this backup? This cannot be undone.': 'استبدال كل بياناتك الحالية بهذه النسخة؟ لا يمكن التراجع عن هذا.',
  'Import': 'استيراد', 'Backup imported': 'تم استيراد النسخة الاحتياطية', 'Invalid backup file': 'ملف النسخة الاحتياطية غير صالح',

  /* ---------- public view ---------- */
  'Public Portfolio': 'الملف العام', 'Public portfolio not enabled': 'النسخة العامة غير مفعّلة',
  'The owner has not published a public profile yet.': 'لم يقم صاحب الملف بنشر نسخة عامة بعد.',
  'Level': 'المستوى', 'Years': 'السنوات',

  /* ---------- owner mode ---------- */
  'Owner Login': 'دخول المالك', 'Back to Dashboard': 'العودة للوحة التحكم', 'Exit Owner Mode': 'الخروج من وضع المالك',
  'Set Up Owner Password': 'إعداد كلمة مرور المالك', 'Password': 'كلمة المرور',
  'Choose a password': 'اختر كلمة مرور', 'Confirm password': 'تأكيد كلمة المرور',
  'Password must be at least 4 characters': 'يجب أن تكون كلمة المرور 4 أحرف على الأقل',
  'Passwords do not match': 'كلمتا المرور غير متطابقتين', 'Incorrect password': 'كلمة مرور غير صحيحة',
  'Owner Access': 'وصول المالك',
  'Anyone who opens this link sees only the read-only public portfolio. Only you, after entering your password, can see and edit the private dashboard on this device.': 'أي شخص يفتح هذا الرابط يرى فقط النسخة العامة للقراءة. أنت فقط، بعد إدخال كلمة المرور، يمكنك رؤية وتعديل لوحة التحكم الخاصة على هذا الجهاز.',
  'Change Password': 'تغيير كلمة المرور', 'Remove Password': 'إزالة كلمة المرور', 'New Password': 'كلمة المرور الجديدة',
  'Password updated': 'تم تحديث كلمة المرور',
  'Remove owner password protection? Anyone with this link could then set a new password and enter owner mode on their own device (this never affects your real data, which only exists in your browser).': 'إزالة حماية كلمة مرور المالك؟ عندها يمكن لأي شخص لديه هذا الرابط تعيين كلمة مرور جديدة والدخول كمالك على جهازه (هذا لا يؤثر أبدًا على بياناتك الحقيقية الموجودة فقط في متصفحك).',
  'Password removed': 'تمت إزالة كلمة المرور',
  'Owner password is not configured yet — see js/owner-config.js': 'لم يتم إعداد كلمة مرور المالك بعد — راجع ملف js/owner-config.js',
  'Your owner password is the same everywhere — it is stored in your site\'s files (js/owner-config.js), not in this browser. To change it, generate a new hash below, paste it into that file, then commit and redeploy your site.':
    'كلمة مرور المالك واحدة في كل مكان — محفوظة داخل ملفات موقعك (js/owner-config.js)، وليست في هذا المتصفح. لتغييرها، أنشئ رمزًا (hash) جديدًا بالأسفل، الصقه في ذلك الملف، ثم أعد نشر موقعك.',
  'Generate New Password Hash': 'إنشاء رمز كلمة مرور جديد',
  'Copy This Into js/owner-config.js': 'انسخ هذا إلى js/owner-config.js',
  'New OWNER_PASSWORD_HASH value': 'قيمة OWNER_PASSWORD_HASH الجديدة',
  'Instructions': 'التعليمات',
  'Open js/owner-config.js, replace the OWNER_PASSWORD_HASH value with the text above (keep the quotes), save, then commit and redeploy your site. Every browser will accept the new password immediately after that.':
    'افتح js/owner-config.js، استبدل قيمة OWNER_PASSWORD_HASH بالنص أعلاه (مع إبقاء علامتي الاقتباس)، احفظ، ثم أعد نشر موقعك. سيقبل أي متصفح كلمة المرور الجديدة فور ذلك.',
  'Viewing public read-only portfolio': 'أنت تشاهد النسخة العامة للقراءة فقط',
  'Previewing as a visitor would see it': 'أنت تعاين الموقع كما يراه الزائر',
  'Exit Preview': 'إنهاء المعاينة', 'Preview as Visitor': 'معاينة كزائر',

  /* ---------- confirm dialogs ---------- */
  'This cannot be undone.': 'لا يمكن التراجع عن هذا.', 'Delete this': 'حذف',

  /* ---------- generic CRUD engine chrome ---------- */
  'Actions': 'الإجراءات', 'All': 'الكل', '— Select —': '— اختر —',
  'View Details': 'عرض التفاصيل', 'Close': 'إغلاق', 'Yes': 'نعم', 'No': 'لا',
  'Evidence / Certificate': 'دليل / شهادة', 'File': 'ملف',
  'Add Topic': 'إضافة موضوع', 'Topic name': 'اسم الموضوع', 'Notes / key points': 'ملاحظات / نقاط رئيسية',
  'No records yet': 'لا توجد سجلات بعد', 'Add your first entry to start tracking this area.': 'أضف أول عنصر لتبدأ متابعة هذا المجال.',
  '+ Add': '+ إضافة', 'item': 'عنصر', 'No matches': 'لا توجد نتائج مطابقة', 'Try a different search or filter.': 'جرّب بحثًا أو تصفية مختلفة.',
  'Field': 'المجال', 'Timeframe': 'الإطار الزمني',

  /* ---------- psychiatry fundamentals seed ---------- */
  'Psychiatric History': 'التاريخ النفسي', 'Mental State Examination': 'الفحص العقلي',
  'Psychopathology': 'علم الأمراض النفسية', 'Diagnosis': 'التشخيص', 'Differential Diagnosis': 'التشخيص التفريقي',
  'Management': 'الخطة العلاجية',

  /* ---------- major disorders seed ---------- */
  'Depression': 'الاكتئاب', 'Bipolar Disorder': 'الاضطراب ثنائي القطب', 'Schizophrenia': 'الفصام',
  'Anxiety Disorders': 'اضطرابات القلق', 'OCD': 'الوسواس القهري', 'PTSD': 'اضطراب ما بعد الصدمة',
  'Substance Use Disorders': 'اضطرابات تعاطي المواد', 'Personality Disorders': 'اضطرابات الشخصية',
  'Child & Adolescent Psychiatry': 'طب نفسي الأطفال والمراهقين', 'Neuropsychiatry': 'الطب النفسي العصبي',

  /* ---------- psychopharmacology seed ---------- */
  'Antidepressants': 'مضادات الاكتئاب', 'Antipsychotics': 'مضادات الذهان',
  'Mood Stabilizers': 'مثبتات المزاج', 'Anxiolytics': 'مضادات القلق',

  /* ---------- clinical skills seed ---------- */
  'History Taking': 'أخذ التاريخ المرضي', 'Physical Examination': 'الفحص السريري',
  'Neurological Examination': 'الفحص العصبي', 'Cardiovascular Examination': 'فحص القلب والأوعية الدموية',
  'Respiratory Examination': 'فحص الجهاز التنفسي', 'Abdominal Examination': 'فحص البطن',
  'Communication Skills': 'مهارات التواصل', 'Risk Assessment': 'تقييم الخطورة', 'ECG': 'تخطيط القلب',
  'Basic Emergency Skills': 'مهارات الطوارئ الأساسية',

  /* ---------- research skills seed ---------- */
  'Research Question': 'سؤال البحث', 'Literature Search': 'البحث في الأدبيات', 'PubMed': 'PubMed',
  'Study Design': 'تصميم الدراسة', 'Critical Appraisal': 'التقييم النقدي', 'Evidence-Based Medicine': 'الطب المبني على الأدلة',
  'Epidemiology': 'علم الأوبئة', 'Biostatistics': 'الإحصاء الحيوي', 'Data Collection': 'جمع البيانات',
  'Data Analysis': 'تحليل البيانات', 'Scientific Writing': 'الكتابة العلمية', 'Reference Management': 'إدارة المراجع',
};

let CURRENT_LANG = 'en';

function initLang() {
  try { CURRENT_LANG = localStorage.getItem('mcp_lang') || 'en'; } catch { CURRENT_LANG = 'en'; }
}
function getLang() { return CURRENT_LANG; }
function setLang(lang) {
  CURRENT_LANG = lang;
  try { localStorage.setItem('mcp_lang', lang); } catch {}
  applyLangToDocument();
}
function toggleLang() { setLang(CURRENT_LANG === 'ar' ? 'en' : 'ar'); }

function t(text) {
  if (CURRENT_LANG !== 'ar') return text;
  if (text === null || text === undefined) return text;
  return DICT[text] !== undefined ? DICT[text] : text;
}

function applyLangToDocument() {
  const isAr = CURRENT_LANG === 'ar';
  document.documentElement.setAttribute('lang', isAr ? 'ar' : 'en');
  document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  document.body.classList.toggle('lang-ar', isAr);
  document.querySelectorAll('[data-t]').forEach(node => { node.textContent = t(node.dataset.t); });
  document.querySelectorAll('[data-t-placeholder]').forEach(node => { node.placeholder = t(node.dataset.tPlaceholder); });
  const langLabel = document.getElementById('lang-toggle-label');
  if (langLabel) langLabel.textContent = isAr ? 'English' : 'العربية';
  const brandTitle = document.getElementById('brand-title');
  if (brandTitle) brandTitle.textContent = t('Medical Career Portfolio');
  const brandSub = document.getElementById('brand-sub');
  if (brandSub) brandSub.textContent = t('Academic & Research Record');
}

initLang();

window.I18N = { t, getLang, setLang, toggleLang, applyLangToDocument };
