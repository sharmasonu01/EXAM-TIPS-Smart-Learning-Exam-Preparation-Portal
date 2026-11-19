import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileQuestion,
  LogIn,
} from 'lucide-react';
import type { AppView, CatalogData } from '../types/lms';
import { useAuth } from '../context/AuthContext';

interface StudentDashboardProps {
  catalog: CatalogData;
  onNavigate: (view: AppView, unitSlug?: string, topicSlug?: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  catalog,
  onNavigate,
}) => {
  const { firebaseUser, dbUser, studentState, signInWithGoogle } = useAuth();

  const totalTopics = catalog.topics.length;
  const completedIds = new Set(
    studentState.progress.filter((p) => p.completed).map((p) => p.topicId)
  );
  const completedCount = completedIds.size;
  const overallPct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const avgQuizPct =
    studentState.attempts.length > 0
      ? Math.round(
          studentState.attempts.reduce((acc, a) => acc + a.percentage, 0) /
            studentState.attempts.length
        )
      : 0;

  // Continue Learning target: most recently viewed incomplete topic or first topic
  const recentProgress = studentState.progress.slice(0, 5);
  const nextIncompleteTopic =
    catalog.topics.find((t) => !completedIds.has(t.id)) || catalog.topics[0];
  const continueUnit = catalog.units.find(
    (u) => u.id === nextIncompleteTopic?.unitId
  );

  const bookmarkedQuestions = studentState.bookmarks
    .filter((b) => b.itemType === 'question')
    .map((b) => catalog.questions.find((q) => q.id === b.itemId))
    .filter(Boolean);

  const bookmarkedTopics = studentState.bookmarks
    .filter((b) => b.itemType === 'topic')
    .map((b) => catalog.topics.find((t) => t.id === b.itemId))
    .filter(Boolean);

  const recommendedQuestions = catalog.questions
    .filter((q) => q.section === 'C')
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Student Learning Workspace · {dbUser?.role === 'admin' ? 'Admin Mode Enabled' : 'University Exam Prep'}
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1.5">
            Welcome back{firebaseUser ? `, ${dbUser?.displayName || firebaseUser.displayName || 'Student'}` : ''}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
            {firebaseUser
              ? 'Your completed lessons, bookmarked questions, and MCQ scores are synchronized to Cloud SQL.'
              : 'Explore all five units freely, or sign in with Google to persist your progress, bookmarks, and mock test history.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!firebaseUser && (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              <span>Sync with Google</span>
            </button>
          )}
          {nextIncompleteTopic && continueUnit && (
            <button
              type="button"
              onClick={() => onNavigate('unit', continueUnit.slug, nextIncompleteTopic.slug)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Continue Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total Available Units
          </div>
          <div className="text-3xl font-display font-bold tabular-nums text-slate-950 dark:text-white mt-2">
            {catalog.units.length}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Full 5-unit syllabus active
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Completed Lessons
          </div>
          <div className="text-3xl font-display font-bold tabular-nums text-slate-950 dark:text-white mt-2">
            {completedCount}{' '}
            <span className="text-base font-normal text-slate-400">/ {totalTopics}</span>
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Syllabus topics mastered</span>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Learning Progress
          </div>
          <div className="text-3xl font-display font-bold tabular-nums text-slate-950 dark:text-white mt-2">
            {overallPct}%
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Practice Quiz Average
          </div>
          <div className="text-3xl font-display font-bold tabular-nums text-slate-950 dark:text-white mt-2">
            {studentState.attempts.length > 0 ? `${avgQuizPct}%` : '—'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
            {studentState.attempts.length} test attempt(s) logged
          </div>
        </div>
      </div>

      {/* Unit-wise Navigation & Progress */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-bold text-slate-950 dark:text-white">
            Unit-Wise Study Modules
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('diagrams')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            Browse All {catalog.diagrams.length} Interactive Diagrams
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {catalog.units.map((unit) => {
            const unitTopics = catalog.topics.filter((t) => t.unitId === unit.id);
            const doneInUnit = unitTopics.filter((t) => completedIds.has(t.id)).length;
            const unitPct =
              unitTopics.length > 0
                ? Math.round((doneInUnit / unitTopics.length) * 100)
                : 0;

            return (
              <div
                key={unit.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                    <span>Unit {unit.unitNumber} · {unit.examWeight}</span>
                    <span>{doneInUnit}/{unitTopics.length} done</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-slate-950 dark:text-white mt-2">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {unit.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1 tabular-nums">
                      <span>Completion</span>
                      <span>{unitPct}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${unitPct}%` }}
                        transition={{ duration: 0.45 }}
                        className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400 inline-flex items-center gap-1 tabular-nums">
                    <Clock className="w-3.5 h-3.5" />
                    ~{unit.estimatedHours} hrs
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('unit', unit.slug)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    <span>Study Unit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lower Dashboard Grid: Recently Viewed, Bookmarks, Upcoming Prep */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Viewed Notes */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
              Recently Viewed Notes
            </h3>
          </div>
          {recentProgress.length > 0 ? (
            <div className="space-y-2.5">
              {recentProgress.map((p) => {
                const topic = catalog.topics.find((t) => t.id === p.topicId);
                const unit = catalog.units.find((u) => u.id === topic?.unitId);
                if (!topic || !unit) return null;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onNavigate('unit', unit.slug, topic.slug)}
                    className="w-full text-left p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                      {topic.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Unit {unit.unitNumber} · {p.completed ? 'Completed' : 'In Progress'}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400 py-4">
              Open any unit topic to start building your recent revision trail.
            </div>
          )}
        </div>

        {/* Bookmarked Questions & Notes */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                Bookmarked Items
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {bookmarkedQuestions.length + bookmarkedTopics.length}
            </span>
          </div>

          {bookmarkedQuestions.length + bookmarkedTopics.length > 0 ? (
            <div className="space-y-2.5">
              {bookmarkedTopics.slice(0, 3).map((t) => {
                if (!t) return null;
                const unit = catalog.units.find((u) => u.id === t.unitId);
                return (
                  <button
                    key={`bt-${t.id}`}
                    type="button"
                    onClick={() => onNavigate('unit', unit?.slug, t.slug)}
                    className="w-full text-left p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                      Note: {t.title}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Unit {unit?.unitNumber}
                    </div>
                  </button>
                );
              })}
              {bookmarkedQuestions.slice(0, 3).map((q) => {
                if (!q) return null;
                return (
                  <button
                    key={`bq-${q.id}`}
                    type="button"
                    onClick={() => onNavigate('questions')}
                    className="w-full text-left p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                      Q: {q.questionText}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Section {q.section} · {q.marks} Marks
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400 py-4">
              Bookmark important 5-mark and 10-mark answers or study topics for rapid last-day
              revision.
            </div>
          )}
        </div>

        {/* Upcoming Exam Prep & High-Weight Practice */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                Upcoming Exam Preparation
              </h3>
            </div>
            <div className="space-y-2.5">
              {recommendedQuestions.map((q) => {
                const unit = catalog.units.find((u) => u.id === q.unitId);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => onNavigate('questions')}
                    className="w-full text-left p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                      Unit {unit?.unitNumber} · {q.marks} Marks · {q.practiceBadge}
                    </div>
                    <div className="text-xs font-medium text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">
                      {q.questionText}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('questions')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:underline cursor-pointer"
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Question Bank</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Start Mock Test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
