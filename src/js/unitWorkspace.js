import { renderInteractiveDiagramCard } from './diagrams.js';
import { icon } from './icons.js';
import { renderEmbeddedUnitMcq } from './practiceTests.js';
import { renderQuestionList } from './questions.js';
import { findDiagramByKey, getActiveUnit, store } from './state.js';
import { escapeHtml, toParagraphs } from './utils.js';

const UNIT_1_FULL_FORMS = [
  { abbr: 'ARPANET', full: 'Advanced Research Projects Agency Network' },
  { abbr: 'WWW', full: 'World Wide Web' },
  { abbr: 'HTML', full: 'HyperText Markup Language' },
  { abbr: 'HTTP / HTTPS', full: 'HyperText Transfer Protocol (Secure)' },
  { abbr: 'URL / URI', full: 'Uniform Resource Locator / Identifier' },
  { abbr: 'SMTP', full: 'Simple Mail Transfer Protocol' },
  { abbr: 'POP3', full: 'Post Office Protocol Version 3' },
  { abbr: 'IMAP', full: 'Internet Message Access Protocol' },
  { abbr: 'MIME', full: 'Multipurpose Internet Mail Extensions' },
  { abbr: 'DNS', full: 'Domain Name System / Domain Name Server' },
  { abbr: 'TCP / IP', full: 'Transmission Control Protocol / Internet Protocol' },
  { abbr: 'ISP', full: 'Internet Service Provider' },
];

const UNIT_1_PROTOCOLS = [
  { name: 'HTTP / HTTPS', port: '80 / 443', purpose: 'Stateless request-response transfer of web pages, JSON, and media.' },
  { name: 'SMTP', port: '25 / 587', purpose: 'Push protocol used to send and relay outgoing email between mail servers.' },
  { name: 'POP3', port: '110 / 995', purpose: 'Downloads emails from server to a single local device (usually deletes copy).' },
  { name: 'IMAP', port: '143 / 993', purpose: 'Synchronizes email folders across multiple devices directly on the server.' },
  { name: 'MIME', port: 'Header Std', purpose: 'Extends ASCII email to carry attachments, Unicode text, HTML, images, and audio.' },
  { name: 'DNS', port: '53 (UDP/TCP)', purpose: 'Translates human-readable domain names (e.g., examtips.edu) into IP addresses.' },
];

