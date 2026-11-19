import React, { useState } from 'react';
import { Maximize2, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { DiagramItem } from '../../types/lms';
import { TechnicalDiagramSvg } from './TechnicalDiagramSvg';

interface InteractiveDiagramViewerProps {
  diagram: DiagramItem;
  compact?: boolean;
}

export const InteractiveDiagramViewer: React.FC<InteractiveDiagramViewerProps> = ({
  diagram,
  compact = false,
}) => {
  const [zoom, setZoom] = useState(1);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const handleZoomIn = () => setZoom((z) => Math.min(2, Number((z + 0.2).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.7, Number((z - 0.2).toFixed(2))));
  const handleReset = () => {
    setZoom(1);
    setActiveStep(null);
  };

  const renderDiagramBody = (isModal: boolean) => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {diagram.category} Diagram · Interactive Step Explorer
          </div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
            {diagram.title}
          </h4>
        </div>

        <div className="flex items-center gap-1.5 no-print">
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out diagram"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono tabular-nums px-2 text-slate-600 dark:text-slate-300">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in diagram"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleReset}
            aria-label="Reset diagram zoom and step"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          {!isModal && (
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label="Open diagram fullscreen"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {diagram.summary}
      </p>

      <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 print-diagram-stage">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: `${100 / Math.min(1, zoom)}%`,
          }}
          className="transition-transform duration-200"
        >
          <TechnicalDiagramSvg
            diagramKey={diagram.diagramKey}
            title={diagram.title}
            steps={diagram.steps}
            activeStep={activeStep}
            onSelectStep={(step) =>
              setActiveStep((prev) => (prev === step ? null : step))
            }
          />
        </div>
      </div>

      {diagram.steps.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 print-avoid-break">
          {diagram.steps.map((step) => {
            const isActive = activeStep === step.step;
            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStep((prev) => (prev === step.step ? null : step.step))}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  isActive
                    ? 'border-blue-600 dark:border-blue-400 bg-blue-50/70 dark:bg-blue-950/40'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                  Step {step.step}
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
                  {step.label}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {step.detail}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div
        className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 print-avoid-break ${
          compact ? 'p-4' : 'p-6'
        }`}
      >
        {renderDiagramBody(false)}
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={diagram.title}
        >
          <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex justify-end mb-2">
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Close fullscreen diagram"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
            {renderDiagramBody(true)}
          </div>
        </div>
      )}
    </>
  );
};
