import { icon } from './icons.js';
import { getAllMcqs, getUnitByNumber, notify, saveQuizAttempt, store } from './state.js';
import { escapeHtml, formatTimer, showToast } from './utils.js';

const LETTERS = ['A', 'B', 'C', 'D'];

export function ensureUnitMcqInitialized(unitNumber) {
  if (store.unitMcq.unitNumber !== unitNumber) {
    store.unitMcq = {
      unitNumber,
      selections: {},
      submitted: false,
    };
  }
}

export function renderEmbeddedUnitMcq(unit) {
  ensureUnitMcqInitialized(unit.unitNumber);
  const mcqs = unit.mcqs || [];
  const state = store.unitMcq;

  if (mcqs.length === 0) {
    return `<div class="card text-center" style="padding:36px"><p class="text-muted">No MCQs available for this unit yet.</p></div>`;
  }

  const answeredCount = Object.keys(state.selections).length;
  let score = 0;
  if (state.submitted) {
    mcqs.forEach((m) => {
      if (state.selections[m.id] === m.correctIndex) score += 1;
    });
  }
  const percentage = mcqs.length ? Math.round((score / mcqs.length) * 100) : 0;

  return `
    <div class="flex-col gap-5">
      <div class="card">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span class="badge badge-primary">Unit ${unit.unitNumber} MCQ Practice Test</span>
            <h2 style="font-size:1.3rem;margin-top:6px">${escapeHtml(unit.title)} — ${mcqs.length} Objective Questions</h2>
            <p class="text-muted" style="font-size:0.86rem;margin-top:4px">Select one option per question, then click Submit Test to see your score, percentage, and explanations.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge">${answeredCount}/${mcqs.length} Answered</span>
            ${
              state.submitted
                ? `<button class="btn btn-secondary btn-sm" data-action="unit-mcq-retake">${icon('rotateCcw', 'icon-sm')} Retake Test</button>`
                : `<button class="btn btn-primary btn-sm" data-action="unit-mcq-submit">${icon('checkCircle', 'icon-sm')} Submit Test</button>`
            }
          </div>
        </div>

        ${
          state.submitted
            ? `
              <div class="mt-4 card-muted" style="border-color:${percentage >= 70 ? 'var(--emerald-border)' : 'var(--amber-border)'};background:${percentage >= 70 ? 'var(--emerald-soft)' : 'var(--amber-soft)'}">
                <div class="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <strong style="font-size:1.1rem">Your Score: ${score} / ${mcqs.length} (${percentage}%)</strong>
                    <p class="text-secondary" style="font-size:0.86rem;margin-top:3px">
                      ${percentage >= 80 ? 'Excellent mastery! You are exam-ready for this unit.' : percentage >= 60 ? 'Good effort! Review the highlighted red answers below.' : 'Keep revising the notes and retake this MCQ test.'}
                    </p>
                  </div>
                  <button class="btn btn-primary btn-sm" data-action="unit-mcq-retake">
                    ${icon('rotateCcw', 'icon-sm')} Retake Test
                  </button>
                </div>
              </div>
            `
            : ''
        }
      </div>

      <div class="flex-col gap-4">
        ${mcqs
          .map((m, idx) => {
            const selected = state.selections[m.id];
            const isCorrect = state.submitted && selected === m.correctIndex;
            const isWrong = state.submitted && selected !== undefined && selected !== m.correctIndex;

            return `
              <div class="card">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="badge">Q${idx + 1}</span>
                    <span class="badge ${m.difficulty === 'Hard' ? 'badge-rose' : m.difficulty === 'Medium' ? 'badge-amber' : 'badge-emerald'}">${escapeHtml(m.difficulty || 'Core')}</span>
                  </div>
                  ${
                    state.submitted
                      ? isCorrect
                        ? `<span class="badge badge-emerald">${icon('check', 'icon-sm')} Correct</span>`
                        : isWrong
                        ? `<span class="badge badge-rose">Incorrect</span>`
                        : `<span class="badge badge-amber">Unanswered</span>`
                      : ''
                  }
                </div>

                <h4 style="font-size:1rem;margin-bottom:12px">${escapeHtml(m.questionText)}</h4>

                <div class="flex-col gap-2">
                  ${(m.options || [])
                    .map((opt, optIdx) => {
                      let cls = 'mcq-option';
                      if (state.submitted) {
                        if (optIdx === m.correctIndex) cls += ' correct';
                        else if (selected === optIdx && optIdx !== m.correctIndex) cls += ' wrong';
                      } else if (selected === optIdx) {
                        cls += ' selected';
                      }

                      return `
                        <button
                          type="button"
                          class="${cls}"
                          ${state.submitted ? 'disabled' : ''}
                          data-action="unit-mcq-select"
                          data-mcq-id="${m.id}"
                          data-opt-idx="${optIdx}"
                        >
                          <span class="mcq-radio">${LETTERS[optIdx] || optIdx + 1}</span>
                          <span>${escapeHtml(opt)}</span>
                        </button>
                      `;
                    })
                    .join('')}
                </div>

                ${
                  state.submitted && m.explanation
                    ? `
                      <div class="mt-3 card-muted" style="font-size:0.85rem">
                        <strong>Explanation:</strong> ${escapeHtml(m.explanation)}
                      </div>
                    `
                    : ''
                }
              </div>
            `;
          })
          .join('')}
      </div>

      ${
        !state.submitted
          ? `
            <div class="flex justify-center">
              <button class="btn btn-primary btn-lg" data-action="unit-mcq-submit">
                ${icon('checkCircle')} Submit Unit ${unit.unitNumber} Test (${answeredCount}/${mcqs.length} Answered)
              </button>
            </div>
          `
          : ''
      }
    </div>
  `;
}

