import { SCHEMATIC_SPECS } from './diagramConfigs.js';
import { icon } from './icons.js';
import { store } from './state.js';
import { escapeHtml } from './utils.js';

function getAnchorPoint(source, target) {
  const sx = source.x + source.w / 2;
  const sy = source.y + source.h / 2;
  const tx = target.x + target.w / 2;
  const ty = target.y + target.h / 2;
  const dx = tx - sx;
  const dy = ty - sy;

  if (Math.abs(dx) >= Math.abs(dy)) {
    return {
      x1: dx >= 0 ? source.x + source.w : source.x,
      y1: sy,
      x2: dx >= 0 ? target.x : target.x + target.w,
      y2: ty,
    };
  }
  return {
    x1: sx,
    y1: dy >= 0 ? source.y + source.h : source.y,
    x2: tx,
    y2: dy >= 0 ? target.y : target.y + target.h,
  };
}

export function renderTechnicalDiagramSvg(diagram, viewerId, activeStep = null) {
  const diagramKey = diagram.diagramKey || 'custom';
  const steps = diagram.steps || [];
  const spec = SCHEMATIC_SPECS[diagramKey];

  const nodes = spec
    ? spec.nodes
    : (steps.length > 0
        ? steps
        : [
            { step: 1, label: 'Input Layer', detail: 'Client / Source' },
            { step: 2, label: 'Processing', detail: 'Protocol / Logic' },
            { step: 3, label: 'Output Layer', detail: 'Delivery / Render' },
          ]
      )
        .slice(0, 4)
        .map((s, idx) => ({
          id: `step-${s.step}`,
          label: s.label,
          sublabel: (s.detail || '').slice(0, 32),
          x: 30 + idx * 215,
          y: 115,
          w: 185,
          h: 84,
          tone: idx === 0 ? 'neutral' : idx === 1 ? 'primary' : idx === 2 ? 'amber' : 'emerald',
          step: s.step,
        }));

  const edges = spec
    ? spec.edges
    : nodes.slice(0, -1).map((n, idx) => ({
        from: n.id,
        to: nodes[idx + 1].id,
        step: idx + 1,
      }));

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const safeId = `${viewerId}-${diagramKey}`.replace(/[^a-zA-Z0-9_-]/g, '');
  const markerId = `arrow-${safeId}`;

  const edgesMarkup = edges
    .map((edge) => {
      const fromNode = nodeMap.get(edge.from);
      const toNode = nodeMap.get(edge.to);
      if (!fromNode || !toNode) return '';

      const { x1, y1, x2, y2 } = getAnchorPoint(fromNode, toNode);
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const isEdgeActive = activeStep !== null && edge.step === activeStep;
      const strokeClass = isEdgeActive ? 'svg-edge-active' : 'svg-edge';
      const markerRef = `url(#${isEdgeActive ? `${markerId}-active` : markerId})`;

      let labelMarkup = '';
      if (edge.label) {
        const w = Math.max(edge.label.length * 6.8, 56);
        labelMarkup = `
          <g transform="translate(${midX}, ${midY - 9})">
            <rect x="${-w / 2}" y="-10" width="${w}" height="18" rx="4" class="svg-edge-label-bg" stroke-width="1"></rect>
            <text text-anchor="middle" y="3" style="font-size:10px;font-weight:600;font-family:var(--font-mono)" class="${isEdgeActive ? 'svg-edge-label-text-active' : 'svg-edge-label-text'}">${escapeHtml(edge.label)}</text>
          </g>
        `;
      }

      return `
        <g>
          <line
            x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
            stroke-width="${isEdgeActive ? 2.5 : 1.75}"
            ${edge.dashed ? 'stroke-dasharray="6 4"' : ''}
            marker-end="${markerRef}"
            ${edge.bidirectional ? `marker-start="${markerRef}"` : ''}
            class="${strokeClass}"
          ></line>
          ${labelMarkup}
        </g>
      `;
    })
    .join('');

  const nodesMarkup = nodes
    .map((node) => {
      const tone = node.tone || 'neutral';
      const isNodeActive = activeStep !== null && node.step === activeStep;
      const isDimmed = activeStep !== null && node.step !== activeStep;

      const stepBadge = node.step
        ? `
          <g transform="translate(${node.x + 10}, ${node.y + 10})">
            <circle cx="8" cy="8" r="8" class="${isNodeActive ? 'svg-step-badge-bg-active' : 'svg-step-badge-bg'}"></circle>
            <text x="8" y="11.5" text-anchor="middle" style="font-size:10px;font-weight:700;font-family:var(--font-mono)" class="${isNodeActive ? 'svg-step-badge-text-active' : 'svg-step-badge-text'}">${node.step}</text>
          </g>
        `
        : '';

      const sublabelMarkup = node.sublabel
        ? `<text x="${node.x + node.w / 2}" y="${node.y + node.h / 2 + 16}" text-anchor="middle" style="font-size:10.5px;font-family:var(--font-mono)" class="svg-node-${tone}-sub">${escapeHtml(node.sublabel)}</text>`
        : '';

      return `
        <g
          ${node.step ? `data-action="diagram-step" data-viewer-id="${escapeHtml(viewerId)}" data-step="${node.step}" style="cursor:pointer;opacity:${isDimmed ? 0.55 : 1}"` : `style="opacity:${isDimmed ? 0.55 : 1}"`}
        >
          <rect
            x="${node.x}" y="${node.y}" width="${node.w}" height="${node.h}" rx="10"
            stroke-width="${isNodeActive ? 2.5 : 1.5}"
            class="svg-node-${tone}-fill ${isNodeActive ? 'svg-node-active-stroke' : `svg-node-${tone}-stroke`}"
          ></rect>
          ${stepBadge}
          <text
            x="${node.x + node.w / 2}"
            y="${node.y + (node.sublabel ? node.h / 2 - 4 : node.h / 2 + 4)}"
            text-anchor="middle"
            style="font-size:13px;font-weight:600;font-family:var(--font-display)"
            class="svg-node-${tone}-title"
          >${escapeHtml(node.label)}</text>
          ${sublabelMarkup}
        </g>
      `;
    })
    .join('');

  return `
    <svg viewBox="0 0 900 320" style="width:100%;height:auto;display:block;user-select:none" role="img" aria-label="${escapeHtml(diagram.title)}">
      <defs>
        <marker id="${markerId}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" class="svg-arrow"></path>
        </marker>
        <marker id="${markerId}-active" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" class="svg-arrow-active"></path>
        </marker>
        <pattern id="grid-${safeId}" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" class="svg-grid-dot"></circle>
        </pattern>
      </defs>
      <rect x="0" y="0" width="900" height="320" rx="12" class="svg-bg"></rect>
      <rect x="0" y="0" width="900" height="320" rx="12" fill="url(#grid-${safeId})"></rect>
      ${edgesMarkup}
      ${nodesMarkup}
    </svg>
  `;
}

