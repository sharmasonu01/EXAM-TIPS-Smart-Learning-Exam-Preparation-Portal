import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleAuthProvider } from './firebase.js';
import { showToast } from './utils.js';

const LOCAL_STATE_KEY = 'exam_tips_student_state_v2';
const THEME_KEY = 'exam_tips_theme';

function loadLocalStudentState() {
  try {
    const raw = localStorage.getItem(LOCAL_STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        completedTopicIds: Array.isArray(parsed.completedTopicIds) ? parsed.completedTopicIds : [],
        viewedTopics: Array.isArray(parsed.viewedTopics) ? parsed.viewedTopics : [],
        bookmarkedQuestionIds: Array.isArray(parsed.bookmarkedQuestionIds) ? parsed.bookmarkedQuestionIds : [],
        bookmarkedTopicIds: Array.isArray(parsed.bookmarkedTopicIds) ? parsed.bookmarkedTopicIds : [],
        importantQuestionIds: Array.isArray(parsed.importantQuestionIds) ? parsed.importantQuestionIds : [],
        completedQuestionIds: Array.isArray(parsed.completedQuestionIds) ? parsed.completedQuestionIds : [],
        quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
      };
    }
  } catch {
    // Ignore storage read errors
  }
  return {
    completedTopicIds: [],
    viewedTopics: [],
    bookmarkedQuestionIds: [],
    bookmarkedTopicIds: [],
    importantQuestionIds: [],
    completedQuestionIds: [],
    quizAttempts: [],
  };
}

function saveLocalStudentState(studentState) {
  try {
    localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(studentState));
  } catch {
    // Ignore storage write errors
  }
}

// Keep Firebase ID token strictly in memory (never in localStorage)
let currentIdToken = null;
const listeners = new Set();

export const store = {
  // Navigation
  route: 'landing', // 'landing' | 'dashboard' | 'unit' | 'questions' | 'practice' | 'diagrams' | 'admin'
  activeUnitNumber: 1,
  activeUnitTab: 'overview', // 'overview' | 'notes' | 'questions' | 'diagrams' | 'mcq' | 'revision' | 'download'
  activeTopicId: null,
  mobileMenuOpen: false,
  searchOpen: false,
  searchQuery: '',
  fullscreenDiagramKey: null,

  // Theme
  theme: 'light',

  // Auth
  authLoading: true,
  firebaseUser: null,
  userProfile: null,

  // Catalog (loaded from PostgreSQL /api/catalog)
  catalogLoading: true,
  catalogError: null,
  catalog: {
    units: [],
    stats: {
      totalUnits: 5,
      totalTopics: 0,
      totalQuestions: 0,
      totalMcqs: 0,
      totalDiagrams: 0,
    },
  },

  // Student progress & bookmarks
  studentState: loadLocalStudentState(),

  // UI view-level state
  answerMode: 'exam', // 'exam' | 'learning'
  expandedQuestionIds: {},
  questionFilters: {
    unitNumber: 'all',
    marks: 'all', // 'all' | '2' | '5' | '8' | '10' | 'bookmarked'
    search: '',
  },
  unitQuestionFilter: 'all', // 'all' | '2' | '5' | '8' | '10' | 'bookmarked'
  unitQuestionSearch: '',

  // Diagram state per viewer instance
  diagramActiveStep: {},
  diagramZoom: {},

  // Embedded Unit MCQ state
  unitMcq: {
    unitNumber: null,
    selections: {},
    submitted: false,
  },

  // Full Practice Test Center state
  practiceTest: {
    unitScope: 'all', // 'all' | '1'..'5'
    mode: 'practice', // 'practice' | 'timed'
    active: false,
    submitted: false,
    questions: [],
    currentIndex: 0,
    answers: {},
    remainingSeconds: 0,
    elapsedSeconds: 0,
    timerId: null,
  },

  // Diagrams page filters
  diagramsPage: {
    unitNumber: 'all',
    category: 'all',
    search: '',
  },

  // Admin Studio state
  admin: {
    tab: 'units', // 'units' | 'topics' | 'questions' | 'mcqs' | 'diagrams' | 'users'
    loading: false,
    users: [],
    messages: [],
    selectedUnitId: null,
    editingItem: null,
  },

  // Print helper state
  printMode: null, // null | 'topic' | 'full-unit' | 'single-question'
  printQuestionId: null,
};

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function notify() {
  listeners.forEach((fn) => fn());
}

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark =
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  store.theme = saved === 'dark' || saved === 'light' ? saved : prefersDark ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', store.theme === 'dark');
}

