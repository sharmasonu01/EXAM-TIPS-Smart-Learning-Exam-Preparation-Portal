import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Copy,
  Download,
  FileQuestion,
  FileText,
  LayoutGrid,
  Network,
  Printer,
  Zap,
} from 'lucide-react';
import type { AppView, CatalogData, UnitItem } from '../types/lms';
import { useAuth } from '../context/AuthContext';
import { InteractiveDiagramViewer } from './diagrams/InteractiveDiagramViewer';
import { QuestionCardList, type QuestionMarksFilter } from './QuestionCardList';
import { UnitMcqRunner } from './UnitMcqRunner';

type UnitSectionTab =
  | 'overview'
  | 'notes'
  | 'questions'
  | 'diagrams'
  | 'mcq'
  | 'revision';

interface UnitWorkspaceProps {
  unit: UnitItem;
  catalog: CatalogData;
  initialTopicSlug?: string;
  onNavigate: (view: AppView, unitSlug?: string, topicSlug?: string) => void;
}

const UNIT1_FULL_FORMS = [
  { abbr: 'HTTP', fullForm: 'HyperText Transfer Protocol', note: 'Stateless Web request-response protocol (TCP Port 80 / HTTPS 443)' },
  { abbr: 'SMTP', fullForm: 'Simple Mail Transfer Protocol', note: 'Push protocol for sending & relaying outgoing email (TCP Port 25 / 587)' },
  { abbr: 'POP3', fullForm: 'Post Office Protocol Version 3', note: 'Download-and-delete email retrieval protocol (TCP Port 110 / 995)' },
  { abbr: 'MIME', fullForm: 'Multipurpose Internet Mail Extensions', note: 'Formatting standard enabling attachments & UTF-8 over SMTP (Base64)' },
  { abbr: 'IMAP', fullForm: 'Internet Message Access Protocol', note: 'Multi-device server-synchronized email access protocol (TCP Port 143 / 993)' },
  { abbr: 'DNS', fullForm: 'Domain Name System', note: 'Hierarchical directory resolving domain names to IP addresses (UDP/TCP Port 53)' },
  { abbr: 'HTML', fullForm: 'HyperText Markup Language', note: 'Standard declarative markup language structuring web documents' },
  { abbr: 'WWW', fullForm: 'World Wide Web', note: 'Interlinked hypertext information space running over the Internet' },
];

const UNIT1_PROTOCOLS_SUMMARY = [
  { protocol: 'HTTP / HTTPS', port: '80 / 443 (TCP)', direction: 'Pull (Client -> Server)', state: 'Stateless', purpose: 'Retrieve web pages, assets & REST API data' },
  { protocol: 'SMTP', port: '25 / 587 (TCP)', direction: 'Push (Sender -> MTA)', state: 'Stateful', purpose: 'Send & relay outgoing electronic mail' },
  { protocol: 'POP3', port: '110 / 995 (TCP)', direction: 'Pull (Client <- MDA)', state: 'Stateful per session', purpose: 'Download mail locally for single-device reading' },
  { protocol: 'IMAP', port: '143 / 993 (TCP)', direction: 'Pull / Sync (Client <-> Server)', state: 'Stateful', purpose: 'Keep folders & read status synced across devices' },
  { protocol: 'MIME', port: 'Header Extension (via SMTP)', direction: 'Formatting Layer', state: 'N/A', purpose: 'Encode images, PDFs, audio & UTF-8 inside email' },
  { protocol: 'DNS', port: '53 (UDP / TCP)', direction: 'Query -> Referral -> IP', state: 'Stateless', purpose: 'Resolve human hostnames to numeric IPv4/IPv6' },
];

