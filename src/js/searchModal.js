import { icon } from './icons.js';
import { getAllDiagrams, getAllQuestions, store } from './state.js';
import { escapeHtml } from './utils.js';

export function renderSearchModal() {
  if (!store.searchOpen) return '';
  const q = (store.searchQuery || '').trim().toLowerCase();
  const units = store.catalog.units || [];

  const matchedTopics = [];
  units.forEach((u) => {
    (u.topics || []).forEach((t) => {
      if (!q || `${t.title} ${t.definition}`.toLowerCase().includes(q)) {
        matchedTopics.push({ ...t, unitNumber: u.unitNumber, unitTitle: u.title });
      }
    });
  });

  const matchedQuestions = getAllQuestions().filter(
    (item) => !q || `${item.questionText} ${(item.keywords || []).join(' ')}`.toLowerCase().includes(q)
  );

  const matchedDiagrams = getAllDiagrams().filter(
    (item) => !q || `${item.title} ${item.summary} ${item.category}`.toLowerCase().includes(q)
  );

  return `
    <div class="modal-overlay no-print" data-action="close-search-backdrop">
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="modal-header">
          <div class="flex items-center gap-2" style="flex:1">
            ${icon('search')}
            <input
              id="global-search-input"
              type="search"
              class="input"
              style="border:none;box-shadow:none;padding:4px 6px"
              placeholder="Search notes, 2/5/10-mark questions, protocols, or diagrams..."
              value="${escapeHtml(store.searchQuery || '')}"
              data-input-action="global-search"
              autofocus
            />
          </div>
          <button class="btn-icon" data-action="close-search" title="Close (Esc)">${icon('x', 'icon-sm')}</button>
        </div>

        <div class="modal-body flex-col gap-5">
          <div>
            <div class="nav-section-title" style="padding-left:0">Study Notes (${matchedTopics.length})</div>
            <div class="flex-col gap-2">
              ${matchedTopics
                .slice(0, 5)
                .map(
                  (t) => `
                  <button class="card-muted flex items-center justify-between gap-3" style="padding:10px 14px;text-align:left;width:100%" data-action="search-jump-topic" data-unit="${t.unitNumber}" data-topic-id="${t.id}">
                    <div>
                      <div style="font-size:0.88rem;font-weight:600">${escapeHtml(t.title)}</div>
                      <div class="text-muted" style="font-size:0.75rem">Unit ${t.unitNumber} · ${escapeHtml(t.unitTitle)}</div>
                    </div>
                    <span class="badge badge-primary">Note</span>
                  </button>
                `
                )
                .join('') || `<p class="text-muted" style="font-size:0.82rem">No matching notes.</p>`}
            </div>
          </div>

          <div>
            <div class="nav-section-title" style="padding-left:0">Important Questions (${matchedQuestions.length})</div>
            <div class="flex-col gap-2">
              ${matchedQuestions
                .slice(0, 5)
                .map(
                  (item) => `
                  <button class="card-muted flex items-center justify-between gap-3" style="padding:10px 14px;text-align:left;width:100%" data-action="search-jump-question" data-unit="${item.unitNumber}" data-question-id="${item.id}">
                    <div>
                      <div style="font-size:0.86rem;font-weight:600">${escapeHtml(item.questionText)}</div>
                      <div class="text-muted" style="font-size:0.75rem">Unit ${item.unitNumber} · ${item.marks} Marks</div>
                    </div>
                    <span class="badge badge-amber">${item.marks}M</span>
                  </button>
                `
                )
                .join('') || `<p class="text-muted" style="font-size:0.82rem">No matching questions.</p>`}
            </div>
          </div>

          <div>
            <div class="nav-section-title" style="padding-left:0">Technical Diagrams (${matchedDiagrams.length})</div>
            <div class="flex-col gap-2">
              ${matchedDiagrams
                .slice(0, 4)
                .map(
                  (d) => `
                  <button class="card-muted flex items-center justify-between gap-3" style="padding:10px 14px;text-align:left;width:100%" data-action="search-jump-diagram" data-diagram-key="${escapeHtml(d.diagramKey)}">
                    <div>
                      <div style="font-size:0.86rem;font-weight:600">${escapeHtml(d.title)}</div>
                      <div class="text-muted" style="font-size:0.75rem">Unit ${d.unitNumber} · ${escapeHtml(d.category)}</div>
                    </div>
                    <span class="badge badge-emerald">Diagram</span>
                  </button>
                `
                )
                .join('') || `<p class="text-muted" style="font-size:0.82rem">No matching diagrams.</p>`}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
