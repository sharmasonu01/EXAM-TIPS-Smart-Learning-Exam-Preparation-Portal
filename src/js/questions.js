import { renderInteractiveDiagramCard } from './diagrams.js';
import { icon } from './icons.js';
import { findDiagramByKey, getAllQuestions, store } from './state.js';
import { escapeHtml, toParagraphs } from './utils.js';

export function renderAnswerModeToggle() {
  const mode = store.answerMode;
  return `
    <div class="mode-toggle no-print" role="group" aria-label="Answer viewing mode">
      <button class="mode-btn ${mode === 'exam' ? 'active-exam' : ''}" data-action="set-answer-mode" data-mode="exam">
        ${icon('fileText', 'icon-sm')} Exam Mode (English)
      </button>
      <button class="mode-btn ${mode === 'learning' ? 'active-hinglish' : ''}" data-action="set-answer-mode" data-mode="learning">
        ${icon('languages', 'icon-sm')} Learning Mode (Hinglish)
      </button>
    </div>
  `;
}

export function renderQuestionCard(q, index) {
  const student = store.studentState;
  const isExpanded = Boolean(store.expandedQuestionIds[q.id]);
  const isBookmarked = student.bookmarkedQuestionIds.includes(q.id);
  const isImportant = student.importantQuestionIds.includes(q.id);
  const isCompleted = student.completedQuestionIds.includes(q.id);
  const isPrintTarget = store.printMode === 'single-question' && store.printQuestionId === q.id;
  const hideInSinglePrint = store.printMode === 'single-question' && store.printQuestionId !== q.id;

  const showAnswer = isExpanded || isPrintTarget;
  const mode = store.answerMode;
  const hasHinglish = Boolean((q.hinglishExplanation || '').trim());
  const linkedDiagram = q.diagramKey ? findDiagramByKey(q.diagramKey) : null;

  const marksTone =
    q.marks >= 8 ? 'badge-rose' : q.marks >= 5 ? 'badge-amber' : 'badge-primary';

  return `
    <article
      class="question-card ${isCompleted ? 'completed' : ''} ${isImportant ? 'important' : ''} ${hideInSinglePrint ? 'no-print' : ''}"
      data-question-id="${q.id}"
    >
      <div class="flex items-start justify-between gap-3 flex-wrap">
        <div style="flex:1;min-width:240px">
          <div class="flex items-center gap-2 flex-wrap mb-2">
            <span class="badge">Q${index + 1}</span>
            <span class="badge ${marksTone}">${q.marks} Marks</span>
            <span class="badge">Section ${escapeHtml(q.section)}</span>
            ${q.practiceBadge ? `<span class="badge badge-indigo">${escapeHtml(q.practiceBadge)}</span>` : ''}
            ${q.unitNumber ? `<span class="badge">Unit ${q.unitNumber}</span>` : ''}
            ${hasHinglish ? `<span class="badge badge-emerald">Bilingual</span>` : ''}
            ${isImportant ? `<span class="badge badge-amber">${icon('star', 'icon-sm')} Important</span>` : ''}
            ${isCompleted ? `<span class="badge badge-emerald">${icon('check', 'icon-sm')} Completed</span>` : ''}
          </div>
          <h3 style="font-size:1.06rem">${escapeHtml(q.questionText)}</h3>
        </div>

        <button
          class="btn ${showAnswer ? 'btn-secondary' : 'btn-primary'} btn-sm no-print"
          data-action="toggle-question-answer"
          data-question-id="${q.id}"
        >
          ${icon(showAnswer ? 'eyeOff' : 'eye', 'icon-sm')}
          ${showAnswer ? 'Hide Answer' : 'Show Answer'}
        </button>
      </div>

      <!-- Interactive Per-Question Action Bar -->
      <div class="flex items-center gap-2 flex-wrap mt-3 no-print">
        <button class="btn btn-sm ${isBookmarked ? 'btn-soft' : 'btn-ghost'}" data-action="toggle-bookmark" data-item-type="question" data-item-id="${q.id}">
          ${icon('bookmark', 'icon-sm')} ${isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
        <button class="btn btn-sm ${isImportant ? 'btn-soft' : 'btn-ghost'}" data-action="toggle-question-flag" data-flag="important" data-question-id="${q.id}">
          ${icon('star', 'icon-sm')} ${isImportant ? 'Important' : 'Mark Important'}
        </button>
        <button class="btn btn-sm ${isCompleted ? 'btn-emerald' : 'btn-ghost'}" data-action="toggle-question-flag" data-flag="completed" data-question-id="${q.id}">
          ${icon('checkCircle', 'icon-sm')} ${isCompleted ? 'Completed' : 'Mark Completed'}
        </button>
        <button class="btn btn-sm btn-ghost" data-action="copy-question" data-question-id="${q.id}">
          ${icon('copy', 'icon-sm')} Copy Answer
        </button>
        <button class="btn btn-sm btn-ghost" data-action="print-question" data-question-id="${q.id}">
          ${icon('printer', 'icon-sm')} Print / PDF
        </button>
        <button class="btn btn-sm btn-ghost" data-action="download-question" data-question-id="${q.id}">
          ${icon('download', 'icon-sm')} Download .txt
        </button>
      </div>

      ${
        showAnswer
          ? `
          <div class="answer-panel">
            ${
              mode === 'learning' && hasHinglish
                ? `
                  <div class="answer-block answer-block-hinglish">
                    <div class="answer-heading">${icon('languages', 'icon-sm')} Learning Mode — Easy Hinglish Explanation</div>
                    ${q.hinglishIntro ? `<p style="font-weight:600;margin-bottom:8px">${escapeHtml(q.hinglishIntro)}</p>` : ''}
                    <p style="white-space:pre-line;font-size:0.92rem">${escapeHtml(q.hinglishExplanation)}</p>
                    ${
                      q.hinglishExample
                        ? `<div class="mt-3" style="padding:10px 12px;border-radius:8px;background:var(--surface);border:1px solid var(--amber-border);font-size:0.86rem">
                            <strong>Real-Life Example:</strong> ${escapeHtml(q.hinglishExample)}
                          </div>`
                        : ''
                    }
                    ${
                      q.hinglishConclusion
                        ? `<p class="mt-3" style="font-size:0.86rem"><strong>Exam Yaad Rakhne Ka Tip:</strong> ${escapeHtml(q.hinglishConclusion)}</p>`
                        : ''
                    }
                  </div>
                `
                : `
                  ${
                    mode === 'learning' && !hasHinglish
                      ? `<div class="badge badge-amber">Hinglish notes available on Unit 1 — showing structured Exam English answer below.</div>`
                      : ''
                  }
                  <div class="answer-block">
                    <div class="answer-heading">1. Introduction</div>
                    <p style="font-size:0.92rem;color:var(--text-secondary)">${escapeHtml(q.introduction)}</p>
                  </div>

                  <div class="answer-block">
                    <div class="answer-heading">2. Detailed Exam Explanation</div>
                    <ul class="bullet-list">
                      ${toParagraphs(q.mainExplanation).map((pt) => `<li>${escapeHtml(pt)}</li>`).join('')}
                    </ul>
                  </div>

                  ${
                    toParagraphs(q.examples).length > 0
                      ? `
                        <div class="answer-block">
                          <div class="answer-heading">3. Relevant Examples</div>
                          <ul class="bullet-list">
                            ${toParagraphs(q.examples).map((ex) => `<li>${escapeHtml(ex)}</li>`).join('')}
                          </ul>
                        </div>
                      `
                      : ''
                  }

                  ${
                    (q.advantages || []).length > 0 || (q.disadvantages || []).length > 0
                      ? `
                        <div class="grid-2">
                          ${
                            (q.advantages || []).length > 0
                              ? `
                                <div class="answer-block" style="border-color:var(--emerald-border)">
                                  <div class="answer-heading text-emerald">Advantages</div>
                                  <ul class="bullet-list">
                                    ${q.advantages.map((a) => `<li>${escapeHtml(a)}</li>`).join('')}
                                  </ul>
                                </div>
                              `
                              : ''
                          }
                          ${
                            (q.disadvantages || []).length > 0
                              ? `
                                <div class="answer-block" style="border-color:var(--rose-border)">
                                  <div class="answer-heading text-rose">Limitations / Disadvantages</div>
                                  <ul class="bullet-list">
                                    ${q.disadvantages.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}
                                  </ul>
                                </div>
                              `
                              : ''
                          }
                        </div>
                      `
                      : ''
                  }

                  <div class="answer-block" style="border-color:var(--primary-border);background:var(--primary-soft)">
                    <div class="answer-heading">Conclusion</div>
                    <p style="font-size:0.9rem">${escapeHtml(q.conclusion)}</p>
                  </div>
                `
            }

            ${
              linkedDiagram
                ? `<div class="mt-2">${renderInteractiveDiagramCard(linkedDiagram, `q-diag-${q.id}`)}</div>`
                : ''
            }

            ${
              (q.keywords || []).length > 0
                ? `
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-muted" style="font-size:0.76rem;font-weight:700;text-transform:uppercase">Exam Keywords:</span>
                    ${q.keywords.map((kw) => `<span class="badge badge-primary">${escapeHtml(kw)}</span>`).join('')}
                  </div>
                `
                : ''
            }
          </div>
        `
          : ''
      }
    </article>
  `;
}

