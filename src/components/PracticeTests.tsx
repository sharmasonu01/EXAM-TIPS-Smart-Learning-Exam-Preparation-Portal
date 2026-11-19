import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Timer,
  XCircle,
} from 'lucide-react';
import type { CatalogData, McqItem } from '../types/lms';
import { useAuth } from '../context/AuthContext';

interface PracticeTestsProps {
  catalog: CatalogData;
}

function shuffleItems<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const PracticeTests: React.FC<PracticeTestsProps> = ({ catalog }) => {
  const { studentState, saveQuizAttempt } = useAuth();
  const [selectedUnitId, setSelectedUnitId] = useState<number | 'all'>('all');
  const [mode, setMode] = useState<'practice' | 'timed-mock'>('practice');
  const [phase, setPhase] = useState<'setup' | 'active' | 'results'>('setup');

  const [quizMcqs, setQuizMcqs] = useState<McqItem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const availablePool = useMemo(
    () =>
      selectedUnitId === 'all'
        ? catalog.mcqs
        : catalog.mcqs.filter((m) => m.unitId === selectedUnitId),
    [catalog.mcqs, selectedUnitId]
  );

  // Timer effect during active exam
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => {
      setElapsedSeconds((e) => e + 1);
      if (mode === 'timed-mock') {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            finishExam(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode]);

  const startTest = () => {
    const randomized = shuffleItems(availablePool).slice(
      0,
      selectedUnitId === 'all' ? 20 : availablePool.length
    );
    if (randomized.length === 0) return;
    setQuizMcqs(randomized);
    setAnswers({});
    setCurrentIdx(0);
    setElapsedSeconds(0);
    setSecondsLeft(randomized.length * 45);
    setPhase('active');
  };

  const finishExam = async (autoSubmitted = false) => {
    void autoSubmitted;
    const score = quizMcqs.reduce((acc, q, idx) => {
      return answers[idx] === q.correctIndex ? acc + 1 : acc;
    }, 0);
    const total = quizMcqs.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
    setPhase('results');
    await saveQuizAttempt({
      unitId: selectedUnitId === 'all' ? null : selectedUnitId,
      mode,
      score,
      totalQuestions: total,
      percentage,
      durationSeconds: elapsedSeconds,
    });
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Interactive Examination System
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
            Practice Tests &amp; Timed Mock Examinations
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
            Choose a single unit or simulate a full 5-unit randomized mock examination. Practice
            mode displays instant explanations after each answer; Timed Mock mode grades all
            questions at submission.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                1. Select Syllabus Scope
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) =>
                  setSelectedUnitId(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="all">
                  Full Mock Exam · All 5 Units (20 Randomized MCQs)
                </option>
                {catalog.units.map((u) => {
                  const count = catalog.mcqs.filter((m) => m.unitId === u.id).length;
                  return (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber}: {u.title} ({count} MCQs)
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                2. Select Exam Mode
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode('practice')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    mode === 'practice'
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Practice (Instant Feedback)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('timed-mock')}
                  className={`py-2 px-3 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                    mode === 'timed-mock'
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Timed Mock Exam
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Available Question Bank: {availablePool.length} verified MCQs · Randomized order
            </div>
            <button
              type="button"
              onClick={startTest}
              disabled={availablePool.length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Start Examination</span>
            </button>
          </div>
        </div>

        {/* Recent Attempts History */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <h2 className="font-display text-lg font-bold text-slate-950 dark:text-white mb-4">
            Recent Test Attempts
          </h2>
          {studentState.attempts.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No practice tests completed yet. Start a test above to log your scores.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-2 pr-4 font-semibold">Scope</th>
                    <th className="py-2 pr-4 font-semibold">Mode</th>
                    <th className="py-2 pr-4 font-semibold">Score</th>
                    <th className="py-2 pr-4 font-semibold">Percentage</th>
                    <th className="py-2 font-semibold">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 tabular-nums">
                  {studentState.attempts.map((a) => {
                    const u = catalog.units.find((unit) => unit.id === a.unitId);
                    return (
                      <tr key={a.id}>
                        <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-slate-100">
                          {u ? `Unit ${u.unitNumber}: ${u.title}` : 'Full 5-Unit Mock'}
                        </td>
                        <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-300">
                          {a.mode === 'timed-mock' ? 'Timed Mock' : 'Practice'}
                        </td>
                        <td className="py-2.5 pr-4 font-mono">
                          {a.score} / {a.totalQuestions}
                        </td>
                        <td className="py-2.5 pr-4 font-mono font-semibold text-blue-600 dark:text-blue-400">
                          {a.percentage}%
                        </td>
                        <td className="py-2.5 font-mono text-slate-500">
                          {formatTimer(a.durationSeconds)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    const score = quizMcqs.reduce(
      (acc, q, idx) => (answers[idx] === q.correctIndex ? acc + 1 : acc),
      0
    );
    const pct = quizMcqs.length > 0 ? Math.round((score / quizMcqs.length) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Examination Result Summary
              </div>
              <h1 className="font-display text-3xl font-bold text-slate-950 dark:text-white mt-1 tabular-nums">
                Score: {score} / {quizMcqs.length} ({pct}%)
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 tabular-nums">
                Completed in {formatTimer(elapsedSeconds)} ·{' '}
                {pct >= 75
                  ? 'Strong mastery — keep revising diagrams for Section C.'
                  : 'Review the explanations below and revisit highlighted unit notes.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={startTest}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Test</span>
              </button>
              <button
                type="button"
                onClick={() => setPhase('setup')}
                className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Change Unit / Mode
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {quizMcqs.map((q, idx) => {
            const chosen = answers[idx];
            const isCorrect = chosen === q.correctIndex;
            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-950 dark:text-white">
                    {idx + 1}. {q.questionText}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
                      isCorrect
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oIdx) => {
                    const isRightOpt = oIdx === q.correctIndex;
                    const isChosenOpt = oIdx === chosen;
                    return (
                      <div
                        key={oIdx}
                        className={`px-3 py-2 rounded-lg border text-xs ${
                          isRightOpt
                            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : isChosenOpt
                            ? 'border-red-400 bg-red-50/70 dark:bg-red-950/30 text-red-800 dark:text-red-200'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    );
                  })}
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <span className="font-semibold">Explanation: </span>
                  {q.explanation}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quiz Phase
  const currentQ = quizMcqs[currentIdx];
  const selectedOpt = answers[currentIdx];
  const showInstantFeedback = mode === 'practice' && selectedOpt !== undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
            Question {currentIdx + 1} of {quizMcqs.length} · {currentQ.difficulty}
          </div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
            {mode === 'timed-mock' ? (
              <>
                <Timer className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Remaining: {formatTimer(secondsLeft)}</span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Elapsed: {formatTimer(elapsedSeconds)}</span>
              </>
            )}
          </div>
        </div>

        <h2 className="font-display text-lg sm:text-xl font-bold text-slate-950 dark:text-white">
          {currentQ.questionText}
        </h2>

        <div className="space-y-2.5">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedOpt === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let styleClass =
              'border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100';

            if (showInstantFeedback) {
              if (isCorrect) {
                styleClass =
                  'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold';
              } else if (isSelected) {
                styleClass =
                  'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200';
              }
            } else if (isSelected) {
              styleClass =
                'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 font-semibold';
            }

            return (
              <label
                key={idx}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-colors flex items-center justify-between gap-3 ${
                  showInstantFeedback ? 'cursor-default' : 'cursor-pointer'
                } ${styleClass}`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`practice-mcq-${currentQ.id}`}
                    checked={isSelected}
                    disabled={showInstantFeedback}
                    onChange={() =>
                      setAnswers((prev) => ({ ...prev, [currentIdx]: idx }))
                    }
                    className="accent-blue-600 shrink-0"
                  />
                  <span>
                    <span className="font-mono font-semibold mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </span>
                </span>
                {showInstantFeedback && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                )}
                {showInstantFeedback && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
              </label>
            );
          })}
        </div>

        {showInstantFeedback && (
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">
              Answer Explanation:{' '}
            </span>
            {currentQ.explanation}
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
          >
            Previous
          </button>

          {currentIdx < quizMcqs.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx((i) => i + 1)}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              Next Question
            </button>
          ) : (
            <button
              type="button"
              onClick={() => finishExam(false)}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
            >
              Submit &amp; Score Test
            </button>
          )}
        </div>
      </div>

      {/* Question Navigator Grid */}
      <div className="lg:col-span-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Question Navigator
        </div>
        <div className="grid grid-cols-5 gap-2 tabular-nums">
          {quizMcqs.map((q, idx) => {
            const answered = answers[idx] !== undefined;
            const isCurrent = idx === currentIdx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`h-9 rounded-lg border text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : answered
                    ? 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => finishExam(false)}
          className="w-full py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 cursor-pointer"
        >
          Finish Examination Early
        </button>
      </div>
    </div>
  );
};
