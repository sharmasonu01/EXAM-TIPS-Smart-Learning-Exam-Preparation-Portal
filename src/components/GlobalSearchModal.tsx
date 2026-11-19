import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, FileQuestion, Network, Search, X } from 'lucide-react';
import type { AppView, CatalogData } from '../types/lms';

interface GlobalSearchModalProps {
  open: boolean;
  catalog: CatalogData;
  onClose: () => void;
  onNavigate: (view: AppView, unitSlug?: string, topicSlug?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  open,
  catalog,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (open) onClose();
      } else if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        topics: catalog.topics.slice(0, 6),
        questions: catalog.questions.slice(0, 4),
        diagrams: catalog.diagrams.slice(0, 4),
      };
    }

    return {
      topics: catalog.topics
        .filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.definition.toLowerCase().includes(q) ||
            t.explanation.toLowerCase().includes(q)
        )
        .slice(0, 8),
      questions: catalog.questions
        .filter(
          (item) =>
            item.questionText.toLowerCase().includes(q) ||
            item.keywords.some((k) => k.toLowerCase().includes(q))
        )
        .slice(0, 6),
      diagrams: catalog.diagrams
        .filter(
          (d) =>
            d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q)
        )
        .slice(0, 5),
    };
  }, [query, catalog]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/70 backdrop-blur-xs no-print"
      role="dialog"
      aria-modal="true"
      aria-label="Global topic and question search"
    >
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any unit topic, exam question, protocol, or diagram..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4 space-y-5">
          {results.topics.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                Study Topics
              </div>
              <div className="space-y-1">
                {results.topics.map((t) => {
                  const unit = catalog.units.find((u) => u.id === t.unitId);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        onNavigate('unit', unit?.slug, t.slug);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {t.title}
                        </span>
                      </span>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                        Unit {unit?.unitNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {results.questions.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                Important Questions
              </div>
              <div className="space-y-1">
                {results.questions.map((q) => {
                  const unit = catalog.units.find((u) => u.id === q.unitId);
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => {
                        onNavigate('questions');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <FileQuestion className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-sm text-slate-800 dark:text-slate-200 truncate">
                          {q.questionText}
                        </span>
                      </span>
                      <span className="text-xs font-mono text-slate-500 shrink-0">
                        U{unit?.unitNumber} · {q.marks}M
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {results.diagrams.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                Interactive Diagrams
              </div>
              <div className="space-y-1">
                {results.diagrams.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      onNavigate('diagrams');
                      onClose();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Network className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm text-slate-800 dark:text-slate-200 truncate">
                      {d.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.topics.length === 0 &&
            results.questions.length === 0 &&
            results.diagrams.length === 0 && (
              <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-8">
                No matching topics, questions, or diagrams found for "{query}".
              </p>
            )}
        </div>
      </div>
    </div>
  );
};
