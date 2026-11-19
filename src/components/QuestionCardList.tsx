import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Languages,
  Printer,
  Search,
  Star,
} from 'lucide-react';
import type { CatalogData, QuestionItem } from '../types/lms';
import { useAuth } from '../context/AuthContext';
import { InteractiveDiagramViewer } from './diagrams/InteractiveDiagramViewer';

export type QuestionMarksFilter = 'all' | '2' | '5' | '8' | '10' | 'bookmarked';
export type AnswerMode = 'exam' | 'learning';

interface QuestionCardListProps {
  catalog: CatalogData;
  scopedUnitId?: number;
  initialFilter?: QuestionMarksFilter;
  showUnitSelector?: boolean;
}

export const QuestionCardList: React.FC<QuestionCardListProps> = ({
  catalog,
  scopedUnitId,
  initialFilter = 'all',
  showUnitSelector = false,
}) => {
  const { studentState, toggleBookmark, toggleQuestionStatus } = useAuth();

  const [unitFilter, setUnitFilter] = useState<number | 'all'>(
    scopedUnitId ?? 'all'
  );
  const [marksFilter, setMarksFilter] = useState<QuestionMarksFilter>(initialFilter);
  const [answerMode, setAnswerMode] = useState<AnswerMode>('exam');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [printingQuestionId, setPrintingQuestionId] = useState<number | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    const pool = scopedUnitId
      ? catalog.questions.filter((q) => q.unitId === scopedUnitId)
      : catalog.questions;
    const first = pool[0]?.id;
    return first ? new Set([first]) : new Set();
  });

  // Sync unitFilter if scopedUnitId changes when switching units
  React.useEffect(() => {
    if (scopedUnitId !== undefined) {
      setUnitFilter(scopedUnitId);
    }
  }, [scopedUnitId]);

  React.useEffect(() => {
    setMarksFilter(initialFilter);
  }, [initialFilter]);

  const bookmarkedIds = useMemo(
    () =>
      new Set(
        studentState.bookmarks
          .filter((b) => b.itemType === 'question')
          .map((b) => b.itemId)
      ),
    [studentState.bookmarks]
  );

  const statusByQuestionId = useMemo(() => {
    const map = new Map<number, { important: boolean; completed: boolean }>();
    (studentState.questionStatuses ?? []).forEach((s) => {
      map.set(s.questionId, { important: s.important, completed: s.completed });
    });
    return map;
  }, [studentState.questionStatuses]);

  const activeUnitFilter = scopedUnitId ?? unitFilter;

  const filteredQuestions = useMemo(() => {
    const qLower = searchQuery.trim().toLowerCase();
    return catalog.questions.filter((item) => {
      if (activeUnitFilter !== 'all' && item.unitId !== activeUnitFilter) return false;
      if (marksFilter === 'bookmarked' && !bookmarkedIds.has(item.id)) return false;
      if (
        (marksFilter === '2' ||
          marksFilter === '5' ||
          marksFilter === '8' ||
          marksFilter === '10') &&
        item.marks !== Number(marksFilter)
      ) {
        return false;
      }
      if (qLower) {
        const matchText =
          item.questionText.toLowerCase().includes(qLower) ||
          item.mainExplanation.toLowerCase().includes(qLower) ||
          (item.hinglishExplanation || '').toLowerCase().includes(qLower) ||
          item.keywords.some((k) => k.toLowerCase().includes(qLower));
        if (!matchText) return false;
      }
      return true;
    });
  }, [catalog.questions, activeUnitFilter, marksFilter, searchQuery, bookmarkedIds]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const buildCopyText = (q: QuestionItem, displayNum: number) => {
    const useLearning = answerMode === 'learning' && Boolean(q.hinglishExplanation?.trim());
    if (useLearning) {
      return [
        `Q${displayNum}. ${q.questionText} (${q.marks} Marks - Learning Mode / Hinglish)`,
        '',
        `Introduction: ${q.hinglishIntro || q.introduction}`,
        '',
        `Explanation:\n${q.hinglishExplanation}`,
        '',
        `Example: ${q.hinglishExample || q.examples}`,
        '',
        `Conclusion: ${q.hinglishConclusion || q.conclusion}`,
        '',
        `Keywords: ${q.keywords.join(', ')}`,
      ].join('\n');
    }
    return [
      `Q${displayNum}. ${q.questionText} (${q.marks} Marks - Exam Mode)`,
      '',
      `1. Introduction:\n${q.introduction}`,
      '',
      `2. Detailed Explanation:\n${q.mainExplanation}`,
      '',
      `3. Relevant Example:\n${q.examples}`,
      ...(q.advantages.length > 0
        ? ['', `Advantages:\n${q.advantages.map((a) => `- ${a}`).join('\n')}`]
        : []),
      ...(q.disadvantages.length > 0
        ? ['', `Disadvantages / Limitations:\n${q.disadvantages.map((d) => `- ${d}`).join('\n')}`]
        : []),
      '',
      `Conclusion:\n${q.conclusion}`,
      '',
      `Important Keywords: ${q.keywords.join(', ')}`,
    ].join('\n');
  };

  const handleCopyAnswer = async (q: QuestionItem, displayNum: number) => {
    try {
      await navigator.clipboard.writeText(buildCopyText(q, displayNum));
      setCopiedId(q.id);
      window.setTimeout(() => setCopiedId(null), 1600);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handlePrintOrPdfQuestion = (q: QuestionItem, displayNum: number, asPdfName: boolean) => {
    const previousTitle = document.title;
    setExpandedIds((prev) => new Set(prev).add(q.id));
    setPrintingQuestionId(q.id);

    if (asPdfName) {
      const cleanSlug = q.questionText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 48);
      document.title = `EXAM-TIPS-Q${displayNum}-${q.marks}M-${cleanSlug}`;
    }

    const cleanup = () => {
      document.title = previousTitle;
      setPrintingQuestionId(null);
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => window.print(), 70);
    });
  };

  const countByMarks = useMemo(() => {
    const pool =
      activeUnitFilter === 'all'
        ? catalog.questions
        : catalog.questions.filter((q) => q.unitId === activeUnitFilter);
    return {
      all: pool.length,
      m2: pool.filter((q) => q.marks === 2).length,
      m5: pool.filter((q) => q.marks === 5).length,
      m8: pool.filter((q) => q.marks === 8).length,
      m10: pool.filter((q) => q.marks === 10).length,
      bookmarked: pool.filter((q) => bookmarkedIds.has(q.id)).length,
    };
  }, [catalog.questions, activeUnitFilter, bookmarkedIds]);

  return (
    <div className="space-y-5">
      {/* Toolbar: Marks Filters + Answer Mode Toggle + Search */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4 no-print">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Required Marks & Bookmark Filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'all' as QuestionMarksFilter, label: `All Questions (${countByMarks.all})` },
              { key: '2' as QuestionMarksFilter, label: `2 Marks (${countByMarks.m2})` },
              { key: '5' as QuestionMarksFilter, label: `5 Marks (${countByMarks.m5})` },
              { key: '8' as QuestionMarksFilter, label: `8 Marks (${countByMarks.m8})` },
              { key: '10' as QuestionMarksFilter, label: `10 Marks (${countByMarks.m10})` },
              {
                key: 'bookmarked' as QuestionMarksFilter,
                label: `Bookmarked Questions (${countByMarks.bookmarked})`,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMarksFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  marksFilter === tab.key
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Learning Mode (Hinglish) vs Exam Mode (Professional English) Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Languages className="w-3.5 h-3.5" />
              <span>Answer Mode:</span>
            </span>
            <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAnswerMode('exam')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  answerMode === 'exam'
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Exam Mode (English)
              </button>
              <button
                type="button"
                onClick={() => setAnswerMode('learning')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  answerMode === 'learning'
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Learning Mode (Hinglish)
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          {showUnitSelector ? (
            <select
              aria-label="Filter questions by unit"
              value={unitFilter}
              onChange={(e) =>
                setUnitFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-200 sm:w-72"
            >
              <option value="all">All 5 Units ({catalog.questions.length} Questions)</option>
              {catalog.units.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber}: {u.title}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
              Note: Highlighted questions are recommended practice material for exam preparation, not guaranteed exam items.
            </div>
          )}

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions, keywords, or Hinglish..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Question Cards */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No questions match the selected filter. Choose "All Questions" to view the complete set.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const unit = catalog.units.find((u) => u.id === q.unitId);
            const isExpanded = expandedIds.has(q.id);
            const isBookmarked = bookmarkedIds.has(q.id);
            const status = statusByQuestionId.get(q.id);
            const isImportant = Boolean(status?.important);
            const isCompleted = Boolean(status?.completed);
            const diagram = q.diagramKey
              ? catalog.diagrams.find((d) => d.diagramKey === q.diagramKey)
              : undefined;
            const hasHinglish = Boolean(q.hinglishExplanation && q.hinglishExplanation.trim().length > 0);
            const showingLearning = answerMode === 'learning';

            const hideForSinglePrint =
              printingQuestionId !== null && printingQuestionId !== q.id;

            return (
              <div
                key={q.id}
                className={`rounded-xl border transition-colors bg-white dark:bg-slate-900 overflow-hidden print-avoid-break ${
                  isImportant
                    ? 'border-amber-400/80 dark:border-amber-600/70'
                    : isCompleted
                    ? 'border-emerald-400/70 dark:border-emerald-700/70'
                    : 'border-slate-200 dark:border-slate-800'
                } ${hideForSinglePrint ? 'print:hidden' : ''}`}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div
                      onClick={() => toggleExpand(q.id)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                        Q{idx + 1} · Unit {unit?.unitNumber} · Section {q.section} ·{' '}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {q.marks} Marks
                        </span>{' '}
                        ·{' '}
                        <span className="text-blue-600 dark:text-blue-400">
                          Exam Preparation Recommendation
                        </span>
                        {isImportant && (
                          <span className="ml-2 text-amber-600 dark:text-amber-400 font-semibold">
                            · Important
                          </span>
                        )}
                        {isCompleted && (
                          <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                            · Completed
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-slate-950 dark:text-white mt-1.5">
                        {idx + 1}. {q.questionText}
                      </h3>
                    </div>

                    {/* All 7 Interactive Actions */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0 no-print">
                      <button
                        type="button"
                        onClick={() => toggleBookmark('question', q.id)}
                        title="Bookmark Question"
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          isBookmarked
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleQuestionStatus(q.id, 'important')}
                        title="Mark as Important"
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          isImportant
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Important</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleQuestionStatus(q.id, 'completed')}
                        title="Mark as Completed"
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          isCompleted
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{isCompleted ? 'Done' : 'Complete'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyAnswer(q, idx + 1)}
                        title="Copy Answer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        {copiedId === q.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrintOrPdfQuestion(q, idx + 1, false)}
                        title="Print Answer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Print</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePrintOrPdfQuestion(q, idx + 1, true)}
                        title="Download as PDF"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(q.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white cursor-pointer whitespace-nowrap"
                      >
                        <span>{isExpanded ? 'Hide Answer' : 'Show Answer'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
                      {/* Per-card Mode Indicator + Switcher */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 no-print">
                        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {showingLearning
                            ? 'Learning Mode — Hinglish Concept Explanation'
                            : 'Exam Mode — Structured University Answer'}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setAnswerMode((m) => (m === 'exam' ? 'learning' : 'exam'))
                          }
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Switch to {showingLearning ? 'Exam Mode (English)' : 'Learning Mode (Hinglish)'}
                        </button>
                      </div>

                      {showingLearning ? (
                        hasHinglish ? (
                          <div className="space-y-4">
                            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/25 print-callout">
                              <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                                1. Asaan Bhasha Mein Introduction (Hinglish)
                              </div>
                              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                                {q.hinglishIntro || q.introduction}
                              </p>
                            </div>

                            <div>
                              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5">
                                2. Concept Detail Mein Samjhein
                              </div>
                              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {q.hinglishExplanation}
                              </div>
                            </div>

                            <div>
                              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1.5">
                                3. Daily Life Example
                              </div>
                              <p className="text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 text-slate-800 dark:text-slate-200 leading-relaxed">
                                {q.hinglishExample || q.examples}
                              </p>
                            </div>

                            {diagram && (
                              <div>
                                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                  4. Visual Diagram
                                </div>
                                <InteractiveDiagramViewer diagram={diagram} compact />
                              </div>
                            )}

                            <div>
                              <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
                                Exam Yaad Rakhne Ka Nishkarsh (Conclusion)
                              </div>
                              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                                {q.hinglishConclusion || q.conclusion}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-600 dark:text-slate-400">
                              Hinglish Learning Mode is currently available for Unit 1 questions; displaying standard Exam Mode answer below.
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                              {q.mainExplanation}
                            </p>
                          </div>
                        )
                      ) : (
                        <div className="space-y-5">
                          <div>
                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                              1. Introduction
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {q.introduction}
                            </p>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                              2. Detailed Explanation
                            </div>
                            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                              {q.mainExplanation}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                              3. Relevant Example
                            </div>
                            <p className="text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 text-slate-800 dark:text-slate-200">
                              {q.examples}
                            </p>
                          </div>

                          {diagram && (
                            <div>
                              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
                                4. Labeled Technical Diagram
                              </div>
                              <InteractiveDiagramViewer diagram={diagram} compact />
                            </div>
                          )}

                          {(q.advantages.length > 0 || q.disadvantages.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {q.advantages.length > 0 && (
                                <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20">
                                  <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                                    Advantages
                                  </div>
                                  <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    {q.advantages.map((adv) => (
                                      <li key={adv}>• {adv}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {q.disadvantages.length > 0 && (
                                <div className="p-4 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50/40 dark:bg-amber-950/20">
                                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
                                    Disadvantages / Considerations
                                  </div>
                                  <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    {q.disadvantages.map((dis) => (
                                      <li key={dis}>• {dis}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          <div>
                            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
                              Conclusion
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                              {q.conclusion}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          Important Exam Keywords:{' '}
                        </span>
                        {q.keywords.join(' · ')}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
