import { and, count, eq, inArray } from 'drizzle-orm';
import { db } from '../index.js';
import {
  diagrams,
  mcqs,
  questions,
  topics,
  units,
  userBookmarks,
} from '../schema.js';
import { unit1 } from './unit1.js';
import { unit2 } from './unit2.js';
import { unit3 } from './unit3.js';
import { unit4 } from './unit4.js';
import { unit5 } from './unit5.js';

const ALL_SEED_UNITS = [unit1, unit2, unit3, unit4, unit5];

let seedPromise = null;

async function syncUnit1Curriculum() {
  const [existingUnit1] = await db
    .select()
    .from(units)
    .where(eq(units.unitNumber, 1))
    .limit(1);

  if (!existingUnit1) return;

  const [existingU1Questions, existingU1Diagrams, existingU1Mcqs] = await Promise.all([
    db.select().from(questions).where(eq(questions.unitId, existingUnit1.id)),
    db.select().from(diagrams).where(eq(diagrams.unitId, existingUnit1.id)),
    db.select().from(mcqs).where(eq(mcqs.unitId, existingUnit1.id)),
  ]);

  const hasTimeline = existingU1Diagrams.some((d) => d.diagramKey === 'u1-history-timeline');
  const hasWwwArch = existingU1Diagrams.some((d) => d.diagramKey === 'u1-www-arch');
  const hasAll20Questions =
    existingU1Questions.length === unit1.questions.length &&
    existingU1Questions.every((q) => q.hinglishExplanation.trim().length > 0);
  const hasExact8Mcqs = existingU1Mcqs.length === unit1.mcqs.length;

  if (hasTimeline && hasWwwArch && hasAll20Questions && hasExact8Mcqs) {
    return;
  }

  await db
    .update(units)
    .set({
      title: unit1.title,
      subtitle: unit1.subtitle,
      description: unit1.description,
      syllabus: unit1.syllabus,
      quickRevision: unit1.quickRevision,
      updatedAt: new Date(),
    })
    .where(eq(units.id, existingUnit1.id));

  for (const d of unit1.diagrams) {
    await db
      .insert(diagrams)
      .values({
        unitId: existingUnit1.id,
        diagramKey: d.diagramKey,
        title: d.title,
        category: d.category,
        summary: d.summary,
        steps: d.steps,
        published: true,
      })
      .onConflictDoUpdate({
        target: diagrams.diagramKey,
        set: {
          title: d.title,
          category: d.category,
          summary: d.summary,
          steps: d.steps,
          published: true,
        },
      });
  }

  const existingU1Topics = await db
    .select()
    .from(topics)
    .where(eq(topics.unitId, existingUnit1.id));

  for (const t of unit1.topics) {
    const match =
      existingU1Topics.find((et) => et.orderIndex === t.orderIndex) ||
      existingU1Topics.find((et) => et.slug === t.slug);
    if (match) {
      await db
        .update(topics)
        .set({
          orderIndex: t.orderIndex,
          slug: t.slug,
          title: t.title,
          definition: t.definition,
          explanation: t.explanation,
          examples: t.examples,
          comparisonTable: t.comparisonTable ?? null,
          keyTakeaways: t.keyTakeaways,
          diagramKey: t.diagramKey ?? null,
          published: true,
        })
        .where(eq(topics.id, match.id));
    } else {
      await db.insert(topics).values({
        unitId: existingUnit1.id,
        orderIndex: t.orderIndex,
        slug: t.slug,
        title: t.title,
        definition: t.definition,
        explanation: t.explanation,
        examples: t.examples,
        comparisonTable: t.comparisonTable ?? null,
        keyTakeaways: t.keyTakeaways,
        diagramKey: t.diagramKey ?? null,
        published: true,
      });
    }
  }

  const canonicalTexts = new Set(unit1.questions.map((q) => q.questionText));
  const bookmarkedQRows = await db
    .select({ itemId: userBookmarks.itemId })
    .from(userBookmarks)
    .where(eq(userBookmarks.itemType, 'question'));
  const bookmarkedQIds = new Set(bookmarkedQRows.map((b) => b.itemId));

  const obsoleteIds = existingU1Questions
    .filter((q) => !canonicalTexts.has(q.questionText) && !bookmarkedQIds.has(q.id))
    .map((q) => q.id);

  if (obsoleteIds.length > 0) {
    await db
      .delete(questions)
      .where(and(eq(questions.unitId, existingUnit1.id), inArray(questions.id, obsoleteIds)));
  }

  for (const q of unit1.questions) {
    const match = existingU1Questions.find((eqItem) => eqItem.questionText === q.questionText);
    const payload = {
      unitId: existingUnit1.id,
      section: q.section,
      marks: q.marks,
      questionText: q.questionText,
      practiceBadge: q.practiceBadge,
      introduction: q.introduction,
      mainExplanation: q.mainExplanation,
      examples: q.examples,
      advantages: q.advantages,
      disadvantages: q.disadvantages,
      diagramKey: q.diagramKey ?? null,
      conclusion: q.conclusion,
      keywords: q.keywords,
      hinglishIntro: q.hinglishIntro ?? '',
      hinglishExplanation: q.hinglishExplanation ?? '',
      hinglishExample: q.hinglishExample ?? '',
      hinglishConclusion: q.hinglishConclusion ?? '',
      published: true,
    };
    if (match) {
      await db.update(questions).set(payload).where(eq(questions.id, match.id));
    } else {
      await db.insert(questions).values(payload);
    }
  }

  await db.delete(mcqs).where(eq(mcqs.unitId, existingUnit1.id));
  await db.insert(mcqs).values(
    unit1.mcqs.map((m) => ({
      unitId: existingUnit1.id,
      questionText: m.questionText,
      options: m.options,
      correctIndex: m.correctIndex,
      explanation: m.explanation,
      difficulty: m.difficulty,
      published: true,
    }))
  );
}

