import React from 'react';
import type { DiagramStep } from '../../types/lms';
import { SCHEMATIC_SPECS, type SchematicEdge, type SchematicNode } from './diagramConfigs';

interface TechnicalDiagramSvgProps {
  diagramKey: string;
  title: string;
  steps?: DiagramStep[];
  activeStep: number | null;
  onSelectStep?: (step: number) => void;
}

const TONE_CLASSES: Record<
  NonNullable<SchematicNode['tone']>,
  {
    fill: string;
    stroke: string;
    title: string;
    sub: string;
  }
> = {
  neutral: {
    fill: 'fill-white dark:fill-slate-900',
    stroke: 'stroke-slate-300 dark:stroke-slate-700',
    title: 'fill-slate-900 dark:fill-slate-100',
    sub: 'fill-slate-500 dark:fill-slate-400',
  },
  primary: {
    fill: 'fill-blue-50 dark:fill-blue-950/60',
    stroke: 'stroke-blue-400 dark:stroke-blue-500',
    title: 'fill-blue-950 dark:fill-blue-100',
    sub: 'fill-blue-700 dark:fill-blue-300',
  },
  emerald: {
    fill: 'fill-emerald-50 dark:fill-emerald-950/50',
    stroke: 'stroke-emerald-400 dark:stroke-emerald-500',
    title: 'fill-emerald-950 dark:fill-emerald-100',
    sub: 'fill-emerald-700 dark:fill-emerald-300',
  },
  amber: {
    fill: 'fill-amber-50 dark:fill-amber-950/45',
    stroke: 'stroke-amber-400 dark:stroke-amber-500',
    title: 'fill-amber-950 dark:fill-amber-100',
    sub: 'fill-amber-700 dark:fill-amber-300',
  },
  violet: {
    fill: 'fill-indigo-50 dark:fill-indigo-950/55',
    stroke: 'stroke-indigo-400 dark:stroke-indigo-500',
    title: 'fill-indigo-950 dark:fill-indigo-100',
    sub: 'fill-indigo-700 dark:fill-indigo-300',
  },
};

function getAnchorPoint(source: SchematicNode, target: SchematicNode) {
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

export const TechnicalDiagramSvg: React.FC<TechnicalDiagramSvgProps> = ({
  diagramKey,
  title,
  steps = [],
  activeStep,
  onSelectStep,
}) => {
  const spec = SCHEMATIC_SPECS[diagramKey];

  // Dynamic fallback schematic if an Admin creates a new custom diagram
  const nodes: SchematicNode[] = spec
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
          sublabel: s.detail.slice(0, 32),
          x: 30 + idx * 215,
          y: 115,
          w: 185,
          h: 84,
          tone: idx === 0 ? 'neutral' : idx === 1 ? 'primary' : idx === 2 ? 'amber' : 'emerald',
          step: s.step,
        }));

  const edges: SchematicEdge[] = spec
    ? spec.edges
    : nodes.slice(0, -1).map((n, idx) => ({
        from: n.id,
        to: nodes[idx + 1].id,
        step: idx + 1,
      }));

  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const markerId = `arrow-${diagramKey.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg
      viewBox="0 0 900 320"
      className="w-full h-auto select-none"
      role="img"
      aria-label={title}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
        <marker
          id={`${markerId}-active`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" className="fill-blue-600 dark:fill-blue-400" />
        </marker>
        <pattern id={`grid-${markerId}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1" className="fill-slate-300/70 dark:fill-slate-700/60" />
        </pattern>
      </defs>

      <rect
        x="0"
        y="0"
        width="900"
        height="320"
        rx="12"
        className="fill-slate-50 dark:fill-slate-950"
      />
      <rect
        x="0"
        y="0"
        width="900"
        height="320"
        rx="12"
        fill={`url(#grid-${markerId})`}
      />

      {/* Edges */}
      {edges.map((edge, idx) => {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (!fromNode || !toNode) return null;

        const { x1, y1, x2, y2 } = getAnchorPoint(fromNode, toNode);
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const isEdgeActive = activeStep !== null && edge.step === activeStep;

        return (
          <g key={`${edge.from}-${edge.to}-${idx}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={isEdgeActive ? 2.5 : 1.75}
              strokeDasharray={edge.dashed ? '6 4' : undefined}
              markerEnd={`url(#${isEdgeActive ? `${markerId}-active` : markerId})`}
              markerStart={
                edge.bidirectional
                  ? `url(#${isEdgeActive ? `${markerId}-active` : markerId})`
                  : undefined
              }
              className={`transition-colors duration-200 ${
                isEdgeActive
                  ? 'stroke-blue-600 dark:stroke-blue-400'
                  : 'stroke-slate-400 dark:stroke-slate-600'
              }`}
            />
            {edge.label && (
              <g transform={`translate(${midX}, ${midY - 9})`}>
                <rect
                  x={-Math.max(edge.label.length * 3.4, 28)}
                  y="-10"
                  width={Math.max(edge.label.length * 6.8, 56)}
                  height="18"
                  rx="4"
                  className="fill-white/95 dark:fill-slate-900/95 stroke-slate-200 dark:stroke-slate-700"
                  strokeWidth="1"
                />
                <text
                  textAnchor="middle"
                  y="3"
                  className={`text-[10px] font-medium font-mono ${
                    isEdgeActive
                      ? 'fill-blue-700 dark:fill-blue-300'
                      : 'fill-slate-600 dark:fill-slate-300'
                  }`}
                >
                  {edge.label}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const tone = TONE_CLASSES[node.tone || 'neutral'];
        const isNodeActive = activeStep !== null && node.step === activeStep;
        const isDimmed = activeStep !== null && node.step !== activeStep;

        return (
          <g
            key={node.id}
            onClick={() => node.step && onSelectStep?.(node.step)}
            className={`transition-opacity duration-200 ${
              node.step ? 'cursor-pointer' : ''
            } ${isDimmed ? 'opacity-55' : 'opacity-100'}`}
          >
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={node.h}
              rx="10"
              strokeWidth={isNodeActive ? 2.5 : 1.5}
              className={`${tone.fill} ${
                isNodeActive
                  ? 'stroke-blue-600 dark:stroke-blue-400'
                  : tone.stroke
              } transition-all duration-200`}
            />
            {node.step && (
              <g transform={`translate(${node.x + 10}, ${node.y + 10})`}>
                <circle
                  cx="8"
                  cy="8"
                  r="8"
                  className={
                    isNodeActive
                      ? 'fill-blue-600 dark:fill-blue-500'
                      : 'fill-slate-200 dark:fill-slate-800'
                  }
                />
                <text
                  x="8"
                  y="11.5"
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-semibold ${
                    isNodeActive
                      ? 'fill-white'
                      : 'fill-slate-700 dark:fill-slate-300'
                  }`}
                >
                  {node.step}
                </text>
              </g>
            )}
            <text
              x={node.x + node.w / 2}
              y={node.y + (node.sublabel ? node.h / 2 - 4 : node.h / 2 + 4)}
              textAnchor="middle"
              className={`text-[13px] font-semibold ${tone.title}`}
            >
              {node.label}
            </text>
            {node.sublabel && (
              <text
                x={node.x + node.w / 2}
                y={node.y + node.h / 2 + 16}
                textAnchor="middle"
                className={`text-[10.5px] font-mono ${tone.sub}`}
              >
                {node.sublabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};
