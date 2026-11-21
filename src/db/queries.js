import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from './index.js';
import {
  contactMessages,
  diagrams,
  mcqs,
  questions,
  quizAttempts,
  topics,
  units,
  userBookmarks,
  userProgress,
  userQuestionStatus,
  users,
} from './schema.js';
import { ensureSeeded } from './seed/index.js';

export async function getPublishedCatalog() {
  try {
    await ensureSeeded();
    const allUnits = await db
      .select()
      .from(units)
      .where(eq(units.published, true))
      .orderBy(asc(units.unitNumber));

    const allTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.published, true))
      .orderBy(asc(topics.unitId), asc(topics.orderIndex));

    const allQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.published, true))
      .orderBy(
        asc(questions.unitId),
        asc(questions.section),
        asc(questions.marks),
        asc(questions.id)
      );

    const allMcqs = await db
      .select()
      .from(mcqs)
      .where(eq(mcqs.published, true))
      .orderBy(asc(mcqs.unitId), asc(mcqs.id));

    const allDiagrams = await db
      .select()
      .from(diagrams)
      .where(eq(diagrams.published, true))
      .orderBy(asc(diagrams.unitId), asc(diagrams.id));

    return {
      units: allUnits,
      topics: allTopics,
      questions: allQuestions,
      mcqs: allMcqs,
      diagrams: allDiagrams,
    };
  } catch (error) {
    console.error('Database query failed in getPublishedCatalog:', error);
    throw new Error('Failed to load curriculum catalog.', { cause: error });
  }
}

export async function getStudentState(userUid) {
  try {
    const progressRows = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userUid, userUid))
      .orderBy(desc(userProgress.lastViewedAt));

    const bookmarkRows = await db
      .select()
      .from(userBookmarks)
      .where(eq(userBookmarks.userUid, userUid))
      .orderBy(desc(userBookmarks.createdAt));

    const attempts = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.userUid, userUid))
      .orderBy(desc(quizAttempts.createdAt))
      .limit(20);

    const questionStatuses = await db
      .select()
      .from(userQuestionStatus)
      .where(eq(userQuestionStatus.userUid, userUid));

    return { progress: progressRows, bookmarks: bookmarkRows, attempts, questionStatuses };
  } catch (error) {
    console.error('Database query failed in getStudentState:', error);
    throw new Error('Failed to fetch student learning progress.', { cause: error });
  }
}

export async function upsertTopicProgress(userUid, topicId, completed) {
  try {
    const existing = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userUid, userUid), eq(userProgress.topicId, topicId)))
      .limit(1);

    if (existing.length > 0) {
      const nextCompleted =
        typeof completed === 'boolean' ? completed : existing[0].completed;
      const [updated] = await db
        .update(userProgress)
        .set({
          completed: nextCompleted,
          lastViewedAt: new Date(),
        })
        .where(eq(userProgress.id, existing[0].id))
        .returning();
      return updated;
    }

    const [inserted] = await db
      .insert(userProgress)
      .values({
        userUid,
        topicId,
        completed: Boolean(completed),
        lastViewedAt: new Date(),
      })
      .returning();
    return inserted;
  } catch (error) {
    console.error('Database query failed in upsertTopicProgress:', error);
    throw new Error('Failed to save topic progress.', { cause: error });
  }
}

export async function toggleBookmark(userUid, itemType, itemId) {
  try {
    const existing = await db
      .select()
      .from(userBookmarks)
      .where(
        and(
          eq(userBookmarks.userUid, userUid),
          eq(userBookmarks.itemType, itemType),
          eq(userBookmarks.itemId, itemId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db.delete(userBookmarks).where(eq(userBookmarks.id, existing[0].id));
      return { bookmarked: false };
    }

    await db.insert(userBookmarks).values({
      userUid,
      itemType,
      itemId,
    });
    return { bookmarked: true };
  } catch (error) {
    console.error('Database query failed in toggleBookmark:', error);
    throw new Error('Failed to update bookmark.', { cause: error });
  }
}

export async function upsertQuestionStatus(userUid, questionId, patch) {
  try {
    const existing = await db
      .select()
      .from(userQuestionStatus)
      .where(
        and(
          eq(userQuestionStatus.userUid, userUid),
          eq(userQuestionStatus.questionId, questionId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await db
        .update(userQuestionStatus)
        .set({
          important:
            typeof patch.important === 'boolean' ? patch.important : existing[0].important,
          completed:
            typeof patch.completed === 'boolean' ? patch.completed : existing[0].completed,
          updatedAt: new Date(),
        })
        .where(eq(userQuestionStatus.id, existing[0].id))
        .returning();
      return updated;
    }

    const [inserted] = await db
      .insert(userQuestionStatus)
      .values({
        userUid,
        questionId,
        important: Boolean(patch.important),
        completed: Boolean(patch.completed),
        updatedAt: new Date(),
      })
      .returning();
    return inserted;
  } catch (error) {
    console.error('Database query failed in upsertQuestionStatus:', error);
    throw new Error('Failed to update question status.', { cause: error });
  }
}

export async function recordQuizAttempt(data) {
  try {
    const [inserted] = await db.insert(quizAttempts).values(data).returning();
    return inserted;
  } catch (error) {
    console.error('Database query failed in recordQuizAttempt:', error);
    throw new Error('Failed to save practice test result.', { cause: error });
  }
}

export async function createContactMessage(data) {
  try {
    const [inserted] = await db.insert(contactMessages).values(data).returning();
    return inserted;
  } catch (error) {
    console.error('Database query failed in createContactMessage:', error);
    throw new Error('Failed to save contact message.', { cause: error });
  }
}

export async function getAdminOverview() {
  try {
    await ensureSeeded();
    const [allUnits, allTopics, allQuestions, allMcqs, allDiagrams, allUsers, messages] =
      await Promise.all([
        db.select().from(units).orderBy(asc(units.unitNumber)),
        db.select().from(topics).orderBy(asc(topics.unitId), asc(topics.orderIndex)),
        db.select().from(questions).orderBy(asc(questions.unitId), asc(questions.id)),
        db.select().from(mcqs).orderBy(asc(mcqs.unitId), asc(mcqs.id)),
        db.select().from(diagrams).orderBy(asc(diagrams.unitId), asc(diagrams.id)),
        db.select().from(users).orderBy(desc(users.createdAt)),
        db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(25),
      ]);

    return {
      units: allUnits,
      topics: allTopics,
      questions: allQuestions,
      mcqs: allMcqs,
      diagrams: allDiagrams,
      users: allUsers,
      messages,
    };
  } catch (error) {
    console.error('Database query failed in getAdminOverview:', error);
    throw new Error('Failed to load administrator overview.', { cause: error });
  }
}
