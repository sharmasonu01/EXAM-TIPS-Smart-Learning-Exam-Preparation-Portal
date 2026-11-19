import React, { useCallback, useEffect, useState } from 'react';
import { Menu, Search } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import type { AppView, CatalogData } from './types/lms';
import { LandingPage } from './components/LandingPage';
import { LmsSidebar } from './components/LmsSidebar';
import { StudentDashboard } from './components/StudentDashboard';
import { UnitWorkspace } from './components/UnitWorkspace';
import { QuestionBank } from './components/QuestionBank';
import { PracticeTests } from './components/PracticeTests';
import { DiagramGallery } from './components/DiagramGallery';
import { AdminPanel } from './components/AdminPanel';
import { GlobalSearchModal } from './components/GlobalSearchModal';

function ExamTipsAppShell() {
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<AppView>('home');
  const [activeUnitSlug, setActiveUnitSlug] = useState<string | undefined>(undefined);
  const [activeTopicSlug, setActiveTopicSlug] = useState<string | undefined>(undefined);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const loadCatalog = useCallback(async () => {
    try {
      const res = await fetch('/api/catalog');
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to load curriculum catalog');
      }
      const data: CatalogData = await res.json();
      setCatalog(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unable to connect to portal');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNavigate = (view: AppView, unitSlug?: string, topicSlug?: string) => {
    setActiveView(view);
    if (unitSlug) setActiveUnitSlug(unitSlug);
    setActiveTopicSlug(topicSlug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 px-4">
        <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-800 border-t-blue-600 animate-spin mb-4" />
        <div className="font-display text-lg font-bold text-slate-950 dark:text-white">
          EXAM TIPS
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Loading syllabus units, diagrams, and exam bank...
        </p>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
        <h1 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          Unable to Load Study Portal
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-md">
          {error || 'Curriculum data is currently unavailable.'}
        </p>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            loadCatalog();
          }}
          className="mt-5 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold cursor-pointer"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const activeUnit =
    catalog.units.find((u) => u.slug === activeUnitSlug) || catalog.units[0];

  if (activeView === 'home') {
    return (
      <>
        <LandingPage catalog={catalog} onNavigate={handleNavigate} />
        <GlobalSearchModal
          open={searchOpen}
          catalog={catalog}
          onClose={() => setSearchOpen(false)}
          onNavigate={handleNavigate}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 print:block print:min-h-0 print:bg-white">
      <LmsSidebar
        units={catalog.units}
        activeView={activeView}
        activeUnitSlug={activeUnit?.slug}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
        mobileOpen={mobileDrawerOpen}
        onCloseMobile={() => setMobileDrawerOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col print:block">
        {/* Compact Workspace Top Bar */}
        <header className="sticky top-0 z-30 h-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
              {activeView === 'dashboard' && 'Student Dashboard'}
              {activeView === 'unit' && activeUnit && `Unit ${activeUnit.unitNumber} · ${activeUnit.title}`}
              {activeView === 'questions' && 'Important Questions & Answers'}
              {activeView === 'practice' && 'Practice Tests & Mock Exams'}
              {activeView === 'diagrams' && 'Interactive Technical Diagrams'}
              {activeView === 'admin' && 'Administrator Studio'}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search Portal</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto print:block print:p-0 print:max-w-none">
          {activeView === 'dashboard' && (
            <StudentDashboard catalog={catalog} onNavigate={handleNavigate} />
          )}
          {activeView === 'unit' && activeUnit && (
            <UnitWorkspace
              unit={activeUnit}
              catalog={catalog}
              initialTopicSlug={activeTopicSlug}
              onNavigate={handleNavigate}
            />
          )}
          {activeView === 'questions' && <QuestionBank catalog={catalog} />}
          {activeView === 'practice' && <PracticeTests catalog={catalog} />}
          {activeView === 'diagrams' && <DiagramGallery catalog={catalog} />}
          {activeView === 'admin' && <AdminPanel onCatalogUpdated={loadCatalog} />}
        </main>
      </div>

      <GlobalSearchModal
        open={searchOpen}
        catalog={catalog}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExamTipsAppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
