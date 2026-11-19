import React, { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LogIn,
  Plus,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type {
  DbUser,
  DiagramItem,
  McqItem,
  QuestionItem,
  TopicItem,
  UnitItem,
} from '../types/lms';

interface AdminOverview {
  units: UnitItem[];
  topics: TopicItem[];
  questions: QuestionItem[];
  mcqs: McqItem[];
  diagrams: DiagramItem[];
  users: DbUser[];
  messages: Array<{
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
  }>;
}

interface AdminPanelProps {
  onCatalogUpdated: () => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onCatalogUpdated }) => {
  const { firebaseUser, dbUser, idToken, signInWithGoogle } = useAuth();
  const [tab, setTab] = useState<
    'units' | 'topics' | 'questions' | 'mcqs' | 'diagrams' | 'users'
  >('units');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Forms
  const [newUnit, setNewUnit] = useState({
    unitNumber: 6,
    slug: 'unit-6-cloud-and-devops',
    title: '',
    subtitle: '',
    description: '',
    examWeight: '20% Weightage',
    syllabusText: '',
  });
  const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
  const [unitEditTitle, setUnitEditTitle] = useState('');
  const [unitEditSyllabus, setUnitEditSyllabus] = useState('');

  const [newTopic, setNewTopic] = useState({
    unitId: 1,
    title: '',
    definition: '',
    explanation: '',
    takeawaysText: '',
  });

  const [newQuestion, setNewQuestion] = useState({
    unitId: 1,
    section: 'B',
    marks: 5,
    questionText: '',
    introduction: '',
    mainExplanation: '',
    examples: '',
    conclusion: '',
    keywordsText: '',
  });

  const [newMcq, setNewMcq] = useState({
    unitId: 1,
    questionText: '',
    opt0: '',
    opt1: '',
    opt2: '',
    opt3: '',
    correctIndex: 0,
    explanation: '',
    difficulty: 'Medium',
  });

  const [newDiagram, setNewDiagram] = useState({
    unitId: 1,
    diagramKey: '',
    title: '',
    category: 'Architecture',
    summary: '',
    stepsText: 'Step 1: Input\nStep 2: Process\nStep 3: Output',
  });

  const loadOverview = useCallback(async () => {
    if (!idToken || dbUser?.role !== 'admin') return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Failed to load admin overview');
      }
      const data: AdminOverview = await res.json();
      setOverview(data);
      if (data.units.length > 0) {
        setNewTopic((p) => ({ ...p, unitId: p.unitId || data.units[0].id }));
        setNewQuestion((p) => ({ ...p, unitId: p.unitId || data.units[0].id }));
        setNewMcq((p) => ({ ...p, unitId: p.unitId || data.units[0].id }));
        setNewDiagram((p) => ({ ...p, unitId: p.unitId || data.units[0].id }));
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Admin load error');
    } finally {
      setLoading(false);
    }
  }, [idToken, dbUser?.role]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const notify = async (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
    await loadOverview();
    await onCatalogUpdated();
  };

  if (!firebaseUser) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center max-w-xl mx-auto">
        <ShieldAlert className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
        <h1 className="font-display text-2xl font-bold text-slate-950 dark:text-white">
          Administrator Authentication Required
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Sign in with your administrator Google account to manage units, syllabus notes,
          exam questions, MCQ tests, diagrams, and student permissions.
        </p>
        <button
          type="button"
          onClick={signInWithGoogle}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>Sign In with Google</span>
        </button>
      </div>
    );
  }

  if (dbUser?.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-white dark:bg-slate-900 p-8 text-center max-w-xl mx-auto">
        <ShieldAlert className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
        <h1 className="font-display text-xl font-bold text-slate-950 dark:text-white">
          Access Restricted to Administrators
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
          Signed in as <span className="font-mono">{dbUser?.email || firebaseUser.email}</span>{' '}
          (Student role). Ask the portal administrator to elevate your account role to Admin.
        </p>
      </div>
    );
  }

  const authFetch = async (url: string, options: RequestInit = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || 'Operation failed');
    }
    return res.json();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Role-Based Access Control · Administrator Studio
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white mt-1">
              LMS Content &amp; Student Management
            </h1>
          </div>
          {feedback && (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedback}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-fit">
          {[
            { id: 'units', label: `Units (${overview?.units.length || 0})` },
            { id: 'topics', label: `Study Notes (${overview?.topics.length || 0})` },
            { id: 'questions', label: `Exam Q&A (${overview?.questions.length || 0})` },
            { id: 'mcqs', label: `MCQs (${overview?.mcqs.length || 0})` },
            { id: 'diagrams', label: `Diagrams (${overview?.diagrams.length || 0})` },
            { id: 'users', label: `Students & Inbox (${overview?.users.length || 0})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id as typeof tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                tab === t.id
                  ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {errorMsg && (
          <p className="mt-3 text-xs font-medium text-red-600 dark:text-red-400">
            {errorMsg}
          </p>
        )}
      </div>

      {loading && !overview ? (
        <div className="p-8 text-center text-sm text-slate-500">Loading admin workspace...</div>
      ) : null}

      {/* UNITS MANAGEMENT */}
      {tab === 'units' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await authFetch('/api/admin/units', {
                  method: 'POST',
                  body: JSON.stringify({
                    ...newUnit,
                    syllabus: newUnit.syllabusText
                      .split('\n')
                      .map((s) => s.trim())
                      .filter(Boolean),
                    quickRevision: [],
                  }),
                });
                setNewUnit({
                  unitNumber: overview.units.length + 2,
                  slug: `unit-${overview.units.length + 2}`,
                  title: '',
                  subtitle: '',
                  description: '',
                  examWeight: '20% Weightage',
                  syllabusText: '',
                });
                await notify('New unit created.');
              } catch (err: unknown) {
                setErrorMsg(err instanceof Error ? err.message : 'Failed');
              }
            }}
            className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
          >
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
              Add New Unit
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                required
                value={newUnit.unitNumber}
                onChange={(e) => setNewUnit((p) => ({ ...p, unitNumber: Number(e.target.value) }))}
                placeholder="Unit #"
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              />
              <input
                type="text"
                required
                value={newUnit.slug}
                onChange={(e) => setNewUnit((p) => ({ ...p, slug: e.target.value }))}
                placeholder="unit-6-slug"
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              />
            </div>
            <input
              type="text"
              required
              value={newUnit.title}
              onChange={(e) => setNewUnit((p) => ({ ...p, title: e.target.value }))}
              placeholder="Unit Title"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <input
              type="text"
              required
              value={newUnit.subtitle}
              onChange={(e) => setNewUnit((p) => ({ ...p, subtitle: e.target.value }))}
              placeholder="Unit Subtitle"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={2}
              required
              value={newUnit.description}
              onChange={(e) => setNewUnit((p) => ({ ...p, description: e.target.value }))}
              placeholder="Unit Overview Description"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={3}
              value={newUnit.syllabusText}
              onChange={(e) => setNewUnit((p) => ({ ...p, syllabusText: e.target.value }))}
              placeholder="Syllabus items (one per line)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Unit</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {overview.units.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-mono text-slate-500">
                      Unit {u.unitNumber} · {u.published ? 'Published' : 'Unpublished Draft'}
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-950 dark:text-white mt-0.5">
                      {u.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Syllabus topics: {u.syllabus.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUnitId(editingUnitId === u.id ? null : u.id);
                        setUnitEditTitle(u.title);
                        setUnitEditSyllabus(u.syllabus.join('\n'));
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await authFetch(`/api/admin/units/${u.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ published: !u.published }),
                        });
                        await notify(`Unit ${u.unitNumber} ${u.published ? 'unpublished' : 'published'}.`);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium cursor-pointer"
                    >
                      {u.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{u.published ? 'Unpublish' : 'Publish'}</span>
                    </button>
                  </div>
                </div>

                {editingUnitId === u.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <input
                      type="text"
                      value={unitEditTitle}
                      onChange={(e) => setUnitEditTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                    />
                    <textarea
                      rows={4}
                      value={unitEditSyllabus}
                      onChange={(e) => setUnitEditSyllabus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        await authFetch(`/api/admin/units/${u.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({
                            title: unitEditTitle,
                            syllabus: unitEditSyllabus
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean),
                          }),
                        });
                        setEditingUnitId(null);
                        await notify('Unit syllabus updated.');
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
                    >
                      Save Unit Changes
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOPICS MANAGEMENT */}
      {tab === 'topics' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await authFetch('/api/admin/topics', {
                method: 'POST',
                body: JSON.stringify({
                  unitId: newTopic.unitId,
                  orderIndex:
                    overview.topics.filter((t) => t.unitId === newTopic.unitId).length + 1,
                  title: newTopic.title,
                  definition: newTopic.definition,
                  explanation: newTopic.explanation,
                  examples: [],
                  keyTakeaways: newTopic.takeawaysText
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                }),
              });
              setNewTopic((p) => ({
                ...p,
                title: '',
                definition: '',
                explanation: '',
                takeawaysText: '',
              }));
              await notify('Study topic added.');
            }}
            className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
          >
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
              Upload New Study Topic
            </h2>
            <select
              value={newTopic.unitId}
              onChange={(e) => setNewTopic((p) => ({ ...p, unitId: Number(e.target.value) }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            >
              {overview.units.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber}: {u.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              value={newTopic.title}
              onChange={(e) => setNewTopic((p) => ({ ...p, title: e.target.value }))}
              placeholder="Topic Title"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={2}
              required
              value={newTopic.definition}
              onChange={(e) => setNewTopic((p) => ({ ...p, definition: e.target.value }))}
              placeholder="Concise Exam Definition"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={4}
              required
              value={newTopic.explanation}
              onChange={(e) => setNewTopic((p) => ({ ...p, explanation: e.target.value }))}
              placeholder="Detailed Technical Explanation"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={2}
              value={newTopic.takeawaysText}
              onChange={(e) => setNewTopic((p) => ({ ...p, takeawaysText: e.target.value }))}
              placeholder="Key Takeaways (one per line)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Study Note</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {overview.topics.map((t) => {
              const u = overview.units.find((unit) => unit.id === t.unitId);
              return (
                <div
                  key={t.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-slate-500">
                      Unit {u?.unitNumber} · Topic {t.orderIndex} · {t.published ? 'Published' : 'Hidden'}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {t.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        await authFetch(`/api/admin/topics/${t.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ published: !t.published }),
                        });
                        await notify('Topic visibility updated.');
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs cursor-pointer"
                    >
                      {t.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await authFetch(`/api/admin/topics/${t.id}`, { method: 'DELETE' });
                        await notify('Topic deleted.');
                      }}
                      aria-label="Delete topic"
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* IMPORTANT QUESTIONS MANAGEMENT */}
      {tab === 'questions' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await authFetch('/api/admin/questions', {
                method: 'POST',
                body: JSON.stringify({
                  unitId: newQuestion.unitId,
                  section: newQuestion.section,
                  marks: newQuestion.marks,
                  questionText: newQuestion.questionText,
                  introduction: newQuestion.introduction,
                  mainExplanation: newQuestion.mainExplanation,
                  examples: newQuestion.examples,
                  conclusion: newQuestion.conclusion,
                  keywords: newQuestion.keywordsText
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
                }),
              });
              setNewQuestion((p) => ({
                ...p,
                questionText: '',
                introduction: '',
                mainExplanation: '',
                examples: '',
                conclusion: '',
                keywordsText: '',
              }));
              await notify('Important question added.');
            }}
            className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
          >
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
              Add Exam Practice Question
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={newQuestion.unitId}
                onChange={(e) => setNewQuestion((p) => ({ ...p, unitId: Number(e.target.value) }))}
                className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              >
                {overview.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unitNumber}
                  </option>
                ))}
              </select>
              <select
                value={newQuestion.section}
                onChange={(e) => setNewQuestion((p) => ({ ...p, section: e.target.value }))}
                className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              >
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
              </select>
              <select
                value={newQuestion.marks}
                onChange={(e) => setNewQuestion((p) => ({ ...p, marks: Number(e.target.value) }))}
                className="px-2.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              >
                <option value={2}>2 Marks</option>
                <option value={5}>5 Marks</option>
                <option value={8}>8 Marks</option>
                <option value={10}>10 Marks</option>
              </select>
            </div>
            <input
              type="text"
              required
              value={newQuestion.questionText}
              onChange={(e) => setNewQuestion((p) => ({ ...p, questionText: e.target.value }))}
              placeholder="Question Prompt"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={2}
              value={newQuestion.introduction}
              onChange={(e) => setNewQuestion((p) => ({ ...p, introduction: e.target.value }))}
              placeholder="Introduction"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={3}
              required
              value={newQuestion.mainExplanation}
              onChange={(e) => setNewQuestion((p) => ({ ...p, mainExplanation: e.target.value }))}
              placeholder="Main Explanation"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <input
              type="text"
              value={newQuestion.examples}
              onChange={(e) => setNewQuestion((p) => ({ ...p, examples: e.target.value }))}
              placeholder="Relevant Example"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <input
              type="text"
              value={newQuestion.conclusion}
              onChange={(e) => setNewQuestion((p) => ({ ...p, conclusion: e.target.value }))}
              placeholder="Conclusion"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <input
              type="text"
              value={newQuestion.keywordsText}
              onChange={(e) => setNewQuestion((p) => ({ ...p, keywordsText: e.target.value }))}
              placeholder="Keywords (comma separated)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save Question &amp; Answer</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {overview.questions.map((q) => {
              const u = overview.units.find((unit) => unit.id === q.unitId);
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-slate-500">
                      Unit {u?.unitNumber} · Section {q.section} · {q.marks}M ·{' '}
                      {q.published ? 'Published' : 'Draft'}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {q.questionText}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        await authFetch(`/api/admin/questions/${q.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ published: !q.published }),
                        });
                        await notify('Question publish state updated.');
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs cursor-pointer"
                    >
                      {q.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await authFetch(`/api/admin/questions/${q.id}`, { method: 'DELETE' });
                        await notify('Question deleted.');
                      }}
                      aria-label="Delete question"
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MCQ TESTS MANAGEMENT */}
      {tab === 'mcqs' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await authFetch('/api/admin/mcqs', {
                method: 'POST',
                body: JSON.stringify({
                  unitId: newMcq.unitId,
                  questionText: newMcq.questionText,
                  options: [newMcq.opt0, newMcq.opt1, newMcq.opt2, newMcq.opt3],
                  correctIndex: newMcq.correctIndex,
                  explanation: newMcq.explanation,
                  difficulty: newMcq.difficulty,
                }),
              });
              setNewMcq((p) => ({
                ...p,
                questionText: '',
                opt0: '',
                opt1: '',
                opt2: '',
                opt3: '',
                explanation: '',
              }));
              await notify('MCQ added to test bank.');
            }}
            className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
          >
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
              Create New MCQ Question
            </h2>
            <select
              value={newMcq.unitId}
              onChange={(e) => setNewMcq((p) => ({ ...p, unitId: Number(e.target.value) }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            >
              {overview.units.map((u) => (
                <option key={u.id} value={u.id}>
                  Unit {u.unitNumber}: {u.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              value={newMcq.questionText}
              onChange={(e) => setNewMcq((p) => ({ ...p, questionText: e.target.value }))}
              placeholder="MCQ Question"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <div className="grid grid-cols-1 gap-2">
              {(['opt0', 'opt1', 'opt2', 'opt3'] as const).map((field, idx) => (
                <input
                  key={field}
                  type="text"
                  required
                  value={newMcq[field]}
                  onChange={(e) => setNewMcq((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newMcq.correctIndex}
                onChange={(e) => setNewMcq((p) => ({ ...p, correctIndex: Number(e.target.value) }))}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              >
                <option value={0}>Correct: Option A</option>
                <option value={1}>Correct: Option B</option>
                <option value={2}>Correct: Option C</option>
                <option value={3}>Correct: Option D</option>
              </select>
              <select
                value={newMcq.difficulty}
                onChange={(e) => setNewMcq((p) => ({ ...p, difficulty: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <textarea
              rows={2}
              required
              value={newMcq.explanation}
              onChange={(e) => setNewMcq((p) => ({ ...p, explanation: e.target.value }))}
              placeholder="Explanation shown after answering"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add MCQ</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {overview.mcqs.map((m) => {
              const u = overview.units.find((unit) => unit.id === m.unitId);
              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-mono text-slate-500">
                      Unit {u?.unitNumber} · {m.difficulty} · {m.published ? 'Published' : 'Draft'}
                    </div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {m.questionText}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        await authFetch(`/api/admin/mcqs/${m.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ published: !m.published }),
                        });
                        await notify('MCQ visibility updated.');
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs cursor-pointer"
                    >
                      {m.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await authFetch(`/api/admin/mcqs/${m.id}`, { method: 'DELETE' });
                        await notify('MCQ deleted.');
                      }}
                      aria-label="Delete MCQ"
                      className="p-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DIAGRAMS MANAGEMENT */}
      {tab === 'diagrams' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const steps = newDiagram.stepsText
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((line, i) => ({
                  step: i + 1,
                  label: line.split(':')[0] || `Step ${i + 1}`,
                  detail: line.split(':').slice(1).join(':').trim() || line,
                }));
              await authFetch('/api/admin/diagrams', {
                method: 'POST',
                body: JSON.stringify({
                  unitId: newDiagram.unitId,
                  diagramKey:
                    newDiagram.diagramKey ||
                    `custom-diag-${Date.now().toString().slice(-5)}`,
                  title: newDiagram.title,
                  category: newDiagram.category,
                  summary: newDiagram.summary,
                  steps,
                }),
              });
              setNewDiagram((p) => ({
                ...p,
                diagramKey: '',
                title: '',
                summary: '',
              }));
              await notify('Interactive diagram created.');
            }}
            className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3"
          >
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white">
              Add Interactive Technical Diagram
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newDiagram.unitId}
                onChange={(e) => setNewDiagram((p) => ({ ...p, unitId: Number(e.target.value) }))}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              >
                {overview.units.map((u) => (
                  <option key={u.id} value={u.id}>
                    Unit {u.unitNumber}
                  </option>
                ))}
              </select>
              <select
                value={newDiagram.category}
                onChange={(e) => setNewDiagram((p) => ({ ...p, category: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
              >
                <option value="Architecture">Architecture</option>
                <option value="Process">Process</option>
                <option value="Flowchart">Flowchart</option>
                <option value="Comparison">Comparison</option>
              </select>
            </div>
            <input
              type="text"
              required
              value={newDiagram.title}
              onChange={(e) => setNewDiagram((p) => ({ ...p, title: e.target.value }))}
              placeholder="Diagram Title"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <input
              type="text"
              value={newDiagram.diagramKey}
              onChange={(e) => setNewDiagram((p) => ({ ...p, diagramKey: e.target.value }))}
              placeholder="Unique diagram key (e.g., u6-cicd-flow)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={2}
              required
              value={newDiagram.summary}
              onChange={(e) => setNewDiagram((p) => ({ ...p, summary: e.target.value }))}
              placeholder="Diagram Summary"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs"
            />
            <textarea
              rows={4}
              value={newDiagram.stepsText}
              onChange={(e) => setNewDiagram((p) => ({ ...p, stepsText: e.target.value }))}
              placeholder="Label: Detail (one step per line)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs font-mono"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save Diagram</span>
            </button>
          </form>

          <div className="lg:col-span-7 space-y-2.5 max-h-[600px] overflow-y-auto">
            {overview.diagrams.map((d) => {
              const u = overview.units.find((unit) => unit.id === d.unitId);
              return (
                <div
                  key={d.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4"
                >
                  <div className="text-[11px] font-mono text-slate-500">
                    Unit {u?.unitNumber} · {d.category} · {d.diagramKey}
                  </div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                    {d.title}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{d.summary}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STUDENT ACCOUNTS & MESSAGES */}
      {tab === 'users' && overview && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white mb-4">
              Registered Student &amp; Admin Accounts
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <tr>
                    <th className="py-2 pr-3">Name</th>
                    <th className="py-2 pr-3">Email</th>
                    <th className="py-2 pr-3">Role</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {overview.users.map((usr) => (
                    <tr key={usr.id}>
                      <td className="py-2.5 pr-3 font-medium text-slate-900 dark:text-slate-100">
                        {usr.displayName || '—'}
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-slate-600 dark:text-slate-300">
                        {usr.email}
                      </td>
                      <td className="py-2.5 pr-3 capitalize">{usr.role}</td>
                      <td className="py-2.5">
                        <button
                          type="button"
                          onClick={async () => {
                            const nextRole = usr.role === 'admin' ? 'student' : 'admin';
                            await authFetch(`/api/admin/users/${usr.id}/role`, {
                              method: 'PATCH',
                              body: JSON.stringify({ role: nextRole }),
                            });
                            await notify(`Updated ${usr.email} to ${nextRole}.`);
                          }}
                          className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                        >
                          Switch to {usr.role === 'admin' ? 'Student' : 'Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
            <h2 className="font-display text-base font-bold text-slate-950 dark:text-white mb-4">
              Student Contact Messages
            </h2>
            {overview.messages.length === 0 ? (
              <p className="text-xs text-slate-500">No messages submitted yet.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {overview.messages.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950"
                  >
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {m.subject}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {m.name} · {m.email}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">
                      {m.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
