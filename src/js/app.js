import {
  handleAdminDelete,
  handleAdminFormSubmit,
  handleAdminRoleToggle,
  loadAdminMeta,
  renderAdminPage,
} from './admin.js';
import { renderDashboardPage } from './dashboard.js';
import { renderInteractiveDiagramCard } from './diagrams.js';
import { renderDiagramsPage } from './diagramsPage.js';
import { icon } from './icons.js';
import { renderLandingPage } from './landing.js';
import {
  renderPracticeTestsPage,
  startPracticeSession,
  stopPracticeTimer,
  submitPracticeSession,
} from './practiceTests.js';
import { renderQuestionBankPage } from './questions.js';
import { renderSearchModal } from './searchModal.js';
import {
  apiFetch,
  findDiagramByKey,
  getActiveUnit,
  getAllQuestions,
  initAuth,
  initTheme,
  loadCatalog,
  navigateTo,
  notify,
  recordTopicView,
  saveQuizAttempt,
  signInWithGoogle,
  signOutUser,
  store,
  subscribe,
  toggleBookmark,
  toggleQuestionFlag,
  toggleTheme,
  toggleTopicCompleted,
} from './state.js';
import { renderUnitWorkspacePage } from './unitWorkspace.js';
import {
  copyTextToClipboard,
  downloadTextFile,
  escapeHtml,
  formatQuestionAsText,
  formatUnitStudyMaterialText,
  showToast,
} from './utils.js';

function renderFullscreenDiagramModal() {
  if (!store.fullscreenDiagramKey) return '';
  const diagram = findDiagramByKey(store.fullscreenDiagramKey);
  if (!diagram) return '';

  return `
    <div class="modal-overlay no-print" data-action="close-fullscreen-diagram">
      <div class="modal-box modal-box-lg" onclick="event.stopPropagation()">
        <div class="modal-header">
          <strong>${escapeHtml(diagram.title)}</strong>
          <button class="btn-icon" data-action="close-fullscreen-diagram" title="Close">${icon('x', 'icon-sm')}</button>
        </div>
        <div class="modal-body">
          ${renderInteractiveDiagramCard(diagram, `fullscreen-${diagram.diagramKey}`, { isFullscreen: true })}
        </div>
      </div>
    </div>
  `;
}

