import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  displayName: text('display_name'),
  role: text('role').notNull().default('student'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  unitNumber: integer('unit_number').notNull().unique(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull(),
  description: text('description').notNull(),
  examWeight: text('exam_weight').notNull().default('20% Weightage'),
  estimatedHours: integer('estimated_hours').notNull().default(6),
  syllabus: jsonb('syllabus').notNull(),
  quickRevision: jsonb('quick_revision').notNull(),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id')
    .references(() => units.id, { onDelete: 'cascade' })
    .notNull(),
  orderIndex: integer('order_index').notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  definition: text('definition').notNull(),
  explanation: text('explanation').notNull(),
  examples: jsonb('examples').notNull(),
  comparisonTable: jsonb('comparison_table'),
  keyTakeaways: jsonb('key_takeaways').notNull(),
  diagramKey: text('diagram_key'),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const questions = pgTable('questions', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id')
    .references(() => units.id, { onDelete: 'cascade' })
    .notNull(),
  section: text('section').notNull(),
  marks: integer('marks').notNull(),
  questionText: text('question_text').notNull(),
  practiceBadge: text('practice_badge').notNull().default('Exam Preparation Recommendation'),
  introduction: text('introduction').notNull(),
  mainExplanation: text('main_explanation').notNull(),
  examples: text('examples').notNull(),
  advantages: jsonb('advantages').notNull(),
  disadvantages: jsonb('disadvantages').notNull(),
  diagramKey: text('diagram_key'),
  conclusion: text('conclusion').notNull(),
  keywords: jsonb('keywords').notNull(),
  hinglishIntro: text('hinglish_intro').notNull().default(''),
  hinglishExplanation: text('hinglish_explanation').notNull().default(''),
  hinglishExample: text('hinglish_example').notNull().default(''),
  hinglishConclusion: text('hinglish_conclusion').notNull().default(''),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const mcqs = pgTable('mcqs', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id')
    .references(() => units.id, { onDelete: 'cascade' })
    .notNull(),
  questionText: text('question_text').notNull(),
  options: jsonb('options').notNull(),
  correctIndex: integer('correct_index').notNull(),
  explanation: text('explanation').notNull(),
  difficulty: text('difficulty').notNull().default('Medium'),
  published: boolean('published').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const diagrams = pgTable('diagrams', {
  id: serial('id').primaryKey(),
  unitId: integer('unit_id')
    .references(() => units.id, { onDelete: 'cascade' })
    .notNull(),
  diagramKey: text('diagram_key').notNull().unique(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  summary: text('summary').notNull(),
  steps: jsonb('steps').notNull(),
  published: boolean('published').notNull().default(true),
});

export const userProgress = pgTable(
  'user_progress',
  {
    id: serial('id').primaryKey(),
    userUid: text('user_uid')
      .references(() => users.uid, { onDelete: 'cascade' })
      .notNull(),
    topicId: integer('topic_id')
      .references(() => topics.id, { onDelete: 'cascade' })
      .notNull(),
    completed: boolean('completed').notNull().default(false),
    lastViewedAt: timestamp('last_viewed_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('user_progress_uid_topic_idx').on(table.userUid, table.topicId)]
);

export const userBookmarks = pgTable(
  'user_bookmarks',
  {
    id: serial('id').primaryKey(),
    userUid: text('user_uid')
      .references(() => users.uid, { onDelete: 'cascade' })
      .notNull(),
    itemType: text('item_type').notNull(),
    itemId: integer('item_id').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('user_bookmarks_uid_item_idx').on(table.userUid, table.itemType, table.itemId),
  ]
);

export const userQuestionStatus = pgTable(
  'user_question_status',
  {
    id: serial('id').primaryKey(),
    userUid: text('user_uid')
      .references(() => users.uid, { onDelete: 'cascade' })
      .notNull(),
    questionId: integer('question_id')
      .references(() => questions.id, { onDelete: 'cascade' })
      .notNull(),
    important: boolean('important').notNull().default(false),
    completed: boolean('completed').notNull().default(false),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('user_q_status_uid_q_idx').on(table.userUid, table.questionId),
  ]
);

export const quizAttempts = pgTable('quiz_attempts', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid')
    .references(() => users.uid, { onDelete: 'cascade' })
    .notNull(),
  unitId: integer('unit_id'),
  mode: text('mode').notNull().default('practice'),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  percentage: integer('percentage').notNull(),
  durationSeconds: integer('duration_seconds').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const unitsRelations = relations(units, ({ many }) => ({
  topics: many(topics),
  questions: many(questions),
  mcqs: many(mcqs),
  diagrams: many(diagrams),
}));

export const topicsRelations = relations(topics, ({ one }) => ({
  unit: one(units, { fields: [topics.unitId], references: [units.id] }),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  unit: one(units, { fields: [questions.unitId], references: [units.id] }),
}));

export const mcqsRelations = relations(mcqs, ({ one }) => ({
  unit: one(units, { fields: [mcqs.unitId], references: [units.id] }),
}));

export const diagramsRelations = relations(diagrams, ({ one }) => ({
  unit: one(units, { fields: [diagrams.unitId], references: [units.id] }),
}));
