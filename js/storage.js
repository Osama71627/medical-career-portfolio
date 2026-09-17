/* ============================================================
   storage.js — client-only persistence layer
   - Structured records -> localStorage (JSON)
   - Binary files (PDF/images) -> IndexedDB
   No server, no external database. Everything lives in this browser.
   ============================================================ */

const LS_KEY = 'mcp_portfolio_data_v1';
const DB_NAME = 'mcp_portfolio_files';
const DB_STORE = 'files';

/* ---------- default empty data shape ---------- */
function defaultData() {
  return {
    meta: { createdAt: new Date().toISOString(), version: 1 },
    settings: {
      theme: 'light',
      siteName: 'Medical Career Portfolio',
      publicMode: false,
    },
    profile: {
      name: '', levelLabel: 'Medical Student — Level 5', futureGoal: 'Psychiatry',
      researchInterest: 'To be developed', location: '', email: '', bio: '', photoFileId: null,
    },
    progress: {
      academicPerformance: 0, medicalKnowledge: 0, psychiatry: 0, clinicalSkills: 0,
      research: 0, statistics: 0, english: 0, volunteering: 0, leadership: 0, publications: 0,
    },
    careerVision: [
      'Medical Student', 'Medical Graduate', 'Psychiatry Training', 'Psychiatrist',
      'Researcher', 'International Academic Career',
    ],
    careerVisionCurrentIndex: 0,
    academicInfo: {
      university: '', medicalSchool: '', currentLevel: 'Level 5', academicYears: '',
      gpa: '', classRanking: '',
    },
    academicItems: [],
    psychiatryFundamentals: [
      'Psychiatric History', 'Mental State Examination', 'Psychopathology', 'Diagnosis',
      'Differential Diagnosis', 'Management',
    ].map(seedStatusItem),
    psychiatryDisorders: [
      'Depression', 'Bipolar Disorder', 'Schizophrenia', 'Anxiety Disorders', 'OCD', 'PTSD',
      'Substance Use Disorders', 'Personality Disorders', 'Child & Adolescent Psychiatry',
      'Neuropsychiatry',
    ].map(seedStatusItem),
    psychopharm: [
      'Antidepressants', 'Antipsychotics', 'Mood Stabilizers', 'Anxiolytics',
    ].map(seedStatusItem),
    psychotherapy: [],
    clinicalCases: [],
    clinicalSkills: [
      'History Taking', 'Physical Examination', 'Mental State Examination', 'Neurological Examination',
      'Cardiovascular Examination', 'Respiratory Examination', 'Abdominal Examination',
      'Communication Skills', 'Risk Assessment', 'ECG', 'Basic Emergency Skills',
    ].map(name => ({
      id: uid(), skill: name, status: 'Not Started', learned: false, practiced: false,
      supervised: false, date: '', notes: '', evidenceFileId: null,
    })),
    researchSkills: [
      'Research Question', 'Literature Search', 'PubMed', 'Study Design', 'Critical Appraisal',
      'Evidence-Based Medicine', 'Epidemiology', 'Biostatistics', 'Data Collection',
      'Data Analysis', 'Scientific Writing', 'Reference Management',
    ].map(seedStatusItem),
    researchProjects: [],
    publications: [],
    conferences: [],
    englishRecord: {
      currentLevel: '', targetLevel: '', ielts: '', toefl: '', academicReading: 0,
      academicWriting: 0, speaking: 0, listening: 0, medicalEnglish: 0, presentationSkills: 0,
    },
    englishEvidence: [],
    courses: [],
    volunteering: [],
    leadership: [],
    books: [],
    mentors: [],
    recommendations: [],
    achievements: [],
    personalStatement: {
      whyMedicine: '', whyPsychiatry: '', whyResearch: '', problemsInterest: '',
      whatDone: '', whatLearned: '', impact: '', whyPostgrad: '', futureVision: '',
      updatedAt: null,
    },
    goals: [],
    monthlyLogs: [],
    evidenceImpact: [],
    milestones: [],
    languages: [{ id: uid(), language: 'Arabic', level: 'Native' }, { id: uid(), language: 'English', level: 'B2/C1' }],
    cvSettings: {
      includedSections: ['profile','education','academicAchievements','clinical','psychiatry','research','publications','conferences','volunteering','leadership','courses','skills','languages','awards'],
    },
  };
}
function seedStatusItem(name) {
  return { id: uid(), name, status: 'Not Started', notes: '', date: '' };
}

