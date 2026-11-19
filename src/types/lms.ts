export interface ExampleBlock {
  title: string;
  description: string;
  code?: string;
  language?: string;
}

export interface ComparisonTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface DiagramStep {
  step: number;
  label: string;
  detail: string;
}

export interface UnitItem {
  id: number;
  unitNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  examWeight: string;
  estimatedHours: number;
  syllabus: string[];
  quickRevision: string[];
  published: boolean;
}

export interface TopicItem {
  id: number;
  unitId: number;
  orderIndex: number;
  slug: string;
  title: string;
  definition: string;
  explanation: string;
  examples: ExampleBlock[];
  comparisonTable?: ComparisonTable | null;
  keyTakeaways: string[];
  diagramKey?: string | null;
  published: boolean;
}

export interface QuestionItem {
  id: number;
  unitId: number;
  section: 'A' | 'B' | 'C' | string;
  marks: number;
  questionText: string;
  practiceBadge: string;
  introduction: string;
  mainExplanation: string;
  examples: string;
  advantages: string[];
  disadvantages: string[];
  diagramKey?: string | null;
  conclusion: string;
  keywords: string[];
  hinglishIntro?: string;
  hinglishExplanation?: string;
  hinglishExample?: string;
  hinglishConclusion?: string;
  published: boolean;
}

export interface McqItem {
  id: number;
  unitId: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: string;
  published: boolean;
}

export interface DiagramItem {
  id: number;
  unitId: number;
  diagramKey: string;
  title: string;
  category: string;
  summary: string;
  steps: DiagramStep[];
  published: boolean;
}

export interface CatalogData {
  units: UnitItem[];
  topics: TopicItem[];
  questions: QuestionItem[];
  mcqs: McqItem[];
  diagrams: DiagramItem[];
}

export interface UserProgressRow {
  id: number;
  userUid: string;
  topicId: number;
  completed: boolean;
  lastViewedAt: string;
}

export interface UserBookmarkRow {
  id: number;
  userUid: string;
  itemType: 'question' | 'topic';
  itemId: number;
  createdAt: string;
}

export interface QuizAttemptRow {
  id: number;
  userUid: string;
  unitId: number | null;
  mode: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  durationSeconds: number;
  createdAt: string;
}

export interface DbUser {
  id: number;
  uid: string;
  email: string;
  displayName: string | null;
  role: 'student' | 'admin' | string;
  createdAt?: string;
}

export interface UserQuestionStatusRow {
  id: number;
  userUid: string;
  questionId: number;
  important: boolean;
  completed: boolean;
  updatedAt: string;
}

export interface StudentState {
  progress: UserProgressRow[];
  bookmarks: UserBookmarkRow[];
  attempts: QuizAttemptRow[];
  questionStatuses?: UserQuestionStatusRow[];
}

export type AppView =
  | 'home'
  | 'dashboard'
  | 'unit'
  | 'questions'
  | 'practice'
  | 'diagrams'
  | 'admin';