export function toggleTheme() {
  store.theme = store.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem(THEME_KEY, store.theme);
  document.documentElement.classList.toggle('dark', store.theme === 'dark');
  notify();
}

export async function apiFetch(url, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (currentIdToken) {
    headers.set('Authorization', `Bearer ${currentIdToken}`);
  }
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function loadCatalog() {
  store.catalogLoading = true;
  store.catalogError = null;
  notify();
  try {
    const raw = await apiFetch('/api/catalog');
    const rawUnits = Array.isArray(raw.units) ? raw.units : [];
    const rawTopics = Array.isArray(raw.topics) ? raw.topics : [];
    const rawQuestions = Array.isArray(raw.questions) ? raw.questions : [];
    const rawMcqs = Array.isArray(raw.mcqs) ? raw.mcqs : [];
    const rawDiagrams = Array.isArray(raw.diagrams) ? raw.diagrams : [];

    const nestedUnits = rawUnits.map((u) => ({
      ...u,
      topics: rawTopics.filter((t) => t.unitId === u.id),
      questions: rawQuestions.filter((q) => q.unitId === u.id),
      mcqs: rawMcqs.filter((m) => m.unitId === u.id),
      diagrams: rawDiagrams.filter((d) => d.unitId === u.id),
    }));

    store.catalog = {
      units: nestedUnits,
      stats: {
        totalUnits: nestedUnits.length,
        totalTopics: rawTopics.length,
        totalQuestions: rawQuestions.length,
        totalMcqs: rawMcqs.length,
        totalDiagrams: rawDiagrams.length,
      },
    };

    if (nestedUnits.length > 0 && !store.admin.selectedUnitId) {
      store.admin.selectedUnitId = nestedUnits[0].id;
    }
    const unit = getActiveUnit();
    if (unit && unit.topics?.length > 0 && !store.activeTopicId) {
      store.activeTopicId = unit.topics[0].id;
    }
  } catch (err) {
    store.catalogError = err.message || 'Failed to load curriculum catalog.';
  } finally {
    store.catalogLoading = false;
    notify();
  }
}

export async function loadStudentStateFromServer() {
  if (!currentIdToken) return;
  try {
    const data = await apiFetch('/api/student/state');
    const progressRows = Array.isArray(data.progress) ? data.progress : [];
    const bookmarkRows = Array.isArray(data.bookmarks) ? data.bookmarks : [];
    const statusRows = Array.isArray(data.questionStatuses) ? data.questionStatuses : [];
    const attemptRows = Array.isArray(data.attempts) ? data.attempts : [];

    const unitNumberById = new Map((store.catalog.units || []).map((u) => [u.id, u.unitNumber]));

    store.studentState = {
      completedTopicIds: progressRows.filter((p) => p.completed).map((p) => p.topicId),
      viewedTopics: progressRows.map((p) => ({
        topicId: p.topicId,
        lastViewedAt: p.lastViewedAt,
      })),
      bookmarkedQuestionIds: bookmarkRows
        .filter((b) => b.itemType === 'question')
        .map((b) => b.itemId),
      bookmarkedTopicIds: bookmarkRows
        .filter((b) => b.itemType === 'topic')
        .map((b) => b.itemId),
      importantQuestionIds: statusRows.filter((s) => s.important).map((s) => s.questionId),
      completedQuestionIds: statusRows.filter((s) => s.completed).map((s) => s.questionId),
      quizAttempts: attemptRows.map((a) => ({
        id: a.id,
        unitId: a.unitId,
        unitNumber: a.unitId ? unitNumberById.get(a.unitId) || null : null,
        mode: a.mode,
        score: a.score,
        total: a.totalQuestions,
        percentage: a.percentage,
        durationSeconds: a.durationSeconds,
        createdAt: a.createdAt,
      })),
    };
    saveLocalStudentState(store.studentState);
    notify();
  } catch (err) {
    console.warn('Could not sync student state:', err.message);
  }
}

export function initAuth() {
  onAuthStateChanged(auth, async (user) => {
    store.firebaseUser = user;
    if (user) {
      try {
        currentIdToken = await user.getIdToken();
        const me = await apiFetch('/api/me');
        store.userProfile = me.user;
        await loadStudentStateFromServer();
      } catch (err) {
        console.error('Auth sync error:', err);
        store.userProfile = null;
      }
    } else {
      currentIdToken = null;
      store.userProfile = null;
      store.studentState = loadLocalStudentState();
    }
    store.authLoading = false;
    notify();
  });
}

export async function signInWithGoogle() {
  try {
    await signInWithPopup(auth, googleAuthProvider);
    showToast('Signed in! Progress synced to cloud.');
  } catch (err) {
    if (err?.code !== 'auth/popup-closed-by-user') {
      showToast(err?.message || 'Sign-in failed.');
    }
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    if (store.route === 'admin') {
      store.route = 'dashboard';
    }
    showToast('Signed out.');
    notify();
  } catch (err) {
    showToast(err?.message || 'Sign-out failed.');
  }
}

// Navigation Helpers
export function navigateTo(route, opts = {}) {
  store.route = route;
  store.mobileMenuOpen = false;
  if (opts.unitNumber !== undefined) {
    store.activeUnitNumber = Number(opts.unitNumber);
    const unit = getUnitByNumber(store.activeUnitNumber);
    if (opts.topicId) {
      store.activeTopicId = Number(opts.topicId);
    } else if (unit?.topics?.length) {
      store.activeTopicId = unit.topics[0].id;
    }
  }
  if (opts.tab) {
    store.activeUnitTab = opts.tab;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  notify();
}

export function getUnitByNumber(unitNumber) {
  return (store.catalog.units || []).find((u) => u.unitNumber === Number(unitNumber)) || null;
}

export function getActiveUnit() {
  return getUnitByNumber(store.activeUnitNumber) || (store.catalog.units || [])[0] || null;
}

export function getAllQuestions() {
  return (store.catalog.units || []).flatMap((u) =>
    (u.questions || []).map((q) => ({ ...q, unitNumber: u.unitNumber, unitTitle: u.title }))
  );
}

export function getAllDiagrams() {
  return (store.catalog.units || []).flatMap((u) =>
    (u.diagrams || []).map((d) => ({ ...d, unitNumber: u.unitNumber, unitTitle: u.title }))
  );
}

export function getAllMcqs() {
  return (store.catalog.units || []).flatMap((u) =>
    (u.mcqs || []).map((m) => ({ ...m, unitNumber: u.unitNumber, unitTitle: u.title }))
  );
}

export function findDiagramByKey(key) {
  if (!key) return null;
  for (const u of store.catalog.units || []) {
    const found = (u.diagrams || []).find((d) => d.diagramKey === key);
    if (found) return { ...found, unitNumber: u.unitNumber, unitTitle: u.title };
  }
  return null;
}

// Student Progress & Bookmarks Mutations
export async function recordTopicView(topicId) {
  const id = Number(topicId);
  const now = new Date().toISOString();
  const existing = store.studentState.viewedTopics.filter((v) => v.topicId !== id);
  store.studentState.viewedTopics = [{ topicId: id, lastViewedAt: now }, ...existing].slice(0, 20);
  saveLocalStudentState(store.studentState);
  if (currentIdToken) {
    apiFetch('/api/student/progress', {
      method: 'POST',
      body: JSON.stringify({ topicId: id }),
    }).catch(() => {});
  }
}

export async function toggleTopicCompleted(topicId) {
  const id = Number(topicId);
  const has = store.studentState.completedTopicIds.includes(id);
  const completed = !has;
  if (completed) {
    store.studentState.completedTopicIds = [...store.studentState.completedTopicIds, id];
  } else {
    store.studentState.completedTopicIds = store.studentState.completedTopicIds.filter((x) => x !== id);
  }
  saveLocalStudentState(store.studentState);
  notify();
  showToast(completed ? 'Topic marked as completed!' : 'Topic marked as incomplete.');
  if (currentIdToken) {
    apiFetch('/api/student/progress', {
      method: 'POST',
      body: JSON.stringify({ topicId: id, completed }),
    }).catch(() => {});
  }
}

export async function toggleBookmark(itemType, itemId) {
  const id = Number(itemId);
  const key = itemType === 'topic' ? 'bookmarkedTopicIds' : 'bookmarkedQuestionIds';
  const has = store.studentState[key].includes(id);
  if (has) {
    store.studentState[key] = store.studentState[key].filter((x) => x !== id);
  } else {
    store.studentState[key] = [...store.studentState[key], id];
  }
  saveLocalStudentState(store.studentState);
  notify();
  showToast(has ? 'Removed bookmark.' : 'Saved to bookmarks!');
  if (currentIdToken) {
    apiFetch('/api/student/bookmarks', {
      method: 'POST',
      body: JSON.stringify({ itemType, itemId: id }),
    }).catch(() => {});
  }
}

export async function toggleQuestionFlag(questionId, flagType) {
  const id = Number(questionId);
  const key = flagType === 'important' ? 'importantQuestionIds' : 'completedQuestionIds';
  const has = store.studentState[key].includes(id);
  const nextVal = !has;
  if (nextVal) {
    store.studentState[key] = [...store.studentState[key], id];
  } else {
    store.studentState[key] = store.studentState[key].filter((x) => x !== id);
  }
  saveLocalStudentState(store.studentState);
  notify();
  if (flagType === 'important') {
    showToast(nextVal ? 'Marked as Important!' : 'Unmarked Important.');
  } else {
    showToast(nextVal ? 'Question marked Completed!' : 'Question unmarked.');
  }
  if (currentIdToken) {
    apiFetch('/api/student/question-status', {
      method: 'POST',
      body: JSON.stringify({
        questionId: id,
        [flagType === 'important' ? 'important' : 'completed']: nextVal,
      }),
    }).catch(() => {});
  }
}

export async function saveQuizAttempt(attempt) {
  const unit = attempt.unitNumber ? getUnitByNumber(attempt.unitNumber) : null;
  const totalQuestions = Number(attempt.total) || 1;
  const score = Number(attempt.score) || 0;
  const percentage = Math.round((score / totalQuestions) * 100);
  const localAttempt = {
    id: Date.now(),
    ...attempt,
    unitId: unit ? unit.id : null,
    percentage,
    createdAt: new Date().toISOString(),
  };
  store.studentState.quizAttempts = [localAttempt, ...store.studentState.quizAttempts].slice(0, 30);
  saveLocalStudentState(store.studentState);
  notify();

  if (currentIdToken) {
    try {
      const saved = await apiFetch('/api/student/quiz-attempts', {
        method: 'POST',
        body: JSON.stringify({
          unitId: unit ? unit.id : null,
          mode: attempt.mode === 'timed' ? 'timed-mock' : 'practice',
          score,
          totalQuestions,
          percentage,
          durationSeconds: Number(attempt.durationSeconds) || 0,
        }),
      });
      if (saved?.id) {
        store.studentState.quizAttempts[0] = {
          ...localAttempt,
          id: saved.id,
          createdAt: saved.createdAt || localAttempt.createdAt,
        };
        saveLocalStudentState(store.studentState);
        notify();
      }
    } catch {
      // Keep local copy
    }
  }
}