function renderLmsShell(pageContent) {
  const { units } = store.catalog;
  const isDark = store.theme === 'dark';
  const isAdmin = store.userProfile?.role === 'admin';

  return `
    <div class="lms-shell">
      ${store.mobileMenuOpen ? `<div class="mobile-backdrop no-print" data-action="close-mobile-menu"></div>` : ''}

      <!-- Sidebar Navigation -->
      <aside class="lms-sidebar ${store.mobileMenuOpen ? 'open' : ''} no-print" aria-label="LMS Sidebar">
        <div class="lms-sidebar-header">
          <button class="brand" data-action="navigate" data-route="landing">
            <span class="brand-mark">${icon('graduationCap')}</span>
            <span style="text-align:left">
              <span style="font-size:1rem;display:block;line-height:1.1">EXAM TIPS</span>
              <span class="brand-sub">Web Tech LMS</span>
            </span>
          </button>
          <button class="btn-icon mobile-only" data-action="close-mobile-menu" title="Close menu">
            ${icon('x', 'icon-sm')}
          </button>
        </div>

        <nav class="lms-sidebar-nav">
          <div>
            <div class="nav-section-title">Learning Portal</div>
            <button class="nav-item ${store.route === 'dashboard' ? 'active' : ''}" data-action="navigate" data-route="dashboard">
              ${icon('dashboard', 'icon-sm')} Student Dashboard
            </button>
            <button class="nav-item ${store.route === 'questions' ? 'active' : ''}" data-action="navigate" data-route="questions">
              ${icon('helpCircle', 'icon-sm')} Question Bank
            </button>
            <button class="nav-item ${store.route === 'practice' ? 'active' : ''}" data-action="navigate" data-route="practice">
              ${icon('clipboardCheck', 'icon-sm')} Practice Tests
            </button>
            <button class="nav-item ${store.route === 'diagrams' ? 'active' : ''}" data-action="navigate" data-route="diagrams">
              ${icon('network', 'icon-sm')} Technical Diagrams
            </button>
            <button class="nav-item" data-action="navigate" data-route="landing">
              ${icon('home', 'icon-sm')} Back to Homepage
            </button>
          </div>

          <div>
            <div class="nav-section-title">Course: Web Technology</div>
            ${(units || [])
              .map(
                (u) => `
                <button
                  class="nav-item ${store.route === 'unit' && store.activeUnitNumber === u.unitNumber ? 'active' : ''}"
                  data-action="navigate"
                  data-route="unit"
                  data-unit="${u.unitNumber}"
                  data-tab="overview"
                >
                  <span class="nav-unit-num">U${u.unitNumber}</span>
                  <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(u.title)}</span>
                </button>
              `
              )
              .join('')}
          </div>

          ${
            isAdmin
              ? `
                <div>
                  <div class="nav-section-title">Administration</div>
                  <button class="nav-item ${store.route === 'admin' ? 'active' : ''}" data-action="open-admin">
                    ${icon('shield', 'icon-sm')} Admin Studio
                  </button>
                </div>
              `
              : ''
          }
        </nav>

        <div class="lms-sidebar-footer">
          ${
            store.userProfile
              ? `
                <div class="flex items-center justify-between gap-2">
                  <div style="min-width:0">
                    <div style="font-size:0.82rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(store.userProfile.displayName || 'Student')}</div>
                    <div class="text-muted" style="font-size:0.72rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(store.userProfile.email)}</div>
                  </div>
                  <button class="btn-icon" data-action="sign-out" title="Sign out">${icon('logOut', 'icon-sm')}</button>
                </div>
              `
              : `
                <button class="btn btn-primary btn-sm w-full" data-action="sign-in">
                  ${icon('logIn', 'icon-sm')} Sign In with Google
                </button>
              `
          }
        </div>
      </aside>

      <!-- Main Column -->
      <div class="lms-main">
        <header class="lms-topbar no-print">
          <div class="flex items-center gap-3">
            <button class="btn-icon mobile-only" data-action="open-mobile-menu" title="Open navigation">
              ${icon('menu', 'icon-sm')}
            </button>
            <button class="search-trigger" data-action="open-search">
              ${icon('search', 'icon-sm')}
              <span>Search notes, questions, diagrams...</span>
              <span class="kbd">Ctrl K</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <button class="btn-icon" data-action="toggle-theme" title="Switch light / dark theme">
              ${icon(isDark ? 'sun' : 'moon', 'icon-sm')}
            </button>
            ${
              store.route === 'unit'
                ? `<button class="btn btn-soft btn-sm" data-action="print-topic">${icon('printer', 'icon-sm')} Print PDF</button>`
                : ''
            }
          </div>
        </header>

        <main class="lms-content">
          ${pageContent}
        </main>
      </div>
    </div>
  `;
}

function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  // Preserve active input focus & cursor position during re-renders
  const activeEl = document.activeElement;
  const activeId = activeEl?.id || null;
  const activeInputAction = activeEl?.dataset?.inputAction || null;
  const activeScope = activeEl?.dataset?.scope || null;
  const selStart = typeof activeEl?.selectionStart === 'number' ? activeEl.selectionStart : null;

  let markup = '';

  if (store.catalogLoading && store.catalog.units.length === 0) {
    markup = `
      <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px">
        <div class="spinner"></div>
        <p class="text-muted">Loading EXAM TIPS Web Technology Curriculum...</p>
      </div>
    `;
  } else if (store.catalogError && store.catalog.units.length === 0) {
    markup = `
      <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px">
        <div class="card text-center" style="max-width:460px">
          <h2>Could Not Load Curriculum</h2>
          <p class="text-muted mt-2">${escapeHtml(store.catalogError)}</p>
          <button class="btn btn-primary mt-4" data-action="reload-catalog">Retry</button>
        </div>
      </div>
    `;
  } else if (store.route === 'landing') {
    markup = renderLandingPage();
  } else {
    let pageContent = '';
    if (store.route === 'dashboard') pageContent = renderDashboardPage();
    else if (store.route === 'unit') pageContent = renderUnitWorkspacePage();
    else if (store.route === 'questions') pageContent = renderQuestionBankPage();
    else if (store.route === 'practice') pageContent = renderPracticeTestsPage();
    else if (store.route === 'diagrams') pageContent = renderDiagramsPage();
    else if (store.route === 'admin') pageContent = renderAdminPage();
    else pageContent = renderDashboardPage();

    markup = renderLmsShell(pageContent);
  }

  markup += renderSearchModal();
  markup += renderFullscreenDiagramModal();

  root.innerHTML = markup;

  // Restore focus on search inputs seamlessly
  if (activeId) {
    const nextEl = document.getElementById(activeId);
    if (nextEl) {
      nextEl.focus();
      if (selStart !== null && typeof nextEl.setSelectionRange === 'function') {
        nextEl.setSelectionRange(selStart, selStart);
      }
    }
  } else if (activeInputAction) {
    const selector = activeScope
      ? `[data-input-action="${activeInputAction}"][data-scope="${activeScope}"]`
      : `[data-input-action="${activeInputAction}"]`;
    const nextEl = root.querySelector(selector);
    if (nextEl) {
      nextEl.focus();
      if (selStart !== null && typeof nextEl.setSelectionRange === 'function') {
        nextEl.setSelectionRange(selStart, selStart);
      }
    }
  }
}

