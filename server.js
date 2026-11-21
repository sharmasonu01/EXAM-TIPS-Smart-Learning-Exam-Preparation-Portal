import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { eq } from 'drizzle-orm';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.js';
import {
  diagrams,
  mcqs,
  questions,
  topics,
  units,
  users,
} from './src/db/schema.js';
import {
  createContactMessage,
  getAdminOverview,
  getPublishedCatalog,
  getStudentState,
  recordQuizAttempt,
  toggleBookmark,
  upsertQuestionStatus,
  upsertTopicProgress,
} from './src/db/queries.js';
import { requireAdmin, requireAuth } from './src/middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  // Public Curriculum Catalog (Units, Topics, Q&A, MCQs, Diagrams)
  app.get('/api/catalog', async (_req, res) => {
    try {
      const catalog = await getPublishedCatalog();
      res.json(catalog);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to load catalog';
      res.status(500).json({ error: msg });
    }
  });

  // Public Contact Form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const { name, email, subject, message } = req.body ?? {};
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      const saved = await createContactMessage({
        name: String(name).trim(),
        email: String(email).trim(),
        subject: String(subject).trim(),
        message: String(message).trim(),
      });
      res.status(201).json(saved);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Submission failed';
      res.status(500).json({ error: msg });
    }
  });

  // Authenticated User Profile & Sync
  app.get('/api/me', requireAuth, async (req, res) => {
    res.json({ user: req.dbUser });
  });

  // Student Learning State (Progress, Bookmarks, Question Statuses, Quiz Attempts)
  app.get('/api/student/state', requireAuth, async (req, res) => {
    try {
      const state = await getStudentState(req.user.uid);
      res.json(state);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to load state';
      res.status(500).json({ error: msg });
    }
  });

  app.post('/api/student/progress', requireAuth, async (req, res) => {
    try {
      const { topicId, completed } = req.body ?? {};
      if (!Number.isInteger(Number(topicId))) {
        return res.status(400).json({ error: 'Valid topicId is required.' });
      }
      const saved = await upsertTopicProgress(
        req.user.uid,
        Number(topicId),
        typeof completed === 'boolean' ? completed : undefined
      );
      res.json(saved);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to save progress';
      res.status(500).json({ error: msg });
    }
  });

  app.post('/api/student/bookmarks', requireAuth, async (req, res) => {
    try {
      const { itemType, itemId } = req.body ?? {};
      if (itemType !== 'question' && itemType !== 'topic') {
        return res.status(400).json({ error: 'Invalid bookmark itemType.' });
      }
      if (!Number.isInteger(Number(itemId))) {
        return res.status(400).json({ error: 'Valid itemId is required.' });
      }
      const result = await toggleBookmark(req.user.uid, itemType, Number(itemId));
      res.json(result);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to toggle bookmark';
      res.status(500).json({ error: msg });
    }
  });

  app.post('/api/student/question-status', requireAuth, async (req, res) => {
    try {
      const { questionId, important, completed } = req.body ?? {};
      if (!Number.isInteger(Number(questionId))) {
        return res.status(400).json({ error: 'Valid questionId is required.' });
      }
      const saved = await upsertQuestionStatus(req.user.uid, Number(questionId), {
        important: typeof important === 'boolean' ? important : undefined,
        completed: typeof completed === 'boolean' ? completed : undefined,
      });
      res.json(saved);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update question status';
      res.status(500).json({ error: msg });
    }
  });

  app.post('/api/student/quiz-attempts', requireAuth, async (req, res) => {
    try {
      const { unitId, mode, score, totalQuestions, percentage, durationSeconds } =
        req.body ?? {};
      if (
        !Number.isFinite(Number(score)) ||
        !Number.isFinite(Number(totalQuestions)) ||
        Number(totalQuestions) <= 0
      ) {
        return res.status(400).json({ error: 'Invalid quiz score payload.' });
      }
      const saved = await recordQuizAttempt({
        userUid: req.user.uid,
        unitId: unitId ? Number(unitId) : null,
        mode: mode === 'timed-mock' ? 'timed-mock' : 'practice',
        score: Number(score),
        totalQuestions: Number(totalQuestions),
        percentage: Number(percentage) || 0,
        durationSeconds: Number(durationSeconds) || 0,
      });
      res.status(201).json(saved);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to record quiz attempt';
      res.status(500).json({ error: msg });
    }
  });

  // ============================================================
  // ADMIN PANEL ROUTES (RBAC Protected: requireAuth + requireAdmin)
  // ============================================================
  app.get('/api/admin/overview', requireAuth, requireAdmin, async (_req, res) => {
    try {
      const overview = await getAdminOverview();
      res.json(overview);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to load admin overview';
      res.status(500).json({ error: msg });
    }
  });

  app.post('/api/admin/units', requireAuth, requireAdmin, async (req, res) => {
    try {
      const {
        unitNumber,
        slug,
        title,
        subtitle,
        description,
        examWeight,
        estimatedHours,
        syllabus,
        quickRevision,
        published,
      } = req.body ?? {};

      if (!unitNumber || !slug || !title || !subtitle || !description) {
        return res.status(400).json({ error: 'Missing required unit fields.' });
      }

      const [created] = await db
        .insert(units)
        .values({
          unitNumber: Number(unitNumber),
          slug: String(slug).trim(),
          title: String(title).trim(),
          subtitle: String(subtitle).trim(),
          description: String(description).trim(),
          examWeight: examWeight ? String(examWeight) : '20% Weightage',
          estimatedHours: Number(estimatedHours) || 6,
          syllabus: Array.isArray(syllabus) ? syllabus : [],
          quickRevision: Array.isArray(quickRevision) ? quickRevision : [],
          published: published !== false,
        })
        .returning();

      res.status(201).json(created);
    } catch (error) {
      console.error('Admin create unit failed:', error);
      res.status(500).json({ error: 'Failed to create unit.' });
    }
  });

  app.patch('/api/admin/units/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const body = req.body ?? {};
      const [updated] = await db
        .update(units)
        .set({
          ...(body.title !== undefined && { title: String(body.title) }),
          ...(body.subtitle !== undefined && { subtitle: String(body.subtitle) }),
          ...(body.description !== undefined && { description: String(body.description) }),
          ...(body.examWeight !== undefined && { examWeight: String(body.examWeight) }),
          ...(body.estimatedHours !== undefined && {
            estimatedHours: Number(body.estimatedHours),
          }),
          ...(Array.isArray(body.syllabus) && { syllabus: body.syllabus }),
          ...(Array.isArray(body.quickRevision) && { quickRevision: body.quickRevision }),
          ...(typeof body.published === 'boolean' && { published: body.published }),
          updatedAt: new Date(),
        })
        .where(eq(units.id, id))
        .returning();

      if (!updated) return res.status(404).json({ error: 'Unit not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Admin update unit failed:', error);
      res.status(500).json({ error: 'Failed to update unit.' });
    }
  });

  app.post('/api/admin/topics', requireAuth, requireAdmin, async (req, res) => {
    try {
      const {
        unitId,
        orderIndex,
        slug,
        title,
        definition,
        explanation,
        examples,
        keyTakeaways,
        diagramKey,
        published,
      } = req.body ?? {};
      if (!unitId || !title || !definition || !explanation) {
        return res.status(400).json({ error: 'Missing required topic fields.' });
      }
      const [created] = await db
        .insert(topics)
        .values({
          unitId: Number(unitId),
          orderIndex: Number(orderIndex) || 1,
          slug:
            String(slug || title)
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '') +
            '-' +
            Date.now().toString().slice(-4),
          title: String(title).trim(),
          definition: String(definition).trim(),
          explanation: String(explanation).trim(),
          examples: Array.isArray(examples) ? examples : [],
          keyTakeaways: Array.isArray(keyTakeaways) ? keyTakeaways : [],
          diagramKey: diagramKey || null,
          published: published !== false,
        })
        .returning();
      res.status(201).json(created);
    } catch (error) {
      console.error('Admin create topic failed:', error);
      res.status(500).json({ error: 'Failed to create topic.' });
    }
  });

  app.patch('/api/admin/topics/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const body = req.body ?? {};
      const [updated] = await db
        .update(topics)
        .set({
          ...(body.title !== undefined && { title: String(body.title) }),
          ...(body.definition !== undefined && { definition: String(body.definition) }),
          ...(body.explanation !== undefined && { explanation: String(body.explanation) }),
          ...(Array.isArray(body.keyTakeaways) && { keyTakeaways: body.keyTakeaways }),
          ...(typeof body.published === 'boolean' && { published: body.published }),
        })
        .where(eq(topics.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: 'Topic not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Admin update topic failed:', error);
      res.status(500).json({ error: 'Failed to update topic.' });
    }
  });

  app.delete('/api/admin/topics/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(topics).where(eq(topics.id, Number(req.params.id)));
      res.json({ deleted: true });
    } catch (error) {
      console.error('Admin delete topic failed:', error);
      res.status(500).json({ error: 'Failed to delete topic.' });
    }
  });

  app.post('/api/admin/questions', requireAuth, requireAdmin, async (req, res) => {
    try {
      const {
        unitId,
        section,
        marks,
        questionText,
        introduction,
        mainExplanation,
        examples,
        advantages,
        disadvantages,
        diagramKey,
        conclusion,
        keywords,
        hinglishIntro,
        hinglishExplanation,
        hinglishExample,
        hinglishConclusion,
        published,
      } = req.body ?? {};

      if (!unitId || !section || !marks || !questionText || !mainExplanation) {
        return res.status(400).json({ error: 'Missing required question fields.' });
      }

      const [created] = await db
        .insert(questions)
        .values({
          unitId: Number(unitId),
          section: String(section),
          marks: Number(marks),
          questionText: String(questionText).trim(),
          practiceBadge: 'Exam Preparation Recommendation',
          introduction: String(introduction || '').trim() || 'Core topic overview.',
          mainExplanation: String(mainExplanation).trim(),
          examples: String(examples || '').trim() || 'Applied real-world system example.',
          advantages: Array.isArray(advantages) ? advantages : [],
          disadvantages: Array.isArray(disadvantages) ? disadvantages : [],
          diagramKey: diagramKey || null,
          conclusion: String(conclusion || '').trim() || 'Summary of key exam points.',
          keywords: Array.isArray(keywords) ? keywords : [],
          hinglishIntro: String(hinglishIntro || '').trim(),
          hinglishExplanation: String(hinglishExplanation || '').trim(),
          hinglishExample: String(hinglishExample || '').trim(),
          hinglishConclusion: String(hinglishConclusion || '').trim(),
          published: published !== false,
        })
        .returning();

      res.status(201).json(created);
    } catch (error) {
      console.error('Admin create question failed:', error);
      res.status(500).json({ error: 'Failed to create question.' });
    }
  });

  app.patch('/api/admin/questions/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const body = req.body ?? {};
      const [updated] = await db
        .update(questions)
        .set({
          ...(body.questionText !== undefined && { questionText: String(body.questionText) }),
          ...(body.introduction !== undefined && { introduction: String(body.introduction) }),
          ...(body.mainExplanation !== undefined && {
            mainExplanation: String(body.mainExplanation),
          }),
          ...(body.examples !== undefined && { examples: String(body.examples) }),
          ...(body.conclusion !== undefined && { conclusion: String(body.conclusion) }),
          ...(typeof body.published === 'boolean' && { published: body.published }),
        })
        .where(eq(questions.id, id))
        .returning();

      if (!updated) return res.status(404).json({ error: 'Question not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Admin update question failed:', error);
      res.status(500).json({ error: 'Failed to update question.' });
    }
  });

  app.delete('/api/admin/questions/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(questions).where(eq(questions.id, Number(req.params.id)));
      res.json({ deleted: true });
    } catch (error) {
      console.error('Admin delete question failed:', error);
      res.status(500).json({ error: 'Failed to delete question.' });
    }
  });

  app.post('/api/admin/mcqs', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { unitId, questionText, options, correctIndex, explanation, difficulty, published } =
        req.body ?? {};
      if (!unitId || !questionText || !Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({ error: 'Question and exactly 4 options are required.' });
      }
      const [created] = await db
        .insert(mcqs)
        .values({
          unitId: Number(unitId),
          questionText: String(questionText).trim(),
          options: options.map(String),
          correctIndex: Number(correctIndex) || 0,
          explanation: String(explanation || '').trim(),
          difficulty: String(difficulty || 'Medium'),
          published: published !== false,
        })
        .returning();
      res.status(201).json(created);
    } catch (error) {
      console.error('Admin create MCQ failed:', error);
      res.status(500).json({ error: 'Failed to create MCQ.' });
    }
  });

  app.patch('/api/admin/mcqs/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const body = req.body ?? {};
      const [updated] = await db
        .update(mcqs)
        .set({
          ...(typeof body.published === 'boolean' && { published: body.published }),
          ...(body.questionText !== undefined && { questionText: String(body.questionText) }),
        })
        .where(eq(mcqs.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: 'MCQ not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Admin update MCQ failed:', error);
      res.status(500).json({ error: 'Failed to update MCQ.' });
    }
  });

  app.delete('/api/admin/mcqs/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(mcqs).where(eq(mcqs.id, Number(req.params.id)));
      res.json({ deleted: true });
    } catch (error) {
      console.error('Admin delete MCQ failed:', error);
      res.status(500).json({ error: 'Failed to delete MCQ.' });
    }
  });

  app.post('/api/admin/diagrams', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { unitId, diagramKey, title, category, summary, steps } = req.body ?? {};
      if (!unitId || !diagramKey || !title || !summary) {
        return res.status(400).json({ error: 'Missing required diagram fields.' });
      }
      const [created] = await db
        .insert(diagrams)
        .values({
          unitId: Number(unitId),
          diagramKey: String(diagramKey).trim(),
          title: String(title).trim(),
          category: String(category || 'Architecture'),
          summary: String(summary).trim(),
          steps: Array.isArray(steps) ? steps : [],
          published: true,
        })
        .returning();
      res.status(201).json(created);
    } catch (error) {
      console.error('Admin create diagram failed:', error);
      res.status(500).json({ error: 'Failed to create diagram.' });
    }
  });

  app.delete('/api/admin/diagrams/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
      await db.delete(diagrams).where(eq(diagrams.id, Number(req.params.id)));
      res.json({ deleted: true });
    } catch (error) {
      console.error('Admin delete diagram failed:', error);
      res.status(500).json({ error: 'Failed to delete diagram.' });
    }
  });

  app.patch('/api/admin/users/:id/role', requireAuth, requireAdmin, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { role } = req.body ?? {};
      if (role !== 'student' && role !== 'admin') {
        return res.status(400).json({ error: 'Role must be student or admin.' });
      }
      const [updated] = await db
        .update(users)
        .set({ role })
        .where(eq(users.id, id))
        .returning();
      if (!updated) return res.status(404).json({ error: 'User not found.' });
      res.json(updated);
    } catch (error) {
      console.error('Admin update role failed:', error);
      res.status(500).json({ error: 'Failed to update user role.' });
    }
  });

  // Vite Dev Middleware or Production Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EXAM TIPS server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