export async function ensureSeeded() {
  if (seedPromise) {
    return seedPromise;
  }

  seedPromise = (async () => {
    try {
      const [{ value: existingUnitsCount }] = await db
        .select({ value: count() })
        .from(units);

      if (Number(existingUnitsCount) > 0) {
        await syncUnit1Curriculum();
        return;
      }

      for (const seedUnit of ALL_SEED_UNITS) {
        const [insertedUnit] = await db
          .insert(units)
          .values({
            unitNumber: seedUnit.unitNumber,
            slug: seedUnit.slug,
            title: seedUnit.title,
            subtitle: seedUnit.subtitle,
            description: seedUnit.description,
            examWeight: seedUnit.examWeight,
            estimatedHours: seedUnit.estimatedHours,
            syllabus: seedUnit.syllabus,
            quickRevision: seedUnit.quickRevision,
            published: true,
          })
          .onConflictDoNothing()
          .returning();

        if (!insertedUnit) continue;

        if (seedUnit.diagrams.length > 0) {
          await db
            .insert(diagrams)
            .values(
              seedUnit.diagrams.map((d) => ({
                unitId: insertedUnit.id,
                diagramKey: d.diagramKey,
                title: d.title,
                category: d.category,
                summary: d.summary,
                steps: d.steps,
                published: true,
              }))
            )
            .onConflictDoNothing();
        }

        if (seedUnit.topics.length > 0) {
          await db.insert(topics).values(
            seedUnit.topics.map((t) => ({
              unitId: insertedUnit.id,
              orderIndex: t.orderIndex,
              slug: t.slug,
              title: t.title,
              definition: t.definition,
              explanation: t.explanation,
              examples: t.examples,
              comparisonTable: t.comparisonTable ?? null,
              keyTakeaways: t.keyTakeaways,
              diagramKey: t.diagramKey ?? null,
              published: true,
            }))
          );
        }

        if (seedUnit.questions.length > 0) {
          await db.insert(questions).values(
            seedUnit.questions.map((q) => ({
              unitId: insertedUnit.id,
              section: q.section,
              marks: q.marks,
              questionText: q.questionText,
              practiceBadge: q.practiceBadge,
              introduction: q.introduction,
              mainExplanation: q.mainExplanation,
              examples: q.examples,
              advantages: q.advantages,
              disadvantages: q.disadvantages,
              diagramKey: q.diagramKey ?? null,
              conclusion: q.conclusion,
              keywords: q.keywords,
              hinglishIntro: q.hinglishIntro ?? '',
              hinglishExplanation: q.hinglishExplanation ?? '',
              hinglishExample: q.hinglishExample ?? '',
              hinglishConclusion: q.hinglishConclusion ?? '',
              published: true,
            }))
          );
        }

        if (seedUnit.mcqs.length > 0) {
          await db.insert(mcqs).values(
            seedUnit.mcqs.map((m) => ({
              unitId: insertedUnit.id,
              questionText: m.questionText,
              options: m.options,
              correctIndex: m.correctIndex,
              explanation: m.explanation,
              difficulty: m.difficulty,
              published: true,
            }))
          );
        }
      }
    } catch (error) {
      seedPromise = null;
      console.error('Failed to seed curriculum database:', error);
      throw new Error('Failed to initialize curriculum catalog.', { cause: error });
    }
  })();

  return seedPromise;
}