export function stopPracticeTimer() {
  if (store.practiceTest.timerId) {
    clearInterval(store.practiceTest.timerId);
    store.practiceTest.timerId = null;
  }
}

export function startPracticeSession() {
  stopPracticeTimer();
  const pt = store.practiceTest;
  let pool = [];
  if (pt.unitScope === 'all') {
    pool = getAllMcqs();
  } else {
    const unit = getUnitByNumber(Number(pt.unitScope));
    pool = (unit?.mcqs || []).map((m) => ({ ...m, unitNumber: unit.unitNumber }));
  }

  if (pool.length === 0) {
    showToast('No MCQs found for the selected scope.');
    return;
  }

  pt.questions = pool;
  pt.answers = {};
  pt.currentIndex = 0;
  pt.active = true;
  pt.submitted = false;
  pt.elapsedSeconds = 0;
  pt.remainingSeconds = pt.mode === 'timed' ? pool.length * 45 : 0;

  pt.timerId = setInterval(() => {
    pt.elapsedSeconds += 1;
    if (pt.mode === 'timed') {
      pt.remainingSeconds -= 1;
      if (pt.remainingSeconds <= 0) {
        submitPracticeSession();
        return;
      }
    }
    const timerEl = document.getElementById('practice-timer-display');
    if (timerEl) {
      timerEl.textContent =
        pt.mode === 'timed' ? formatTimer(pt.remainingSeconds) : formatTimer(pt.elapsedSeconds);
    }
  }, 1000);

  notify();
}

export function submitPracticeSession() {
  stopPracticeTimer();
  const pt = store.practiceTest;
  if (!pt.active || pt.submitted) return;
  pt.submitted = true;

  let score = 0;
  pt.questions.forEach((q) => {
    if (pt.answers[q.id] === q.correctIndex) score += 1;
  });

  saveQuizAttempt({
    unitNumber: pt.unitScope === 'all' ? null : Number(pt.unitScope),
    mode: pt.mode,
    score,
    total: pt.questions.length,
    durationSeconds: pt.elapsedSeconds,
  });

  showToast(`Test submitted! Score: ${score}/${pt.questions.length}`);
  notify();
}

