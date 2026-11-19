import type { ComparisonTable, DiagramStep, ExampleBlock } from '../schema.ts';

export interface SeedTopic {
  orderIndex: number;
  slug: string;
  title: string;
  definition: string;
  explanation: string;
  examples: ExampleBlock[];
  comparisonTable?: ComparisonTable | null;
  keyTakeaways: string[];
  diagramKey?: string;
}

export interface SeedQuestion {
  section: 'A' | 'B' | 'C';
  marks: 2 | 5 | 8 | 10;
  questionText: string;
  practiceBadge: string;
  introduction: string;
  mainExplanation: string;
  examples: string;
  advantages: string[];
  disadvantages: string[];
  diagramKey?: string;
  conclusion: string;
  keywords: string[];
  hinglishIntro?: string;
  hinglishExplanation?: string;
  hinglishExample?: string;
  hinglishConclusion?: string;
}

export interface SeedMcq {
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface SeedDiagram {
  diagramKey: string;
  title: string;
  category: 'Architecture' | 'Flowchart' | 'Comparison' | 'Process';
  summary: string;
  steps: DiagramStep[];
}

export interface SeedUnit {
  unitNumber: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  examWeight: string;
  estimatedHours: number;
  syllabus: string[];
  quickRevision: string[];
  topics: SeedTopic[];
  questions: SeedQuestion[];
  mcqs: SeedMcq[];
  diagrams: SeedDiagram[];
}