export const UnitWorkspace: React.FC<UnitWorkspaceProps> = ({
  unit,
  catalog,
  initialTopicSlug,
  onNavigate,
}) => {
  const { studentState, markTopicViewed, toggleTopicCompleted, toggleBookmark } =
    useAuth();

  const unitTopics = useMemo(
    () =>
      catalog.topics
        .filter((t) => t.unitId === unit.id)
        .sort((a, b) => a.orderIndex - b.orderIndex),
    [catalog.topics, unit.id]
  );

  const unitDiagrams = useMemo(
    () => catalog.diagrams.filter((d) => d.unitId === unit.id),
    [catalog.diagrams, unit.id]
  );

  const unitQuestions = useMemo(
    () => catalog.questions.filter((q) => q.unitId === unit.id),
    [catalog.questions, unit.id]
  );

  const unitMcqs = useMemo(
    () => catalog.mcqs.filter((m) => m.unitId === unit.id),
    [catalog.mcqs, unit.id]
  );

  const [activeTab, setActiveTab] = useState<UnitSectionTab>(() =>
    initialTopicSlug ? 'notes' : 'overview'
  );
  const [questionMarksFilter, setQuestionMarksFilter] =
    useState<QuestionMarksFilter>('all');

  const [selectedTopicId, setSelectedTopicId] = useState<number>(() => {
    const matched = unitTopics.find((t) => t.slug === initialTopicSlug);
    return matched ? matched.id : unitTopics[0]?.id || 0;
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [printScope, setPrintScope] = useState<'topic' | 'unit'>('topic');

  useEffect(() => {
    const matched = unitTopics.find((t) => t.slug === initialTopicSlug);
    if (matched) {
      setSelectedTopicId(matched.id);
      setActiveTab('notes');
    } else if (unitTopics.length > 0 && !unitTopics.some((t) => t.id === selectedTopicId)) {
      setSelectedTopicId(unitTopics[0].id);
    }
  }, [unit.id, initialTopicSlug, unitTopics, selectedTopicId]);

  const activeTopic =
    unitTopics.find((t) => t.id === selectedTopicId) || unitTopics[0] || null;

  useEffect(() => {
    if (activeTab === 'notes' && activeTopic) {
      markTopicViewed(activeTopic.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeTopic?.id]);

  const triggerPrintToPdf = (scope: 'topic' | 'unit') => {
    const previousTitle = document.title;
    const targetSlug =
      scope === 'unit'
        ? `EXAM-TIPS-Unit-${unit.unitNumber}-Complete-Notes`
        : activeTab === 'revision'
        ? `EXAM-TIPS-Unit-${unit.unitNumber}-Quick-Revision`
        : `EXAM-TIPS-Unit-${unit.unitNumber}-${activeTopic?.slug || 'Note'}`;

    setPrintScope(scope);
    document.title = targetSlug;

    const restoreTitle = () => {
      document.title = previousTitle;
      setPrintScope('topic');
      window.removeEventListener('afterprint', restoreTitle);
    };

    window.addEventListener('afterprint', restoreTitle);
    window.requestAnimationFrame(() => {
      window.setTimeout(() => {
        window.print();
      }, 60);
    });
  };

  const activeIndex = unitTopics.findIndex((t) => t.id === activeTopic?.id);
  const prevTopic = activeIndex > 0 ? unitTopics[activeIndex - 1] : null;
  const nextTopic =
    activeIndex >= 0 && activeIndex < unitTopics.length - 1
      ? unitTopics[activeIndex + 1]
      : null;

  const completedTopicIds = new Set(
    studentState.progress.filter((p) => p.completed).map((p) => p.topicId)
  );
  const bookmarkedTopicIds = new Set(
    studentState.bookmarks
      .filter((b) => b.itemType === 'topic')
      .map((b) => b.itemId)
  );

  const unitCompletedCount = unitTopics.filter((t) => completedTopicIds.has(t.id)).length;
  const unitCompletionPct =
    unitTopics.length > 0 ? Math.round((unitCompletedCount / unitTopics.length) * 100) : 0;

  const qCounts = {
    all: unitQuestions.length,
    m2: unitQuestions.filter((q) => q.marks === 2).length,
    m5: unitQuestions.filter((q) => q.marks === 5).length,
    long: unitQuestions.filter((q) => q.marks === 8 || q.marks === 10).length,
  };

  const activeDiagram = activeTopic?.diagramKey
    ? catalog.diagrams.find((d) => d.diagramKey === activeTopic.diagramKey)
    : undefined;

  const handleCopyCode = async (code: string, key: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleDownloadNotes = () => {
    const lines: string[] = [
      `EXAM TIPS — Course: Web Technology`,
      `Unit ${unit.unitNumber}: ${unit.title}`,
      `${unit.subtitle}`,
      '',
      'SYLLABUS:',
      ...unit.syllabus.map((s, i) => `  ${i + 1}. ${s}`),
      '',
      'QUICK REVISION SUMMARY:',
      ...unit.quickRevision.map((r) => `  * ${r}`),
      '',
      'TOPIC-WISE NOTES:',
    ];

    unitTopics.forEach((t) => {
      lines.push(`\n## ${t.orderIndex}. ${t.title}`);
      lines.push(`Definition: ${t.definition}`);
      lines.push(`Explanation: ${t.explanation}`);
      if (t.keyTakeaways.length > 0) {
        lines.push('Key Exam Points:');
        t.keyTakeaways.forEach((k) => lines.push(`  - ${k}`));
      }
    });

    if (unitQuestions.length > 0) {
      lines.push('\n\nIMPORTANT PRACTICE QUESTIONS:');
      unitQuestions.forEach((q, idx) => {
        lines.push(`\nQ${idx + 1} [${q.marks} Marks - Section ${q.section}]: ${q.questionText}`);
        lines.push(`Answer: ${q.introduction} ${q.mainExplanation}`);
        lines.push(`Conclusion: ${q.conclusion}`);
      });
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${unit.slug}-study-material.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openQuestionsWithFilter = (filter: QuestionMarksFilter) => {
    setQuestionMarksFilter(filter);
    setActiveTab('questions');
  };

  return (
    <div className="space-y-6 print-container">
      {/* Print-Only Academic Masthead */}
      <div className="hidden print:block pb-3 mb-4 border-b border-slate-300">
        <div className="flex items-baseline justify-between gap-4">
          <div className="font-display text-sm font-bold tracking-tight">
            EXAM TIPS · Course: Web Technology
          </div>
          <div className="text-xs font-mono">
            Unit {unit.unitNumber} · {unit.examWeight}
          </div>
        </div>
        <div className="text-xs text-slate-600 mt-1">
          {printScope === 'unit'
            ? `Complete Unit ${unit.unitNumber} Study Packet (${unitTopics.length} Topics)`
            : activeTab === 'revision'
            ? `Quick Revision & Full Forms Sheet · Unit ${unit.unitNumber}`
            : `Study Note: ${activeTopic?.title || unit.title}`}
        </div>
      </div>

      {/* Unit Header Card */}
      <div
        className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 ${
          printScope === 'unit' ? 'print:hidden' : ''
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400 tabular-nums">
              Course: Web Technology · Unit {unit.unitNumber} · {unitTopics.length} Topics ·{' '}
              {unitQuestions.length} Questions · {unitMcqs.length} MCQs · {unitDiagrams.length} Diagrams
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1.5">
              Unit {unit.unitNumber}: {unit.title}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {unit.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
            <button
              type="button"
              onClick={handleDownloadNotes}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Study Material</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (activeTab !== 'notes' && activeTab !== 'revision') {
                  setActiveTab('notes');
                }
                triggerPrintToPdf('topic');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              type="button"
              onClick={() => triggerPrintToPdf('unit')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Full Unit PDF</span>
            </button>
          </div>
        </div>

        {/* Unit Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'overview' as UnitSectionTab, label: 'Unit Overview', icon: LayoutGrid },
              { id: 'notes' as UnitSectionTab, label: `Complete Notes (${unitTopics.length})`, icon: BookOpen },
              { id: 'questions' as UnitSectionTab, label: `Important Questions (${unitQuestions.length})`, icon: FileQuestion },
              { id: 'diagrams' as UnitSectionTab, label: `Technical Diagrams (${unitDiagrams.length})`, icon: Network },
              { id: 'mcq' as UnitSectionTab, label: `MCQ Practice Test (${unitMcqs.length})`, icon: ClipboardCheck },
              { id: 'revision' as UnitSectionTab, label: 'Quick Revision', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            Progress: {unitCompletedCount}/{unitTopics.length} Topics ({unitCompletionPct}%)
          </div>
        </div>
      </div>

      {/* Screen & Active Tab Content (hidden when Full Unit PDF packet prints) */}
      <div className={printScope === 'unit' ? 'print:hidden' : ''}>
        {/* 1. UNIT OVERVIEW DASHBOARD TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress & Study Summary Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Syllabus Completion
                </div>
                <div className="font-display text-2xl font-bold text-slate-950 dark:text-white tabular-nums">
                  {unitCompletionPct}% Complete
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${unitCompletionPct}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {unitCompletedCount} of {unitTopics.length} topics marked completed
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Important Questions Breakdown
                  </div>
                  <div className="font-display text-2xl font-bold text-slate-950 dark:text-white mt-1 tabular-nums">
                    {qCounts.all} Practice Questions
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => openQuestionsWithFilter('2')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    2 Marks ({qCounts.m2})
                  </button>
                  <button
                    type="button"
                    onClick={() => openQuestionsWithFilter('5')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    5 Marks ({qCounts.m5})
                  </button>
                  <button
                    type="button"
                    onClick={() => openQuestionsWithFilter('8')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    8/10 Marks ({qCounts.long})
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Visual Diagrams &amp; Self-Test
                  </div>
                  <div className="font-display text-2xl font-bold text-slate-950 dark:text-white mt-1 tabular-nums">
                    {unitDiagrams.length} Diagrams · {unitMcqs.length} MCQs
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('diagrams')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    Open Diagrams
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('mcq')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Start MCQ Test
                  </button>
                </div>
              </div>
            </div>

            {/* Syllabus Topic Navigator Cards */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                    Unit {unit.unitNumber} Syllabus &amp; Complete Topic Notes
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select any topic below to open detailed definitions, code examples, comparison tables, and linked diagrams.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer shrink-0"
                >
                  Open Complete Notes
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {unitTopics.map((topic) => {
                  const isDone = completedTopicIds.has(topic.id);
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => {
                        setSelectedTopicId(topic.id);
                        setActiveTab('notes');
                      }}
                      className="text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 hover:border-blue-500 transition-colors cursor-pointer flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 text-xs font-mono text-blue-600 dark:text-blue-400">
                          <span>Topic {String(topic.orderIndex).padStart(2, '0')}</span>
                          {isDone && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          )}
                        </div>
                        <div className="font-display text-sm font-bold text-slate-950 dark:text-white mt-1.5">
                          {topic.title}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {topic.definition}
                        </p>
                      </div>
                      <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
                        <span>Read Topic Note</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Action Strip for Revision & Study Download */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                    One-Page Quick Revision &amp; Full Forms
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Review all 8 Unit 1 Full Forms (HTTP, SMTP, POP3, MIME, IMAP, DNS, HTML, WWW), protocol tables, and key definitions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('revision')}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Open Revision
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                    Download Study Material
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Save complete Unit {unit.unitNumber} notes &amp; Q&amp;As offline or export as formatted A4 PDF.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDownloadNotes}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    TXT Notes
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerPrintToPdf('unit')}
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                  >
                    Save PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. COMPLETE NOTES TAB (Topic-by-Topic Deep Study View) */}
        {activeTab === 'notes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Topic Selector Rail */}
            <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-1.5 no-print">
              <div className="px-2 pb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                Unit {unit.unitNumber} Complete Syllabus Topics
              </div>
              {unitTopics.map((topic) => {
                const isSelected = activeTopic?.id === topic.id;
                const isDone = completedTopicIds.has(topic.id);
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs truncate">
                      {topic.orderIndex}. {topic.title}
                    </span>
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                    )}
                  </button>
                );
              })}

              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => openQuestionsWithFilter('all')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <span className="inline-flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Unit {unit.unitNumber} Exam Q&amp;A</span>
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    {unitQuestions.length}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('mcq')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 cursor-pointer"
                >
                  <span>Practice Unit {unit.unitNumber} MCQs ({unitMcqs.length})</span>
                </button>
              </div>
            </div>

            {/* Active Topic Content Canvas */}
            {activeTopic && (
              <div className="lg:col-span-8 space-y-6">
                <article className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        Unit {unit.unitNumber} · Topic {activeTopic.orderIndex} of {unitTopics.length}
                      </div>
                      <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mt-1">
                        {activeTopic.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 no-print">
                      <button
                        type="button"
                        onClick={() => toggleBookmark('topic', activeTopic.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          bookmarkedTopicIds.has(activeTopic.id)
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{bookmarkedTopicIds.has(activeTopic.id) ? 'Saved' : 'Save Note'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleTopicCompleted(
                            activeTopic.id,
                            !completedTopicIds.has(activeTopic.id)
                          )
                        }
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          completedTopicIds.has(activeTopic.id)
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {completedTopicIds.has(activeTopic.id)
                            ? 'Completed'
                            : 'Mark Completed'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Definition Box */}
                  <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 print-callout">
                    <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      Formal Definition
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {activeTopic.definition}
                    </p>
                  </div>

                  {/* Detailed Explanation */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Detailed Technical Explanation
                    </h3>
                    <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      {activeTopic.explanation}
                    </p>
                  </div>

                  {/* Code & Practical Examples */}
                  {activeTopic.examples.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        Examples &amp; Code Demonstrations
                      </h3>
                      {activeTopic.examples.map((ex, i) => {
                        const key = `${activeTopic.id}-${i}`;
                        return (
                          <div
                            key={key}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                          >
                            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                              <div>
                                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                  {ex.title}
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                  {ex.description}
                                </div>
                              </div>
                              {ex.code && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(ex.code!, key)}
                                  className="no-print inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 cursor-pointer shrink-0"
                                >
                                  {copiedKey === key ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            {ex.code && (
                              <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-slate-950 text-slate-100">
                                <code>{ex.code}</code>
                              </pre>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Comparison Table */}
                  {activeTopic.comparisonTable && (
                    <div className="space-y-2 print-avoid-break">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {activeTopic.comparisonTable.caption || 'Technical Comparison'}
                      </h3>
                      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left text-xs sm:text-sm">
                          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                              {activeTopic.comparisonTable.headers.map((h) => (
                                <th
                                  key={h}
                                  className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {activeTopic.comparisonTable.rows.map((row, idx) => (
                              <tr key={idx}>
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="px-4 py-3 text-slate-700 dark:text-slate-300"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Key Takeaways */}
                  {activeTopic.keyTakeaways.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        Exam-Ready Takeaways
                      </h3>
                      <ul className="space-y-1.5">
                        {activeTopic.keyTakeaways.map((point) => (
                          <li
                            key={point}
                            className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Previous / Next Navigation */}
                  <div className="pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 no-print">
                    {prevTopic ? (
                      <button
                        type="button"
                        onClick={() => setSelectedTopicId(prevTopic.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="truncate max-w-[160px] sm:max-w-xs">
                          {prevTopic.title}
                        </span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {nextTopic ? (
                      <button
                        type="button"
                        onClick={() => setSelectedTopicId(nextTopic.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        <span className="truncate max-w-[160px] sm:max-w-xs">
                          Next: {nextTopic.title}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTab('mcq')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                      >
                        <span>Take Unit {unit.unitNumber} Quiz</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </article>

                {/* Topic Linked Interactive Diagram */}
                {activeDiagram && (
                  <InteractiveDiagramViewer diagram={activeDiagram} />
                )}

                {/* Remaining Unit Diagrams (screen-only to keep single-topic PDF focused) */}
                {unitDiagrams.filter((d) => d.diagramKey !== activeDiagram?.diagramKey).length >
                  0 && (
                  <div className="space-y-4 no-print">
                    <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                      Additional Unit {unit.unitNumber} Technical Diagrams
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {unitDiagrams
                        .filter((d) => d.diagramKey !== activeDiagram?.diagramKey)
                        .map((diag) => (
                          <InteractiveDiagramViewer key={diag.id} diagram={diag} compact />
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. IMPORTANT QUESTIONS TAB (2M / 5M / 8-10M + Learning/Exam Mode) */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-wrap items-center justify-between gap-4 no-print">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Unit {unit.unitNumber} Important Practice Questions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Exam preparation recommendations organized by marks—toggle between Exam Mode (English) and Learning Mode (Hinglish).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { key: 'all' as QuestionMarksFilter, label: `All (${qCounts.all})` },
                  { key: '2' as QuestionMarksFilter, label: `2 Marks (${qCounts.m2})` },
                  { key: '5' as QuestionMarksFilter, label: `5 Marks (${qCounts.m5})` },
                  { key: '8' as QuestionMarksFilter, label: '8 Marks' },
                  { key: '10' as QuestionMarksFilter, label: '10 Marks' },
                ].map((sub) => (
                  <button
                    key={sub.key}
                    type="button"
                    onClick={() => setQuestionMarksFilter(sub.key)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer ${
                      questionMarksFilter === sub.key
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            <QuestionCardList
              catalog={catalog}
              scopedUnitId={unit.id}
              initialFilter={questionMarksFilter}
            />
          </div>
        )}

        {/* 4. TECHNICAL DIAGRAMS TAB */}
        {activeTab === 'diagrams' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-wrap items-center justify-between gap-4 no-print">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Unit {unit.unitNumber} Technical Diagrams &amp; Flowcharts ({unitDiagrams.length})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Interactive vector schematics with clickable step explanations, zoom controls, and fullscreen view.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('diagrams')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View Full 5-Unit Diagram Gallery
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {unitDiagrams.map((diag) => (
                <InteractiveDiagramViewer key={diag.id} diagram={diag} />
              ))}
            </div>
          </div>
        )}

        {/* 5. MCQ PRACTICE TEST TAB */}
        {activeTab === 'mcq' && <UnitMcqRunner unit={unit} mcqs={unitMcqs} />}

        {/* 6. QUICK REVISION & FULL FORMS TAB */}
        {activeTab === 'revision' && (
          <div className="space-y-6">
            {/* Rapid One-Page Revision Points */}
            <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-6 print-callout">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  One-Page Exam Revision Sheet · Unit {unit.unitNumber}
                </h2>
                <button
                  type="button"
                  onClick={() => triggerPrintToPdf('topic')}
                  className="no-print inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Revision Sheet</span>
                </button>
              </div>
              <ul className="space-y-2.5">
                {unit.quickRevision.map((point) => (
                  <li
                    key={point}
                    className="text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dedicated Full Forms Section for Unit 1 */}
            {unit.unitNumber === 1 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 print-avoid-break">
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white mb-1">
                  Essential Unit 1 Full Forms
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  High-frequency acronyms tested in 2-mark definitions and MCQs.
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                          Abbreviation
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                          Full Form
                        </th>
                        <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                          Role &amp; Port Reference
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {UNIT1_FULL_FORMS.map((item) => (
                        <tr key={item.abbr}>
                          <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {item.abbr}
                          </td>
                          <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                            {item.fullForm}
                          </td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                            {item.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Important Protocols Reference Table (Unit 1) */}
            {unit.unitNumber === 1 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 print-avoid-break">
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white mb-4">
                  Important Protocols &amp; Port Reference
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">Protocol</th>
                        <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">Default Port</th>
                        <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">Direction</th>
                        <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">State</th>
                        <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">Primary Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {UNIT1_PROTOCOLS_SUMMARY.map((p) => (
                        <tr key={p.protocol}>
                          <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100">{p.protocol}</td>
                          <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300">{p.port}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.direction}</td>
                          <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.state}</td>
                          <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{p.purpose}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Topic Definitions & Key Concepts Cards */}
            <div>
              <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white mb-3">
                Important Definitions &amp; Key Concepts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unitTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 print-avoid-break"
                  >
                    <div className="text-xs font-mono text-blue-600 dark:text-blue-400">
                      Topic {topic.orderIndex}
                    </div>
                    <h4 className="font-display text-base font-bold text-slate-950 dark:text-white mt-1">
                      {topic.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {topic.definition}
                    </p>
                    <ul className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      {topic.keyTakeaways.map((k) => (
                        <li key={k} className="text-xs text-slate-700 dark:text-slate-300">
                          • {k}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Comparison Tables */}
            {unitTopics.some((t) => t.comparisonTable) && (
              <div className="space-y-4">
                <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white">
                  Differences Between Protocols &amp; Systems
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {unitTopics
                    .filter((t) => t.comparisonTable)
                    .map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 print-avoid-break"
                      >
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                          {t.comparisonTable!.caption || t.title}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                              <tr>
                                {t.comparisonTable!.headers.map((h) => (
                                  <th
                                    key={h}
                                    className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {t.comparisonTable!.rows.map((row, idx) => (
                                <tr key={idx}>
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className="px-3 py-2 text-slate-700 dark:text-slate-300"
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dedicated Print-Only Full Unit Study Packet when "Full Unit PDF" is triggered */}
      {printScope === 'unit' && (
        <div className="hidden print:block space-y-6">
          <div className="border-b border-slate-300 pb-4">
            <h1 className="font-display text-2xl font-bold">
              Unit {unit.unitNumber}: {unit.title}
            </h1>
            <p className="text-sm mt-1">{unit.description}</p>
          </div>

          <div className="print-callout p-4 rounded-lg">
            <h2 className="font-display text-sm font-bold mb-2">
              Official Syllabus &amp; Quick Revision Summary
            </h2>
            <ul className="space-y-1 text-xs">
              {unit.quickRevision.map((point) => (
                <li key={point}>• {point}</li>
              ))}
            </ul>
          </div>

          {unit.unitNumber === 1 && (
            <div className="print-avoid-break space-y-2">
              <h2 className="font-display text-sm font-bold">Essential Unit 1 Full Forms</h2>
              <table>
                <thead>
                  <tr>
                    <th>Abbreviation</th>
                    <th>Full Form</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {UNIT1_FULL_FORMS.map((f) => (
                    <tr key={f.abbr}>
                      <td>{f.abbr}</td>
                      <td>{f.fullForm}</td>
                      <td>{f.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {unitTopics.map((topic, idx) => {
            const topicDiagram = topic.diagramKey
              ? catalog.diagrams.find((d) => d.diagramKey === topic.diagramKey)
              : undefined;
            return (
              <section
                key={topic.id}
                className={`space-y-3 pt-4 border-t border-slate-300 ${
                  idx > 0 ? 'print-page-break' : ''
                }`}
              >
                <div className="text-xs font-mono">
                  Unit {unit.unitNumber} · Topic {topic.orderIndex} of {unitTopics.length}
                </div>
                <h2 className="font-display text-xl font-bold">{topic.title}</h2>
                <div className="print-callout p-3 rounded-lg">
                  <div className="text-xs font-semibold mb-0.5">Definition</div>
                  <p className="text-sm">{topic.definition}</p>
                </div>
                <p className="text-sm leading-relaxed">{topic.explanation}</p>

                {topic.examples.map((ex, eIdx) => (
                  <div key={eIdx} className="print-avoid-break space-y-1">
                    <div className="text-xs font-semibold">{ex.title}</div>
                    <div className="text-xs">{ex.description}</div>
                    {ex.code && (
                      <pre>
                        <code>{ex.code}</code>
                      </pre>
                    )}
                  </div>
                ))}

                {topic.comparisonTable && (
                  <div className="print-avoid-break space-y-1">
                    <div className="text-xs font-semibold">
                      {topic.comparisonTable.caption || 'Comparison'}
                    </div>
                    <table>
                      <thead>
                        <tr>
                          {topic.comparisonTable.headers.map((h) => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {topic.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {topic.keyTakeaways.length > 0 && (
                  <div className="print-avoid-break">
                    <div className="text-xs font-semibold mb-1">Exam-Ready Takeaways</div>
                    <ul className="space-y-1 text-xs">
                      {topic.keyTakeaways.map((k) => (
                        <li key={k}>• {k}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {topicDiagram && <InteractiveDiagramViewer diagram={topicDiagram} compact />}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
