import React from 'react';
import {
  BookOpen,
  ClipboardCheck,
  FileQuestion,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Network,
  Search,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import type { AppView, UnitItem } from '../types/lms';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface LmsSidebarProps {
  units: UnitItem[];
  activeView: AppView;
  activeUnitSlug?: string;
  onNavigate: (view: AppView, unitSlug?: string) => void;
  onOpenSearch: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const LmsSidebar: React.FC<LmsSidebarProps> = ({
  units,
  activeView,
  activeUnitSlug,
  onNavigate,
  onOpenSearch,
  mobileOpen,
  onCloseMobile,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { firebaseUser, dbUser, signInWithGoogle, logout } = useAuth();

  const navContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-72">
      <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            onNavigate('home');
            onCloseMobile();
          }}
          className="font-display text-lg font-extrabold tracking-tight text-slate-950 dark:text-white cursor-pointer"
        >
          EXAM TIPS
        </button>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation drawer"
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            onOpenSearch();
            onCloseMobile();
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 hover:border-blue-500 transition-colors cursor-pointer"
        >
          <span className="inline-flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search topics or Q&amp;A...</span>
          </span>
          <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Ctrl K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
            Workspace
          </div>
          {[
            { id: 'home' as AppView, label: 'Portal Homepage', icon: Home },
            { id: 'dashboard' as AppView, label: 'Student Dashboard', icon: LayoutDashboard },
            { id: 'questions' as AppView, label: 'Question Bank', icon: FileQuestion },
            { id: 'practice' as AppView, label: 'Practice Tests & MCQ', icon: ClipboardCheck },
            { id: 'diagrams' as AppView, label: 'Interactive Diagrams', icon: Network },
            { id: 'admin' as AppView, label: 'Admin Studio', icon: ShieldCheck },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          <div className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1.5">
            Syllabus Units
          </div>
          {units.map((unit) => {
            const active = activeView === 'unit' && activeUnitSlug === unit.slug;
            return (
              <button
                key={unit.id}
                type="button"
                onClick={() => {
                  onNavigate('unit', unit.slug);
                  onCloseMobile();
                }}
                className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-mono opacity-75">Unit {unit.unitNumber}</div>
                  <div className="text-xs font-medium truncate">{unit.title}</div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {firebaseUser ? (
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {dbUser?.displayName || firebaseUser.displayName || firebaseUser.email}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {dbUser?.role === 'admin' ? 'Administrator Account' : 'Student Account'}
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In with Google</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block shrink-0 no-print">{navContent}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 h-full">{navContent}</div>
        </div>
      )}
    </>
  );
};