function triggerPrint(mode, questionId = null) {
  store.printMode = mode;
  store.printQuestionId = questionId;
  if (mode === 'full-unit' && store.route === 'unit' && store.activeUnitTab !== 'notes') {
    store.activeUnitTab = 'notes';
  }
  notify();
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      store.printMode = null;
      store.printQuestionId = null;
      notify();
    }, 250);
  }, 120);
}

// Global Click Delegation
document.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const action = target.dataset.action;

  switch (action) {
    case 'navigate': {
      stopPracticeTimer();
      const route = target.dataset.route;
      const unitNumber = target.dataset.unit ? Number(target.dataset.unit) : undefined;
      const tab = target.dataset.tab;
      const topicId = target.dataset.topicId ? Number(target.dataset.topicId) : undefined;
      navigateTo(route, { unitNumber, tab, topicId });
      if (topicId) recordTopicView(topicId);
      break;
    }

    case 'open-admin': {
      navigateTo('admin');
      loadAdminMeta();
      break;
    }

    case 'toggle-theme':
      toggleTheme();
      break;

    case 'sign-in':
      signInWithGoogle();
      break;

    case 'sign-out':
      signOutUser();
      break;

    case 'open-mobile-menu':
      store.mobileMenuOpen = true;
      notify();
      break;

    case 'close-mobile-menu':
      store.mobileMenuOpen = false;
      notify();
      break;

    case 'open-search':
      store.searchOpen = true;
      notify();
      setTimeout(() => document.getElementById('global-search-input')?.focus(), 40);
      break;

    case 'close-search':
    case 'close-search-backdrop':
      store.searchOpen = false;
      notify();
      break;

    case 'search-jump-topic': {
      const unitNumber = Number(target.dataset.unit);
      const topicId = Number(target.dataset.topicId);
      store.searchOpen = false;
      navigateTo('unit', { unitNumber, tab: 'notes', topicId });
      recordTopicView(topicId);
      break;
    }

    case 'search-jump-question': {
      const unitNumber = Number(target.dataset.unit);
      const qId = Number(target.dataset.questionId);
      store.searchOpen = false;
      store.expandedQuestionIds[qId] = true;
      navigateTo('unit', { unitNumber, tab: 'questions' });
      break;
    }

    case 'search-jump-diagram': {
      store.searchOpen = false;
      store.fullscreenDiagramKey = target.dataset.diagramKey;
      notify();
      break;
    }

    case 'set-unit-tab': {
      store.activeUnitTab = target.dataset.tab;
      if (store.activeUnitTab === 'notes' && store.activeTopicId) {
        recordTopicView(store.activeTopicId);
      }
      notify();
      break;
    }

    case 'open-unit-topic': {
      const topicId = Number(target.dataset.topicId);
      store.activeTopicId = topicId;
      store.activeUnitTab = 'notes';
      recordTopicView(topicId);
      notify();
      break;
    }

    case 'select-topic': {
      const topicId = Number(target.dataset.topicId);
      store.activeTopicId = topicId;
      recordTopicView(topicId);
      notify();
      break;
    }

    case 'toggle-topic-complete':
      toggleTopicCompleted(Number(target.dataset.topicId));
      break;

    case 'toggle-bookmark':
      toggleBookmark(target.dataset.itemType, Number(target.dataset.itemId));
      break;

    case 'toggle-question-flag':
      toggleQuestionFlag(Number(target.dataset.questionId), target.dataset.flag);
      break;

    case 'toggle-question-answer': {
      const qId = Number(target.dataset.questionId);
      store.expandedQuestionIds[qId] = !store.expandedQuestionIds[qId];
      notify();
      break;
    }

    case 'set-answer-mode':
      store.answerMode = target.dataset.mode;
      notify();
      break;

    case 'filter-questions': {
      const scope = target.dataset.scope;
      const val = target.dataset.filter;
      if (scope === 'unit') store.unitQuestionFilter = val;
      else store.questionFilters.marks = val;
      notify();
      break;
    }

    case 'expand-all-questions': {
      const scope = target.dataset.scope;
      const list = scope === 'unit' ? getActiveUnit()?.questions || [] : getAllQuestions();
      list.forEach((q) => {
        store.expandedQuestionIds[q.id] = true;
      });
      notify();
      break;
    }

    case 'collapse-all-questions':
      store.expandedQuestionIds = {};
      notify();
      break;

    case 'copy-question': {
      const qId = Number(target.dataset.questionId);
      const q = getAllQuestions().find((item) => item.id === qId);
      if (q) copyTextToClipboard(formatQuestionAsText(q, store.answerMode), 'Answer copied!');
      break;
    }

    case 'download-question': {
      const qId = Number(target.dataset.questionId);
      const q = getAllQuestions().find((item) => item.id === qId);
      if (q) {
        downloadTextFile(`EXAM_TIPS_Q${q.id}_${q.marks}Marks.txt`, formatQuestionAsText(q, store.answerMode));
      }
      break;
    }

    case 'print-question':
      triggerPrint('single-question', Number(target.dataset.questionId));
      break;

    case 'print-topic':
      triggerPrint('topic');
      break;

    case 'print-full-unit':
      triggerPrint('full-unit');
      break;

    case 'download-unit-txt': {
      const unit = getActiveUnit();
      if (unit) {
        downloadTextFile(
          `EXAM_TIPS_Unit_${unit.unitNumber}_Study_Material.txt`,
          formatUnitStudyMaterialText(unit)
        );
      }
      break;
    }

    case 'copy-code':
      copyTextToClipboard(target.dataset.code || '', 'Code snippet copied!');
      break;

    case 'diagram-step': {
      const viewerId = target.dataset.viewerId;
      const step = Number(target.dataset.step);
      store.diagramActiveStep[viewerId] =
        store.diagramActiveStep[viewerId] === step ? null : step;
      notify();
      break;
    }

    case 'diagram-zoom': {
      const viewerId = target.dataset.viewerId;
      const delta = Number(target.dataset.delta);
      const cur = store.diagramZoom[viewerId] ?? 1;
      store.diagramZoom[viewerId] = Math.min(1.6, Math.max(0.7, Number((cur + delta).toFixed(2))));
      notify();
      break;
    }

    case 'diagram-reset': {
      const viewerId = target.dataset.viewerId;
      store.diagramZoom[viewerId] = 1;
      store.diagramActiveStep[viewerId] = null;
      notify();
      break;
    }

    case 'diagram-fullscreen':
      store.fullscreenDiagramKey = target.dataset.diagramKey;
      notify();
      break;

    case 'close-fullscreen-diagram':
      store.fullscreenDiagramKey = null;
      notify();
      break;

    // Embedded Unit MCQ actions
    case 'unit-mcq-select': {
      if (store.unitMcq.submitted) return;
      const mcqId = Number(target.dataset.mcqId);
      const optIdx = Number(target.dataset.optIdx);
      store.unitMcq.selections[mcqId] = optIdx;
      notify();
      break;
    }

    case 'unit-mcq-submit': {
      const unit = getActiveUnit();
      if (!unit) return;
      store.unitMcq.submitted = true;
      let score = 0;
      (unit.mcqs || []).forEach((m) => {
        if (store.unitMcq.selections[m.id] === m.correctIndex) score += 1;
      });
      saveQuizAttempt({
        unitNumber: unit.unitNumber,
        mode: 'unit-mcq',
        score,
        total: (unit.mcqs || []).length,
        durationSeconds: 0,
      });
      showToast(`Unit ${unit.unitNumber} Score: ${score}/${(unit.mcqs || []).length}`);
      notify();
      break;
    }

    case 'unit-mcq-retake':
      store.unitMcq.selections = {};
      store.unitMcq.submitted = false;
      notify();
      break;

    // Practice Tests Center actions
    case 'practice-mode':
      store.practiceTest.mode = target.dataset.mode;
      notify();
      break;

    case 'practice-start':
      startPracticeSession();
      break;

    case 'practice-select': {
      const mcqId = Number(target.dataset.mcqId);
      const optIdx = Number(target.dataset.optIdx);
      store.practiceTest.answers[mcqId] = optIdx;
      notify();
      break;
    }

    case 'practice-jump':
      store.practiceTest.currentIndex = Number(target.dataset.idx);
      notify();
      break;

    case 'practice-submit':
      submitPracticeSession();
      break;

    case 'practice-exit':
      stopPracticeTimer();
      store.practiceTest.active = false;
      store.practiceTest.submitted = false;
      notify();
      break;

    // Admin actions
    case 'admin-tab':
      store.admin.tab = target.dataset.tab;
      if (store.admin.tab === 'users') loadAdminMeta();
      notify();
      break;

    case 'admin-refresh':
      loadAdminMeta();
      break;

    case 'admin-delete':
      handleAdminDelete(target.dataset.entity, Number(target.dataset.id));
      break;

    case 'admin-toggle-role':
      handleAdminRoleToggle(Number(target.dataset.userId), target.dataset.nextRole);
      break;

    case 'reload-catalog':
      loadCatalog();
      break;

    default:
      break;
  }
});