function renderComparisonTable(table) {
  if (!table || !table.headers || !table.rows) return '';
  const heading = table.caption || table.title;
  return `
    <div class="mt-4 print-break-inside-avoid">
      ${heading ? `<h4 style="font-size:0.95rem;margin-bottom:8px">${escapeHtml(heading)}</h4>` : ''}
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>${table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${table.rows
              .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderTopicArticle(topic, unit, topicIndex, totalTopics, isFullPrint = false) {
  const student = store.studentState;
  const isCompleted = student.completedTopicIds.includes(topic.id);
  const isBookmarked = student.bookmarkedTopicIds.includes(topic.id);
  const linkedDiagram = topic.diagramKey ? findDiagramByKey(topic.diagramKey) : null;
  const topics = unit.topics || [];
  const prevTopic = topicIndex > 0 ? topics[topicIndex - 1] : null;
  const nextTopic = topicIndex < totalTopics - 1 ? topics[topicIndex + 1] : null;

  return `
    <article class="card flex-col gap-5 ${isFullPrint && topicIndex > 0 ? 'print-page-break' : ''}">
      <div class="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div class="flex items-center gap-2 flex-wrap mb-2">
            <span class="badge badge-primary">Unit ${unit.unitNumber} · Topic ${topicIndex + 1} of ${totalTopics}</span>
            ${isCompleted ? `<span class="badge badge-emerald">${icon('checkCircle', 'icon-sm')} Completed</span>` : ''}
          </div>
          <h2 style="font-size:1.45rem">${escapeHtml(topic.title)}</h2>
        </div>

        ${
          !isFullPrint
            ? `
              <div class="flex items-center gap-2 flex-wrap no-print">
                <button class="btn btn-sm ${isCompleted ? 'btn-emerald' : 'btn-secondary'}" data-action="toggle-topic-complete" data-topic-id="${topic.id}">
                  ${icon('checkCircle', 'icon-sm')} ${isCompleted ? 'Completed' : 'Mark Complete'}
                </button>
                <button class="btn btn-sm ${isBookmarked ? 'btn-soft' : 'btn-secondary'}" data-action="toggle-bookmark" data-item-type="topic" data-item-id="${topic.id}">
                  ${icon('bookmark', 'icon-sm')} ${isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
                <button class="btn btn-sm btn-soft" data-action="print-topic">
                  ${icon('printer', 'icon-sm')} Print to PDF
                </button>
                <button class="btn btn-sm btn-secondary" data-action="print-full-unit">
                  ${icon('fileText', 'icon-sm')} Full Unit PDF
                </button>
              </div>
            `
            : ''
        }
      </div>

      <!-- Definition Callout -->
      <div class="answer-block" style="background:var(--primary-soft);border-color:var(--primary-border)">
        <div class="answer-heading">Exam-Ready Definition</div>
        <p style="font-size:0.96rem;font-weight:500">${escapeHtml(topic.definition)}</p>
      </div>

      <!-- Core Explanation -->
      <div>
        <h3 style="font-size:1.05rem;margin-bottom:10px">Detailed Concept Explanation</h3>
        <div class="flex-col gap-3">
          ${toParagraphs(topic.explanation)
            .map((para) => `<p class="text-secondary" style="font-size:0.93rem">${escapeHtml(para)}</p>`)
            .join('')}
        </div>
      </div>

      <!-- Examples / Code Snippets -->
      ${
        (topic.examples || []).length > 0
          ? `
            <div>
              <h3 style="font-size:1.05rem;margin-bottom:10px">Examples &amp; Syntax</h3>
              <div class="flex-col gap-3">
                ${topic.examples
                  .map((ex, idx) => {
                    const isObj = ex && typeof ex === 'object';
                    const title = isObj ? ex.title || `Example ${idx + 1}` : `Example ${idx + 1}`;
                    const lang = isObj ? ex.language || 'code' : 'example';
                    const code = isObj ? ex.code || ex.snippet || '' : String(ex);
                    return `
                    <div class="code-block print-break-inside-avoid">
                      <div class="code-block-header">
                        <span>${escapeHtml(title)} · ${escapeHtml(lang)}</span>
                        <button class="btn btn-ghost btn-sm no-print" style="color:#cbd5e1;padding:3px 8px" data-action="copy-code" data-code="${escapeHtml(code)}">
                          ${icon('copy', 'icon-sm')} Copy
                        </button>
                      </div>
                      <pre><code>${escapeHtml(code)}</code></pre>
                    </div>
                  `;
                  })
                  .join('')}
              </div>
            </div>
          `
          : ''
      }

      <!-- Comparison Table -->
      ${renderComparisonTable(topic.comparisonTable)}

      <!-- Linked Technical Diagram -->
      ${
        linkedDiagram
          ? `<div class="mt-2">${renderInteractiveDiagramCard(linkedDiagram, `topic-diag-${topic.id}${isFullPrint ? '-print' : ''}`)}</div>`
          : ''
      }

      <!-- Key Takeaways -->
      ${
        (topic.keyTakeaways || []).length > 0
          ? `
            <div class="answer-block" style="border-color:var(--emerald-border);background:var(--emerald-soft)">
              <div class="answer-heading text-emerald">Key Exam Takeaways</div>
              <ul class="bullet-list">
                ${topic.keyTakeaways.map((kt) => `<li>${escapeHtml(kt)}</li>`).join('')}
              </ul>
            </div>
          `
          : ''
      }

      <!-- Previous / Next Navigation -->
      ${
        !isFullPrint
          ? `
            <div class="flex items-center justify-between flex-wrap gap-3 mt-2 no-print" style="padding-top:16px;border-top:1px solid var(--border)">
              ${
                prevTopic
                  ? `<button class="btn btn-secondary btn-sm" data-action="select-topic" data-topic-id="${prevTopic.id}">
                      ${icon('arrowLeft', 'icon-sm')} ${escapeHtml(prevTopic.title)}
                    </button>`
                  : `<span></span>`
              }
              ${
                nextTopic
                  ? `<button class="btn btn-primary btn-sm" data-action="select-topic" data-topic-id="${nextTopic.id}">
                      ${escapeHtml(nextTopic.title)} ${icon('arrowRight', 'icon-sm')}
                    </button>`
                  : `<button class="btn btn-emerald btn-sm" data-action="set-unit-tab" data-tab="questions">
                      Practice Unit ${unit.unitNumber} Q&amp;As ${icon('arrowRight', 'icon-sm')}
                    </button>`
              }
            </div>
          `
          : ''
      }
    </article>
  `;
}

export function renderUnitWorkspacePage() {
  const unit = getActiveUnit();
  if (!unit) {
    return `<div class="card text-center" style="padding:40px"><p class="text-muted">Loading unit study material...</p></div>`;
  }

  const topics = unit.topics || [];
  const questions = (unit.questions || []).map((q) => ({ ...q, unitNumber: unit.unitNumber }));
  const diagrams = (unit.diagrams || []).map((d) => ({ ...d, unitNumber: unit.unitNumber }));
  const mcqs = unit.mcqs || [];
  const student = store.studentState;

  const doneCount = topics.filter((t) => student.completedTopicIds.includes(t.id)).length;
  const pct = topics.length ? Math.round((doneCount / topics.length) * 100) : 0;

  let activeTopic = topics.find((t) => t.id === store.activeTopicId) || topics[0] || null;
  if (activeTopic && store.activeTopicId !== activeTopic.id) {
    store.activeTopicId = activeTopic.id;
  }
  const activeTopicIndex = activeTopic ? topics.findIndex((t) => t.id === activeTopic.id) : 0;

  const tabs = [
    { key: 'overview', label: 'Unit Overview', iconName: 'layers' },
    { key: 'notes', label: `Complete Notes (${topics.length})`, iconName: 'bookOpen' },
    { key: 'questions', label: `Important Questions (${questions.length})`, iconName: 'helpCircle' },
    { key: 'diagrams', label: `Technical Diagrams (${diagrams.length})`, iconName: 'network' },
    { key: 'mcq', label: `MCQ Test (${mcqs.length})`, iconName: 'clipboardCheck' },
    { key: 'revision', label: 'Quick Revision', iconName: 'zap' },
    { key: 'download', label: 'Download / PDF', iconName: 'download' },
  ];

  const tab = store.activeUnitTab || 'overview';
  const isFullUnitPrint = store.printMode === 'full-unit';

  let tabContent = '';

  if (tab === 'overview') {
    tabContent = `
      <div class="grid-2 items-start">
        <div class="card">
          <h3 style="font-size:1.1rem;margin-bottom:12px">Official University Syllabus Topics</h3>
          <ol class="bullet-list" style="list-style:decimal">
            ${(unit.syllabus || []).map((item) => `<li><strong>${escapeHtml(item)}</strong></li>`).join('')}
          </ol>
          <div class="flex items-center gap-2 flex-wrap mt-6">
            <button class="btn btn-primary btn-sm" data-action="set-unit-tab" data-tab="notes">
              Start Reading Notes ${icon('arrowRight', 'icon-sm')}
            </button>
            <button class="btn btn-secondary btn-sm" data-action="set-unit-tab" data-tab="questions">
              Solve ${questions.length} Exam Questions
            </button>
          </div>
        </div>

        <div class="flex-col gap-4">
          <div class="card">
            <h3 style="font-size:1.05rem;margin-bottom:12px">Unit Study Breakdown</h3>
            <div class="grid-2" style="gap:12px">
              <div class="card-muted">
                <div class="stat-value" style="font-size:1.4rem">${topics.length}</div>
                <div class="stat-label">Structured Notes</div>
              </div>
              <div class="card-muted">
                <div class="stat-value" style="font-size:1.4rem">${questions.length}</div>
                <div class="stat-label">2/5/8/10M Q&amp;As</div>
              </div>
              <div class="card-muted">
                <div class="stat-value" style="font-size:1.4rem">${diagrams.length}</div>
                <div class="stat-label">SVG Diagrams</div>
              </div>
              <div class="card-muted">
                <div class="stat-value" style="font-size:1.4rem">${mcqs.length}</div>
                <div class="stat-label">Practice MCQs</div>
              </div>
            </div>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem;margin-bottom:10px">Quick Jump to Topics</h3>
            <div class="flex-col gap-2">
              ${topics
                .map(
                  (t, i) => `
                  <button class="topic-item" style="border:1px solid var(--border)" data-action="open-unit-topic" data-topic-id="${t.id}">
                    <span class="nav-unit-num">${i + 1}</span>
                    <span style="flex:1">${escapeHtml(t.title)}</span>
                    ${student.completedTopicIds.includes(t.id) ? `<span class="text-emerald">${icon('checkCircle', 'icon-sm')}</span>` : ''}
                  </button>
                `
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (tab === 'notes') {
    tabContent = `
      <div class="notes-layout ${isFullUnitPrint ? 'no-print' : ''}">
        <aside class="card no-print" style="padding:14px">
          <div class="flex items-center justify-between mb-3" style="padding:0 6px">
            <strong style="font-size:0.84rem">Unit ${unit.unitNumber} Topics</strong>
            <span class="badge">${doneCount}/${topics.length}</span>
          </div>
          <div class="topic-list">
            ${topics
              .map((t, i) => {
                const isActive = activeTopic && t.id === activeTopic.id;
                const isDone = student.completedTopicIds.includes(t.id);
                return `
                  <button class="topic-item ${isActive ? 'active' : ''}" data-action="select-topic" data-topic-id="${t.id}">
                    <span class="nav-unit-num">${i + 1}</span>
                    <span style="flex:1">${escapeHtml(t.title)}</span>
                    ${isDone ? `<span class="text-emerald">${icon('check', 'icon-sm')}</span>` : ''}
                  </button>
                `;
              })
              .join('')}
          </div>
        </aside>

        <div>
          ${activeTopic ? renderTopicArticle(activeTopic, unit, activeTopicIndex, topics.length, false) : ''}
        </div>
      </div>

      ${
        isFullUnitPrint
          ? `
            <div class="print-only flex-col gap-6">
              ${topics.map((t, idx) => renderTopicArticle(t, unit, idx, topics.length, true)).join('')}
            </div>
          `
          : ''
      }
    `;
  } else if (tab === 'questions') {
    tabContent = renderQuestionList(
      questions,
      store.unitQuestionFilter,
      store.unitQuestionSearch,
      'unit'
    );
  } else if (tab === 'diagrams') {
    tabContent = `
      <div class="flex-col gap-5">
        ${diagrams
          .map((d) => renderInteractiveDiagramCard(d, `unit-diag-${d.diagramKey}`))
          .join('')}
      </div>
    `;
  } else if (tab === 'mcq') {
    tabContent = renderEmbeddedUnitMcq(unit);
  } else if (tab === 'revision') {
    tabContent = `
      <div class="flex-col gap-5">
        <div class="card">
          <div class="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <span class="badge badge-amber">Last-Minute Exam Revision</span>
              <h2 style="font-size:1.35rem;margin-top:6px">Unit ${unit.unitNumber}: High-Yield Revision Bullets</h2>
            </div>
            <button class="btn btn-soft btn-sm no-print" data-action="print-topic">
              ${icon('printer', 'icon-sm')} Print Revision Sheet
            </button>
          </div>
          <ul class="bullet-list">
            ${(unit.quickRevision || []).map((pt) => `<li style="padding:4px 0">${escapeHtml(pt)}</li>`).join('')}
          </ul>
        </div>

        ${
          unit.unitNumber === 1
            ? `
              <div class="grid-2 items-start">
                <div class="card">
                  <h3 style="font-size:1.05rem;margin-bottom:12px">Unit 1 Important Full Forms</h3>
                  <div class="table-wrap">
                    <table class="data-table">
                      <thead><tr><th>Abbreviation</th><th>Full Form</th></tr></thead>
                      <tbody>
                        ${UNIT_1_FULL_FORMS.map(
                          (f) => `<tr><td class="font-mono"><strong>${escapeHtml(f.abbr)}</strong></td><td>${escapeHtml(f.full)}</td></tr>`
                        ).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="card">
                  <h3 style="font-size:1.05rem;margin-bottom:12px">Core Internet Protocols &amp; Ports</h3>
                  <div class="table-wrap">
                    <table class="data-table">
                      <thead><tr><th>Protocol</th><th>Port</th><th>Primary Role</th></tr></thead>
                      <tbody>
                        ${UNIT_1_PROTOCOLS.map(
                          (p) => `<tr><td><strong>${escapeHtml(p.name)}</strong></td><td class="font-mono">${escapeHtml(p.port)}</td><td>${escapeHtml(p.purpose)}</td></tr>`
                        ).join('')}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            `
            : ''
        }
      </div>
    `;
  } else if (tab === 'download') {
    tabContent = `
      <div class="grid-2">
        <div class="card flex-col justify-between gap-4">
          <div>
            <span class="badge badge-primary">A4 Paper Ready</span>
            <h3 style="font-size:1.2rem;margin-top:8px">Print Complete Unit ${unit.unitNumber} to PDF</h3>
            <p class="text-muted mt-2" style="font-size:0.88rem">
              Exports all ${topics.length} study notes, code blocks, comparison tables, and technical SVG diagrams formatted cleanly for A4 PDF printing.
            </p>
          </div>
          <button class="btn btn-primary" data-action="print-full-unit">
            ${icon('printer')} Print / Save Complete Unit ${unit.unitNumber} PDF
          </button>
        </div>

        <div class="card flex-col justify-between gap-4">
          <div>
            <span class="badge badge-emerald">Offline Plain Text</span>
            <h3 style="font-size:1.2rem;margin-top:8px">Download Complete Study Notes (.txt)</h3>
            <p class="text-muted mt-2" style="font-size:0.88rem">
              Downloads a lightweight offline revision file containing the full syllabus, ${topics.length} topic notes, ${questions.length} Q&amp;As, and quick revision bullets.
            </p>
          </div>
          <button class="btn btn-emerald" data-action="download-unit-txt">
            ${icon('download')} Download Unit_${unit.unitNumber}_Study_Material.txt
          </button>
        </div>
      </div>
    `;
  }

  return `
    <div class="flex-col gap-5">
      <!-- Print-Only Official Header -->
      <div class="print-only mb-4" style="border-bottom:2px solid #0f172a;padding-bottom:10px">
        <div style="font-size:10pt;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">EXAM TIPS – Web Technology Study Notes</div>
        <h1 style="font-size:18pt;margin-top:4px">Unit ${unit.unitNumber}: ${escapeHtml(unit.title)}</h1>
        <div style="font-size:10pt;color:#475569">${escapeHtml(unit.subtitle)} · ${escapeHtml(unit.examWeight)}</div>
      </div>

      <!-- Unit Hero Header -->
      <div class="card no-print">
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div class="flex items-center gap-2 flex-wrap mb-2">
              <span class="badge badge-primary">Course: Web Technology</span>
              <span class="badge badge-indigo">UNIT ${unit.unitNumber}</span>
              <span class="badge">${escapeHtml(unit.examWeight)}</span>
              <span class="badge">${unit.estimatedHours} hrs est.</span>
            </div>
            <h1 style="font-size:1.6rem">${escapeHtml(unit.title)}</h1>
            <p class="text-muted mt-1" style="max-width:720px;font-size:0.9rem">${escapeHtml(unit.description)}</p>
          </div>
          <div style="min-width:190px">
            <div class="flex justify-between" style="font-size:0.8rem;margin-bottom:6px">
              <span class="text-muted">Unit Progress</span>
              <strong>${pct}% (${doneCount}/${topics.length})</strong>
            </div>
            <div class="progress-track">
              <div class="progress-fill progress-fill-emerald" style="width:${pct}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Unit Workspace Navigation Tabs -->
      <div class="tab-bar no-print" role="tablist">
        ${tabs
          .map(
            (t) => `
            <button
              class="tab-btn ${tab === t.key ? 'active' : ''}"
              role="tab"
              aria-selected="${tab === t.key}"
              data-action="set-unit-tab"
              data-tab="${t.key}"
            >
              ${icon(t.iconName, 'icon-sm')} ${escapeHtml(t.label)}
            </button>
          `
          )
          .join('')}
      </div>

      <!-- Active Tab Content -->
      ${tabContent}
    </div>
  `;
}