export function renderQuestionList(questions, filterValue, searchValue, scopePrefix) {
  const bookmarkedIds = store.studentState.bookmarkedQuestionIds;
  const searchLower = (searchValue || '').trim().toLowerCase();

  const filtered = (questions || []).filter((q) => {
    if (filterValue === 'bookmarked' && !bookmarkedIds.includes(q.id)) return false;
    if (filterValue === '2' && q.marks !== 2) return false;
    if (filterValue === '5' && q.marks !== 5) return false;
    if (filterValue === '8' && q.marks !== 8) return false;
    if (filterValue === '10' && q.marks !== 10) return false;
    if (searchLower) {
      const hay = `${q.questionText} ${q.introduction} ${(q.keywords || []).join(' ')}`.toLowerCase();
      if (!hay.includes(searchLower)) return false;
    }
    return true;
  });

  const filters = [
    { key: 'all', label: `All (${questions.length})` },
    { key: '2', label: '2 Marks (Section A)' },
    { key: '5', label: '5 Marks (Section B)' },
    { key: '8', label: '8 Marks (Section C)' },
    { key: '10', label: '10 Marks (Section C)' },
    { key: 'bookmarked', label: 'Bookmarked' },
  ];

  return `
    <div class="flex-col gap-4">
      <div class="card no-print">
        <div class="flex items-center justify-between flex-wrap gap-3">
          ${renderAnswerModeToggle()}
          <div class="flex items-center gap-2 flex-wrap">
            <button class="btn btn-secondary btn-sm" data-action="expand-all-questions" data-scope="${escapeHtml(scopePrefix)}">
              ${icon('eye', 'icon-sm')} Expand All
            </button>
            <button class="btn btn-secondary btn-sm" data-action="collapse-all-questions">
              ${icon('eyeOff', 'icon-sm')} Collapse All
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between flex-wrap gap-3 mt-4">
          <div class="flex items-center gap-2 flex-wrap">
            ${filters
              .map(
                (f) => `
                <button
                  class="btn btn-sm ${filterValue === f.key ? 'btn-primary' : 'btn-secondary'}"
                  data-action="filter-questions"
                  data-scope="${escapeHtml(scopePrefix)}"
                  data-filter="${f.key}"
                >${escapeHtml(f.label)}</button>
              `
              )
              .join('')}
          </div>
          <input
            type="search"
            class="input"
            style="max-width:280px"
            placeholder="Search questions or keywords..."
            value="${escapeHtml(searchValue || '')}"
            data-input-action="search-questions"
            data-scope="${escapeHtml(scopePrefix)}"
          />
        </div>
      </div>

      ${
        filtered.length > 0
          ? `<div class="flex-col gap-4">
              ${filtered.map((q, idx) => renderQuestionCard(q, idx)).join('')}
            </div>`
          : `<div class="card text-center" style="padding:36px">
              <p class="text-muted">No questions match this filter. Try clearing the search or selecting All Marks.</p>
            </div>`
      }
    </div>
  `;
}