// Input & Select Event Delegation
document.addEventListener('input', (event) => {
  const el = event.target;
  const action = el.dataset?.inputAction;
  if (!action) return;

  if (action === 'search-questions') {
    if (el.dataset.scope === 'unit') store.unitQuestionSearch = el.value;
    else store.questionFilters.search = el.value;
    notify();
  } else if (action === 'diag-search') {
    store.diagramsPage.search = el.value;
    notify();
  } else if (action === 'global-search') {
    store.searchQuery = el.value;
    notify();
  }
});

document.addEventListener('change', (event) => {
  const el = event.target;
  const action = el.dataset?.changeAction;
  if (!action) return;

  if (action === 'qb-unit-filter') {
    store.questionFilters.unitNumber = el.value;
    notify();
  } else if (action === 'practice-scope') {
    store.practiceTest.unitScope = el.value;
    notify();
  } else if (action === 'diag-unit-filter') {
    store.diagramsPage.unitNumber = el.value;
    notify();
  } else if (action === 'diag-category-filter') {
    store.diagramsPage.category = el.value;
    notify();
  } else if (action === 'admin-unit-select') {
    store.admin.selectedUnitId = Number(el.value);
    notify();
  }
});

// Form Submission Delegation (Contact Form + Admin Forms)
document.addEventListener('submit', async (event) => {
  const form = event.target;
  const action = form.dataset?.action;
  if (!action) return;
  event.preventDefault();

  if (action === 'submit-contact') {
    const fd = new FormData(form);
    const feedbackEl = document.getElementById('contact-feedback');
    try {
      await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: String(fd.get('name') || '').trim(),
          email: String(fd.get('email') || '').trim(),
          subject: String(fd.get('subject') || '').trim(),
          message: String(fd.get('message') || '').trim(),
        }),
      });
      form.reset();
      if (feedbackEl) {
        feedbackEl.className = 'badge badge-emerald';
        feedbackEl.textContent = 'Message sent! Our faculty team has received your inquiry.';
      }
      showToast('Contact message submitted!');
    } catch (err) {
      if (feedbackEl) {
        feedbackEl.className = 'badge badge-rose';
        feedbackEl.textContent = err.message || 'Could not send message.';
      }
    }
  } else if (action === 'admin-submit') {
    await handleAdminFormSubmit(form);
  }
});

// Global Keyboard Shortcuts (Ctrl+K / Cmd+K for Search, Escape to close modals)
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    store.searchOpen = !store.searchOpen;
    notify();
    if (store.searchOpen) {
      setTimeout(() => document.getElementById('global-search-input')?.focus(), 40);
    }
  } else if (event.key === 'Escape') {
    if (store.searchOpen || store.fullscreenDiagramKey) {
      store.searchOpen = false;
      store.fullscreenDiagramKey = null;
      notify();
    }
  }
});

// Bootstrap Application
initTheme();
subscribe(renderApp);
renderApp();
initAuth();
loadCatalog();