function uid() {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

/* ---------- core load/save ---------- */
let _cache = null;

function loadData() {
  if (_cache) return _cache;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      _cache = migrateData(JSON.parse(raw));
    } else {
      _cache = defaultData();
    }
  } catch (e) {
    console.error('Failed to load data, resetting.', e);
    _cache = defaultData();
  }
  return _cache;
}

function migrateData(data) {
  const fresh = defaultData();
  // shallow-merge top level, keep nested objects merged one level deep
  const merged = { ...fresh, ...data };
  for (const key of Object.keys(fresh)) {
    if (
      fresh[key] && typeof fresh[key] === 'object' && !Array.isArray(fresh[key]) &&
      data[key] && typeof data[key] === 'object'
    ) {
      merged[key] = { ...fresh[key], ...data[key] };
    }
  }
  return merged;
}

function saveData() {
  localStorage.setItem(LS_KEY, JSON.stringify(_cache));
  window.dispatchEvent(new CustomEvent('data:changed'));
}

function getData() {
  return loadData();
}

/* ---------- generic collection helpers ---------- */
function listOf(collection) {
  const data = loadData();
  if (!Array.isArray(data[collection])) data[collection] = [];
  return data[collection];
}

function addItem(collection, item) {
  const list = listOf(collection);
  const record = { id: uid(), createdAt: new Date().toISOString(), ...item };
  list.push(record);
  saveData();
  return record;
}

function updateItem(collection, id, patch) {
  const list = listOf(collection);
  const idx = list.findIndex(r => r.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
  saveData();
  return list[idx];
}

function deleteItem(collection, id) {
  const data = loadData();
  data[collection] = listOf(collection).filter(r => r.id !== id);
  saveData();
}

function getItem(collection, id) {
  return listOf(collection).find(r => r.id === id) || null;
}

function updateObject(key, patch) {
  const data = loadData();
  data[key] = { ...data[key], ...patch };
  saveData();
  return data[key];
}

/* ============================================================
   IndexedDB file store
   ============================================================ */
let _dbPromise = null;
function openDB() {
  if (_dbPromise) return _dbPromise;
  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return _dbPromise;
}

async function saveFile(file) {
  const db = await openDB();
  const id = uid();
  const record = {
    id, name: file.name, type: file.type, size: file.size,
    createdAt: new Date().toISOString(), blob: file,
  };
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(record);
    tx.oncomplete = () => resolve(id);
    tx.onerror = () => reject(tx.error);
  });
}

async function getFile(id) {
  if (!id) return null;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function deleteFile(id) {
  if (!id) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function listFiles() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const req = tx.objectStore(DB_STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function fileToObjectURL(id) {
  const rec = await getFile(id);
  if (!rec) return null;
  return URL.createObjectURL(rec.blob);
}

/* ---------- backup / export / import ---------- */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
function base64ToBlob(base64) {
  return fetch(base64).then(r => r.blob());
}

async function exportBackup() {
  const data = loadData();
  const files = await listFiles();
  const filesEncoded = [];
  for (const f of files) {
    const b64 = await blobToBase64(f.blob);
    filesEncoded.push({ id: f.id, name: f.name, type: f.type, size: f.size, createdAt: f.createdAt, base64: b64 });
  }
  return {
    exportedAt: new Date().toISOString(),
    app: 'Medical Career Portfolio',
    version: 1,
    data,
    files: filesEncoded,
  };
}

async function importBackup(payload, { merge = false } = {}) {
  if (!payload || !payload.data) throw new Error('Invalid backup file');
  if (!merge) {
    _cache = migrateData(payload.data);
    saveData();
    const db = await openDB();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).clear();
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } else {
    _cache = migrateData(payload.data);
    saveData();
  }
  if (Array.isArray(payload.files)) {
    for (const f of payload.files) {
      const blob = await base64ToBlob(f.base64);
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(DB_STORE, 'readwrite');
        tx.objectStore(DB_STORE).put({
          id: f.id, name: f.name, type: f.type, size: f.size, createdAt: f.createdAt, blob,
        });
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    }
  }
}

function resetAllData() {
  localStorage.removeItem(LS_KEY);
  _cache = null;
  return indexedDB.deleteDatabase(DB_NAME);
}

window.Store = {
  uid, getData, loadData, saveData,
  listOf, addItem, updateItem, deleteItem, getItem, updateObject,
  saveFile, getFile, deleteFile, listFiles, fileToObjectURL,
  exportBackup, importBackup, resetAllData,
};
