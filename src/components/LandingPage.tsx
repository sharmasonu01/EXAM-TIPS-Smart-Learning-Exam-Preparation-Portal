import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers,
  Menu,
  Moon,
  Send,
  Sun,
  X,
} from 'lucide-react';
import type { AppView, CatalogData } from '../types/lms';
import { useTheme } from '../context/ThemeContext';
import { ResilientImage } from './ResilientImage';

interface LandingPageProps {
  catalog: CatalogData;
  onNavigate: (view: AppView, unitSlug?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ catalog, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactStatus, setContactStatus] = useState<
    'idle' | 'submitting' | 'sent' | 'error'
  >('idle');
  const [contactError, setContactError] = useState('');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.subject || !contactForm.message) {
      setContactError('Please complete every field before submitting.');
      setContactStatus('error');
      return;
    }
    setContactStatus('submitting');
    setContactError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Could not send message.');
      }
      setContactStatus('sent');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      setContactStatus('error');
      setContactError(err instanceof Error ? err.message : 'Submission failed.');
    }
  };

  const featuredQuestions = catalog.questions.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Top Bar Contract: Brand wordmark — Nav links — 1 primary CTA */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#home"
            className="font-display text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
          >
            EXAM TIPS
          </a>

          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
          >
            <a href="#home" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              Home
            </a>
            <a href="#courses" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              Courses
            </a>
            <button
              type="button"
              onClick={() => onNavigate('unit', catalog.units[0]?.slug)}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Study Materials
            </button>
            <button
              type="button"
              onClick={() => onNavigate('questions')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Important Questions
            </button>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Practice Tests
            </button>
            <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              About
            </a>
            <a href="#contact" className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Start Learning
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle mobile menu"
              className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2">
            {[
              { label: 'Home', action: () => setMobileMenuOpen(false), href: '#home' },
              { label: 'Courses', action: () => setMobileMenuOpen(false), href: '#courses' },
              {
                label: 'Study Materials',
                action: () => {
                  setMobileMenuOpen(false);
                  onNavigate('unit', catalog.units[0]?.slug);
                },
              },
              {
                label: 'Important Questions',
                action: () => {
                  setMobileMenuOpen(false);
                  onNavigate('questions');
                },
              },
              {
                label: 'Practice Tests',
                action: () => {
                  setMobileMenuOpen(false);
                  onNavigate('practice');
                },
              },
              { label: 'About', action: () => setMobileMenuOpen(false), href: '#about' },
              { label: 'Contact', action: () => setMobileMenuOpen(false), href: '#contact' },
            ].map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={item.action}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900"
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-grid-pattern border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <p className="text-xs font-medium tracking-wide text-blue-600 dark:text-blue-400 mb-3">
                EXAM PREP · Smart Learning &amp; University Exam Portal
              </p>
              <h1
                className="font-display font-bold tracking-tight text-slate-950 dark:text-white text-balance leading-[1.08]"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.75rem)' }}
              >
                Prepare Smart. Learn Better. Score Higher.
              </h1>
              <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                Master your entire Web Technologies university syllabus in one focused workspace.
                Explore complete 5-unit study notes, interactive SVG architecture diagrams,
                structured 2/5/8/10-mark exam answers, and timed MCQ mock tests.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href="#courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Explore Courses</span>
                </a>
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle light and dark theme"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="lg:col-span-6"
            >
              <div className="h-full min-h-[280px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <ResilientImage
                  src="/src/assets/images/hero_exam_prep_portal_1794835991664.jpg"
                  alt="Isometric illustration of a modern university digital learning workspace"
                  fallbackTitle="EXAM TIPS Smart Study Architecture"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* Full-width KPI Statistics Strip */}
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-display font-bold tabular-nums text-slate-950 dark:text-white">
                {catalog.units.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Complete Syllabus Units · 100% Topic Coverage
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-display font-bold tabular-nums text-slate-950 dark:text-white">
                {catalog.topics.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Structured Topic Notes &amp; Code Walkthroughs
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-display font-bold tabular-nums text-slate-950 dark:text-white">
                {catalog.diagrams.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Interactive SVG Architecture &amp; Flow Diagrams
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
              <div className="text-2xl sm:text-3xl font-display font-bold tabular-nums text-slate-950 dark:text-white">
                {catalog.questions.length + catalog.mcqs.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Exam Answers (2/5/8/10M) &amp; Unit MCQs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Study Materials / Courses (5 Units) */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-10">
          <div className="lg:col-span-7">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
              Curriculum Modules
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white text-balance">
              Complete Five-Unit University Syllabus
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Every syllabus point is mapped to clear definitions, practical HTML/CSS/JS/XML/AJAX
              code snippets, comparison tables, quick revision sheets, and interactive SVG diagrams.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-[4/3] max-h-56 w-full bg-white dark:bg-slate-900">
              <ResilientImage
                src="/src/assets/images/unit_architecture_banner_1794835994011.jpg"
                alt="Technical isometric schematic of web servers, DNS routing nodes, and layered protocols"
                fallbackTitle="Unit Web Architecture Blueprint"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalog.units.map((unit) => {
            const unitTopicsCount = catalog.topics.filter((t) => t.unitId === unit.id).length;
            const unitDiagramsCount = catalog.diagrams.filter((d) => d.unitId === unit.id).length;
            const unitQuestionsCount = catalog.questions.filter((q) => q.unitId === unit.id).length;

            return (
              <div
                key={unit.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-blue-500/60 dark:hover:border-blue-400/60 transition-colors"
              >
                <div>
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                    Unit {unit.unitNumber} · {unitTopicsCount} Topics · {unit.examWeight}
                  </div>
                  <h3 className="font-display text-lg font-bold text-slate-950 dark:text-white mt-2">
                    {unit.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    {unit.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                    {unit.syllabus.slice(0, 4).map((item, idx) => (
                      <div
                        key={item}
                        className="text-xs text-slate-600 dark:text-slate-400 truncate"
                      >
                        0{idx + 1}. {item}
                      </div>
                    ))}
                    {unit.syllabus.length > 4 && (
                      <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        + {unit.syllabus.length - 4} more syllabus topics
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    {unitDiagramsCount} Diagrams · {unitQuestionsCount} Q&amp;A
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('unit', unit.slug)}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Open Unit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Practice Test Showcase Card */}
          <div className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-slate-900 text-white p-6">
            <div>
              <div className="text-xs font-medium text-blue-300">
                Interactive Examination Engine
              </div>
              <h3 className="font-display text-lg font-bold mt-2">
                Timed Mock Exams &amp; Unit MCQs
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Practice randomized unit-wise quizzes or simulate a full 5-unit timed university
                examination with instant feedback, detailed rationales, and score analytics.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onNavigate('practice')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Take Practice Test</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('diagrams')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>View All Diagrams</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Important Questions Bank Preview */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                  Structured Exam Answers
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white text-balance">
                  Section A, B &amp; C Practice Question Bank
                </h2>
                <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                  Every recommended practice question includes an exam-ready structure:
                  Introduction, Core Explanation, Real-World Examples, Labeled Diagram,
                  Advantages &amp; Disadvantages, Conclusion, and High-Yield Keywords.
                </p>
              </div>
              <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-[4/3]">
                <ResilientImage
                  src="/src/assets/images/exam_practice_illustration_1794835993350.jpg"
                  alt="Overhead photograph of structured university exam revision sheets and flowchart cards"
                  fallbackTitle="Exam Answer Structure"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              {featuredQuestions.map((q) => {
                const unit = catalog.units.find((u) => u.id === q.unitId);
                return (
                  <div
                    key={q.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5"
                  >
                    <div className="text-xs font-medium text-slate-500 dark:text-slate-400 tabular-nums">
                      Unit {unit?.unitNumber} · Section {q.section} · {q.marks} Marks · {q.practiceBadge}
                    </div>
                    <h3 className="font-display text-base font-semibold text-slate-950 dark:text-white mt-1.5">
                      {q.questionText}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                      {q.introduction} {q.mainExplanation}
                    </p>
                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                      Keywords: {q.keywords.join(' · ')}
                    </div>
                  </div>
                );
              })}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('questions')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Explore Complete Question Bank</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Exam Tips & About */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
            Why Choose EXAM TIPS
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white text-balance">
            Built Specifically for University Examination Scoring
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: '01. Syllabus-First Rigor',
              body: 'Every topic from ARPANET and DNS to XML SAX/DOM, SOAP/WSDL, Semantic RDF, and 5G WebXR is mapped cleanly without gaps.',
            },
            {
              icon: Layers,
              title: '02. Interactive Technical Diagrams',
              body: 'Step-through SVG architecture and protocol flowcharts with zoom and fullscreen clarity replace blurry static textbook scans.',
            },
            {
              icon: CheckCircle2,
              title: '03. Mark-Calibrated Answers',
              body: 'Clear distinction between 2-mark definitions, 5-mark comparisons, and 8/10-mark architectural essays with exam keywords.',
            },
            {
              icon: ClipboardCheck,
              title: '04. Cloud-Synced Progress',
              body: 'Track completed topics, bookmark tricky questions, switch to Quick Revision Mode, and log MCQ mock exam scores.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
              >
                <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-display text-base font-bold text-slate-950 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                  {item.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                Student Support &amp; Feedback
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                Request Notes or Report Corrections
              </h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Have a syllabus suggestion, doubt on a 10-mark diagram, or request for additional
                practice questions? Send a message directly to the portal administrator.
              </p>
              <div className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div>Portal: EXAM PREP — Smart Learning &amp; Exam Preparation Portal</div>
                <div>Coverage: Units 1–5 · Computer Science &amp; Web Technologies</div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleContactSubmit}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 p-6 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Aarav Sharma"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                      University Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="student@university.edu"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Subject / Unit
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="e.g., Unit 3 SOAP WSDL Clarification"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Write your question or syllabus feedback..."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                {contactStatus === 'error' && (
                  <p className="text-xs font-medium text-red-600 dark:text-red-400">
                    {contactError}
                  </p>
                )}
                {contactStatus === 'sent' && (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Message saved successfully. Thank you for reaching out.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={contactStatus === 'submitting'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{contactStatus === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="font-display text-base font-bold text-slate-950 dark:text-white">
              EXAM TIPS
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              EXAM PREP — Smart Learning &amp; Exam Preparation Portal. Practice questions are study
              recommendations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
            <button type="button" onClick={() => onNavigate('dashboard')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
              Student Dashboard
            </button>
            <button type="button" onClick={() => onNavigate('questions')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
              Question Bank
            </button>
            <button type="button" onClick={() => onNavigate('practice')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
              MCQ Practice Tests
            </button>
            <button type="button" onClick={() => onNavigate('diagrams')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
              Diagrams
            </button>
            <button type="button" onClick={() => onNavigate('admin')} className="hover:text-slate-900 dark:hover:text-white cursor-pointer">
              Admin Panel
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
