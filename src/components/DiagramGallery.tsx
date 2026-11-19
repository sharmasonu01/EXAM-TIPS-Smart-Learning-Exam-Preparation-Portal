import React, { useMemo, useState } from 'react';
import type { CatalogData } from '../types/lms';
import { InteractiveDiagramViewer } from './diagrams/InteractiveDiagramViewer';

interface DiagramGalleryProps {
  catalog: CatalogData;
}

export const DiagramGallery: React.FC<DiagramGalleryProps> = ({ catalog }) => {
  const [unitFilter, setUnitFilter] = useState<number | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return catalog.diagrams.filter((d) => {
      if (unitFilter !== 'all' && d.unitId !== unitFilter) return false;
      if (categoryFilter !== 'all' && d.category !== categoryFilter) return false;
      return true;
    });
  }, [catalog.diagrams, unitFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
          Interactive Visual Blueprints · {catalog.diagrams.length} Scalable SVG Schematics
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
          Interactive Technical Diagrams &amp; Flowcharts
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-3xl">
          Click any step card or diagram node to highlight execution paths. Use Zoom and
          Fullscreen controls for detailed exam revision.
        </p>

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {['all', 'Architecture', 'Process', 'Flowchart', 'Comparison'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          <select
            aria-label="Filter diagrams by unit"
            value={unitFilter}
            onChange={(e) =>
              setUnitFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            <option value="all">All Units (1–5)</option>
            {catalog.units.map((u) => (
              <option key={u.id} value={u.id}>
                Unit {u.unitNumber}: {u.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filtered.map((diagram) => (
          <InteractiveDiagramViewer key={diagram.id} diagram={diagram} />
        ))}
      </div>
    </div>
  );
};