export function renderInteractiveDiagramCard(diagram, viewerId, options = {}) {
  const activeStep = store.diagramActiveStep[viewerId] ?? null;
  const zoom = store.diagramZoom[viewerId] ?? 1;
  const steps = diagram.steps || [];

  return `
    <div class="diagram-card print-break-inside-avoid">
      <div class="diagram-header">
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="badge badge-primary">${escapeHtml(diagram.category || 'Architecture')}</span>
            ${diagram.unitNumber ? `<span class="badge">Unit ${diagram.unitNumber}</span>` : ''}
          </div>
          <h4 style="font-size:1.02rem;margin-top:6px">${escapeHtml(diagram.title)}</h4>
          ${diagram.summary ? `<p class="text-muted" style="font-size:0.84rem;margin-top:3px">${escapeHtml(diagram.summary)}</p>` : ''}
        </div>
        <div class="flex items-center gap-2 no-print">
          <button class="btn btn-secondary btn-sm" data-action="diagram-zoom" data-viewer-id="${escapeHtml(viewerId)}" data-delta="-0.15" title="Zoom out">${icon('zoomOut', 'icon-sm')}</button>
          <span class="font-mono text-muted" style="font-size:0.75rem;min-width:42px;text-align:center">${Math.round(zoom * 100)}%</span>
          <button class="btn btn-secondary btn-sm" data-action="diagram-zoom" data-viewer-id="${escapeHtml(viewerId)}" data-delta="0.15" title="Zoom in">${icon('zoomIn', 'icon-sm')}</button>
          <button class="btn btn-secondary btn-sm" data-action="diagram-reset" data-viewer-id="${escapeHtml(viewerId)}" title="Reset zoom & step">${icon('rotateCcw', 'icon-sm')}</button>
          ${!options.isFullscreen ? `<button class="btn btn-soft btn-sm" data-action="diagram-fullscreen" data-diagram-key="${escapeHtml(diagram.diagramKey)}" title="Fullscreen view">${icon('maximize', 'icon-sm')} Fullscreen</button>` : ''}
        </div>
      </div>
      <div class="diagram-canvas-wrap">
        <div class="diagram-zoom-inner" style="transform:scale(${zoom});width:${zoom > 1 ? `${Math.round(100 * zoom)}%` : '100%'}">
          ${renderTechnicalDiagramSvg(diagram, viewerId, activeStep)}
        </div>
      </div>
      ${steps.length > 0 ? `
        <div class="diagram-steps">
          ${steps
            .map(
              (s) => `
              <button
                class="diagram-step-btn ${activeStep === s.step ? 'active' : ''}"
                data-action="diagram-step"
                data-viewer-id="${escapeHtml(viewerId)}"
                data-step="${s.step}"
              >
                <div class="flex items-center gap-2">
                  <span class="badge ${activeStep === s.step ? 'badge-primary' : ''}">Step ${s.step}</span>
                  <strong style="font-size:0.82rem">${escapeHtml(s.label)}</strong>
                </div>
                <p class="text-muted" style="font-size:0.78rem;margin-top:5px">${escapeHtml(s.detail)}</p>
              </button>
            `
            )
            .join('')}
        </div>
      ` : ''}
    </div>
  `;
}
