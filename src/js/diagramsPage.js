import { renderInteractiveDiagramCard } from './diagrams.js';
import { getAllDiagrams, store } from './state.js';
import { escapeHtml } from './utils.js';

export function renderDiagramsPage() {
  const { units } = store.catalog;
  const all = getAllDiagrams();
  const dp = store.diagramsPage;

  const categories = Array.from(new Set(all.map((d) => d.category).filter(Boolean))).sort();
  const q = (dp.search || '').trim().toLowerCase();

  const filtered = all.filter((d) => {
    if (dp.unitNumber !== 'all' && String(d.unitNumber) !== String(dp.unitNumber)) return false;
    if (dp.category !== 'all' && d.category !== dp.category) return false;
    if (q) {
      const hay = `${d.title} ${d.summary} ${d.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  return `
    <div class="flex-col gap-5">
      <div>
        <span class="badge badge-primary">Interactive Technical Diagrams</span>
        <h1 style="font-size:1.65rem;margin-top:6px">Architecture Diagrams &amp; Flowcharts (${all.length})</h1>
        <p class="text-muted mt-1">Click any step node or step button to trace packet flow, zoom in for inspection, or expand to fullscreen.</p>
      </div>

      <div class="card flex items-center justify-between flex-wrap gap-3 no-print">
        <div class="flex items-center gap-2 flex-wrap">
          <select class="select" style="width:auto" data-change-action="diag-unit-filter">
            <option value="all" ${dp.unitNumber === 'all' ? 'selected' : ''}>All Units (${all.length})</option>
            ${(units || [])
              .map(
                (u) =>
                  `<option value="${u.unitNumber}" ${String(dp.unitNumber) === String(u.unitNumber) ? 'selected' : ''}>Unit ${u.unitNumber}: ${escapeHtml(u.title)}</option>`
              )
              .join('')}
          </select>

          <select class="select" style="width:auto" data-change-action="diag-category-filter">
            <option value="all" ${dp.category === 'all' ? 'selected' : ''}>All Categories</option>
            ${categories
              .map(
                (cat) =>
                  `<option value="${escapeHtml(cat)}" ${dp.category === cat ? 'selected' : ''}>${escapeHtml(cat)}</option>`
              )
              .join('')}
          </select>
        </div>

        <input
          type="search"
          class="input"
          style="max-width:280px"
          placeholder="Search diagrams (HTTP, DNS, DOM...)"
          value="${escapeHtml(dp.search || '')}"
          data-input-action="diag-search"
        />
      </div>

      ${
        filtered.length > 0
          ? `<div class="flex-col gap-5">
              ${filtered
                .map((d) => renderInteractiveDiagramCard(d, `gallery-${d.diagramKey}`))
                .join('')}
            </div>`
          : `<div class="card text-center" style="padding:36px">
              <p class="text-muted">No diagrams matched your filters.</p>
            </div>`
      }
    </div>
  `;
}