export function renderPracticeTestsPage() {
  const { units } = store.catalog;
  const pt = store.practiceTest;
  const attempts = store.studentState.quizAttempts || [];

  if (pt.active && !pt.submitted) {
    const current = pt.questions[pt.currentIndex];
    const selected = pt.answers[current.id];
    const answeredCount = Object.keys(pt.answers).length;

    return `
      <div class="flex-col gap-5">
        <div class="card flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <span class="badge badge-primary">${pt.mode === 'timed' ? 'Timed Mock Exam' : 'Practice Mode'}</span>
            <span class="badge">Question ${pt.currentIndex + 1} of ${pt.questions.length}</span>
            <span class="badge">${answeredCount} Answered</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="badge ${pt.mode === 'timed' ? 'badge-rose' : 'badge-indigo'} font-mono">
              ${icon('clock', 'icon-sm')} <span id="practice-timer-display">${pt.mode === 'timed' ? formatTimer(pt.remainingSeconds) : formatTimer(pt.elapsedSeconds)}</span>
            </span>
            <button class="btn btn-primary btn-sm" data-action="practice-submit">Finish &amp; Submit</button>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center gap-2 mb-3">
            ${current.unitNumber ? `<span class="badge badge-primary">Unit ${current.unitNumber}</span>` : ''}
            <span class="badge">${escapeHtml(current.difficulty || 'Core')}</span>
          </div>
          <h2 style="font-size:1.2rem;margin-bottom:16px">${escapeHtml(current.questionText)}</h2>

          <div class="flex-col gap-3">
            ${(current.options || [])
              .map(
                (opt, idx) => `
                <button
                  type="button"
                  class="mcq-option ${selected === idx ? 'selected' : ''}"
                  data-action="practice-select"
                  data-mcq-id="${current.id}"
                  data-opt-idx="${idx}"
                >
                  <span class="mcq-radio">${LETTERS[idx] || idx + 1}</span>
                  <span>${escapeHtml(opt)}</span>
                </button>
              `
              )
              .join('')}
          </div>

          <div class="flex items-center justify-between mt-6">
            <button class="btn btn-secondary" ${pt.currentIndex === 0 ? 'disabled' : ''} data-action="practice-jump" data-idx="${pt.currentIndex - 1}">
              ${icon('arrowLeft', 'icon-sm')} Previous
            </button>
            ${
              pt.currentIndex < pt.questions.length - 1
                ? `<button class="btn btn-primary" data-action="practice-jump" data-idx="${pt.currentIndex + 1}">
                    Next ${icon('arrowRight', 'icon-sm')}
                  </button>`
                : `<button class="btn btn-emerald" data-action="practice-submit">
                    ${icon('checkCircle', 'icon-sm')} Submit Test
                  </button>`
            }
          </div>
        </div>

        <!-- Question Palette -->
        <div class="card">
          <h4 style="font-size:0.86rem;margin-bottom:10px">Question Navigator</h4>
          <div class="flex flex-wrap gap-2">
            ${pt.questions
              .map((q, idx) => {
                const isCurrent = idx === pt.currentIndex;
                const isAnswered = pt.answers[q.id] !== undefined;
                const cls = isCurrent ? 'btn-primary' : isAnswered ? 'btn-soft' : 'btn-secondary';
                return `<button class="btn btn-sm ${cls}" style="min-width:38px" data-action="practice-jump" data-idx="${idx}">${idx + 1}</button>`;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (pt.active && pt.submitted) {
    let score = 0;
    pt.questions.forEach((q) => {
      if (pt.answers[q.id] === q.correctIndex) score += 1;
    });
    const pct = pt.questions.length ? Math.round((score / pt.questions.length) * 100) : 0;

    return `
      <div class="flex-col gap-5">
        <div class="card" style="background:var(--primary-soft);border-color:var(--primary-border)">
          <div class="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span class="badge badge-primary">Exam Evaluation Summary</span>
              <h1 style="font-size:1.75rem;margin-top:8px">Score: ${score} / ${pt.questions.length} (${pct}%)</h1>
              <p class="text-secondary mt-1">Completed in ${formatTimer(pt.elapsedSeconds)} · ${pct >= 75 ? 'Distinction Performance' : pct >= 50 ? 'Passing Performance — Review missed answers below' : 'Needs Revision'}</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn btn-primary" data-action="practice-start">${icon('rotateCcw', 'icon-sm')} Retake Test</button>
              <button class="btn btn-secondary" data-action="practice-exit">Back to Setup</button>
            </div>
          </div>
        </div>

        <div class="flex-col gap-4">
          ${pt.questions
            .map((q, idx) => {
              const sel = pt.answers[q.id];
              const ok = sel === q.correctIndex;
              return `
                <div class="card">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <span class="badge">Q${idx + 1} · Unit ${q.unitNumber || ''}</span>
                    <span class="badge ${ok ? 'badge-emerald' : 'badge-rose'}">${ok ? 'Correct' : 'Incorrect'}</span>
                  </div>
                  <h4 style="font-size:0.98rem;margin-bottom:10px">${escapeHtml(q.questionText)}</h4>
                  <div class="flex-col gap-2">
                    ${(q.options || [])
                      .map((opt, optIdx) => {
                        let cls = 'mcq-option';
                        if (optIdx === q.correctIndex) cls += ' correct';
                        else if (sel === optIdx) cls += ' wrong';
                        return `
                          <div class="${cls}">
                            <span class="mcq-radio">${LETTERS[optIdx] || optIdx + 1}</span>
                            <span>${escapeHtml(opt)}</span>
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                  ${q.explanation ? `<div class="card-muted mt-3" style="font-size:0.84rem"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>` : ''}
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  }

  return `
    <div class="flex-col gap-6">
      <div>
        <span class="badge badge-primary">Exam Simulator &amp; MCQ Center</span>
        <h1 style="font-size:1.65rem;margin-top:6px">Practice Tests &amp; Timed Mock Exams</h1>
        <p class="text-muted mt-1">Test your university exam preparation across individual units or the complete 5-unit Web Technology syllabus.</p>
      </div>

      <div class="grid-2 items-start">
        <div class="card flex-col gap-4">
          <h3 style="font-size:1.15rem">Configure New Test Session</h3>

          <div>
            <label class="label" for="pt-unit-scope">Select Syllabus Scope</label>
            <select id="pt-unit-scope" class="select" data-change-action="practice-scope">
              <option value="all" ${pt.unitScope === 'all' ? 'selected' : ''}>All 5 Units Full Syllabus (${getAllMcqs().length} MCQs)</option>
              ${(units || [])
                .map(
                  (u) =>
                    `<option value="${u.unitNumber}" ${String(pt.unitScope) === String(u.unitNumber) ? 'selected' : ''}>Unit ${u.unitNumber}: ${escapeHtml(u.title)} (${(u.mcqs || []).length} MCQs)</option>`
                )
                .join('')}
            </select>
          </div>

          <div>
            <span class="label">Select Exam Mode</span>
            <div class="grid-2" style="gap:10px">
              <button
                type="button"
                class="card-muted ${pt.mode === 'practice' ? '' : ''}"
                style="text-align:left;border-color:${pt.mode === 'practice' ? 'var(--primary)' : 'var(--border)'};background:${pt.mode === 'practice' ? 'var(--primary-soft)' : 'var(--surface-subtle)'}"
                data-action="practice-mode"
                data-mode="practice"
              >
                <strong style="font-size:0.9rem">Practice Mode</strong>
                <div class="text-muted" style="font-size:0.78rem;margin-top:4px">Untimed stopwatch with detailed answer review after submission.</div>
              </button>
              <button
                type="button"
                class="card-muted"
                style="text-align:left;border-color:${pt.mode === 'timed' ? 'var(--primary)' : 'var(--border)'};background:${pt.mode === 'timed' ? 'var(--primary-soft)' : 'var(--surface-subtle)'}"
                data-action="practice-mode"
                data-mode="timed"
              >
                <strong style="font-size:0.9rem">Timed Mock Exam</strong>
                <div class="text-muted" style="font-size:0.78rem;margin-top:4px">45 seconds per question with automatic submission when time ends.</div>
              </button>
            </div>
          </div>

          <button class="btn btn-primary btn-lg mt-2" data-action="practice-start">
            ${icon('zap')} Start Test Now
          </button>
        </div>

        <div class="card">
          <h3 style="font-size:1.15rem;margin-bottom:12px">Recent Attempt History</h3>
          ${
            attempts.length > 0
              ? `<div class="table-wrap">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Scope</th>
                        <th>Mode</th>
                        <th>Score</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${attempts
                        .slice(0, 8)
                        .map((a) => {
                          const pct = a.total > 0 ? Math.round((a.score / a.total) * 100) : 0;
                          return `
                            <tr>
                              <td>${a.unitNumber ? `Unit ${a.unitNumber}` : 'All Units'}</td>
                              <td>${escapeHtml(a.mode || 'practice')}</td>
                              <td><span class="badge ${pct >= 70 ? 'badge-emerald' : 'badge-amber'}">${a.score}/${a.total} (${pct}%)</span></td>
                              <td class="font-mono">${formatTimer(a.durationSeconds || 0)}</td>
                            </tr>
                          `;
                        })
                        .join('')}
                    </tbody>
                  </table>
                </div>`
              : `<div class="card-muted text-center" style="padding:32px">
                  <p class="text-muted" style="font-size:0.86rem">No completed tests yet. Start your first MCQ session to record your progress!</p>
                </div>`
          }
        </div>
      </div>
    </div>
  `;
}
