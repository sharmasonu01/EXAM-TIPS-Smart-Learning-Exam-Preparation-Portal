import React from 'react';
import { Printer } from 'lucide-react';
import type { CatalogData } from '../types/lms';
import { QuestionCardList } from './QuestionCardList';

interface QuestionBankProps {
  catalog: CatalogData;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ catalog }) => {
  return (
    <div className="space-y-6 print-container">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Course: Web Technology · Question Bank · Section A (2M), Section B (5M), Section C (8 &amp; 10M)
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
              Important Practice Questions &amp; Structured Answers
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 max-w-3xl">
              Recommended practice questions for university exam preparation—switch anytime between
              Exam Mode (Professional English) and Learning Mode (Simple Hinglish).
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer no-print"
          >
            <Printer className="w-4 h-4" />
            <span>Print Question Sheet</span>
          </button>
        </div>
      </div>

      <QuestionCardList catalog={catalog} showUnitSelector />
    </div>
  );
};