export function renderQuestionBankPage() {
  const { units } = store.catalog;
  const f = store.questionFilters;
  const all = getAllQuestions();
  const unitScoped =
    f.unitNumber === 'all' ? all : all.filter((q) => String(q.unitNumber) === String(f.unitNumber));

  return `
    <div class="flex-col gap-5">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span class="badge badge-primary">Complete University Question Bank</span>
          <h1 style="font-size:1.6rem;margin-top:6px">Important Exam Questions &amp; Answers</h1>
          <p class="text-muted mt-1">Structured 2-mark, 5-mark, 8-mark, and 10-mark answers with Exam English &amp; Learning Hinglish modes.</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap no-print">
          <label for="qb-unit-select" class="text-muted" style="font-size:0.82rem;font-weight:600">Unit:</label>
          <select id="qb-unit-select" class="select" style="width:auto" data-change-action="qb-unit-filter">
            <option value="all" ${f.unitNumber === 'all' ? 'selected' : ''}>All 5 Units (${all.length})</option>
            ${(units || [])
              .map(
                (u) =>
                  `<option value="${u.unitNumber}" ${String(f.unitNumber) === String(u.unitNumber) ? 'selected' : ''}>Unit ${u.unitNumber}: ${escapeHtml(u.title)} (${(u.questions || []).length})</option>`
              )
              .join('')}
          </select>
        </div>
      </div>

      ${renderQuestionList(unitScoped, f.marks, f.search, 'global')}
    </div>
  `;
}
