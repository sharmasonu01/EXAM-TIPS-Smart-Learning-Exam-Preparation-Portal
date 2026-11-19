import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, Send, XCircle } from 'lucide-react';
import type { McqItem, UnitItem } from '../types/lms';
import { useAuth } from '../context/AuthContext';

interface UnitMcqRunnerProps {
  unit: UnitItem;
  mcqs: McqItem[];
}

export const UnitMcqRunner: React.FC<UnitMcqRunnerProps> = ({ unit, mcqs }) => {
  const { saveQuizAttempt } = useAuth();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(() => Date.now());

  const answeredCount = Object.keys(selectedAnswers).length;
  const total = mcqs.length;

  const score = submitted
    ? mcqs.reduce((acc, q) => (selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc), 0)
    : 0;
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const handleSubmit = async () => {
    setSubmitted(true);
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
    const computedScore = mcqs.reduce(
      (acc, q) => (selectedAnswers[q.id] === q.correctIndex ? acc + 1 : acc),
      0
    );
    const pct = total > 0 ? Math.round((computedScore / total) * 100) : 0;

    await saveQuizAttempt({
      unitId: unit.id,
      mode: 'practice',
      score: computedScore,
      totalQuestions: total,
      percentage: pct,
      durationSeconds,
    });
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setStartedAt(Date.now());
  };

  if (mcqs.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-600 dark:text-slate-400">
        No MCQs are currently published for Unit {unit.unitNumber}.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header / Score Summary Banner */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Unit {unit.unitNumber} Assessment · {total} Multiple-Choice Questions
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mt-1">
              {submitted
                ? `Final Result: ${score} / ${total} (${percentage}%)`
                : `Unit ${unit.unitNumber} MCQ Practice Test`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 tabular-nums">
              {submitted
                ? percentage >= 75
                  ? 'Strong performance — review any highlighted explanations below to reinforce concepts.'
                  : 'Good practice attempt — review the explanations below and retake the test to aim for 80%+.'
                : `Select one option per question (${answeredCount} of ${total} answered), then click Submit Test.`}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {submitted ? (
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Test</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={answeredCount === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Test ({answeredCount}/{total})</span>
              </button>
            )}
          </div>
        </div>

        {/* Animated Progress / Score Bar */}
        <div className="mt-4 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              submitted
                ? percentage >= 75
                  ? 'bg-emerald-600'
                  : 'bg-amber-500'
                : 'bg-blue-600'
            }`}
            style={{
              width: `${submitted ? percentage : Math.round((answeredCount / total) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* All Unit MCQs with Radio Selection */}
      <div className="space-y-4">
        {mcqs.map((q, qIdx) => {
          const chosenIdx = selectedAnswers[q.id];
          const isCorrect = chosenIdx === q.correctIndex;

          return (
            <div
              key={q.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm sm:text-base font-semibold text-slate-950 dark:text-white">
                  {q.questionText.match(/^\d+\./) ? q.questionText : `${qIdx + 1}. ${q.questionText}`}
                </div>
                {submitted ? (
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
                ) : (
                  <span className="text-xs font-mono text-slate-400 shrink-0">
                    {q.difficulty}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {q.options.map((opt, optIdx) => {
                  const isSelected = chosenIdx === optIdx;
                  const isRightOption = optIdx === q.correctIndex;

                  let optionStyle =
                    'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 hover:border-blue-500';
                  if (submitted) {
                    if (isRightOption) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/35 text-emerald-950 dark:text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      optionStyle =
                        'border-red-400 bg-red-50/70 dark:bg-red-950/35 text-red-900 dark:text-red-200';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-950 dark:text-blue-100 font-medium';
                  }

                  return (
                    <label
                      key={optIdx}
                      className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border text-xs sm:text-sm transition-colors ${
                        submitted ? 'cursor-default' : 'cursor-pointer'
                      } ${optionStyle}`}
                    >
                      <input
                        type="radio"
                        name={`unit-${unit.id}-mcq-${q.id}`}
                        checked={isSelected}
                        disabled={submitted}
                        onChange={() =>
                          setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                        }
                        className="mt-0.5 accent-blue-600 shrink-0"
                      />
                      <span className="flex-1">
                        <span className="font-mono font-semibold mr-1.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </span>
                      {submitted && isRightOption && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      {submitted && isSelected && !isRightOption && (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Explanation:{' '}
                  </span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit / Retake Bar */}
      <div className="flex justify-end">
        {submitted ? (
          <button
            type="button"
            onClick={handleRetake}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Unit {unit.unitNumber} Test</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-semibold cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Test ({answeredCount}/{total} Answered)</span>
          </button>
        )}
      </div>
    </div>
  );
};
