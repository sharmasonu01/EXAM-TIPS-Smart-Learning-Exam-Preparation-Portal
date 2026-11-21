import { eq } from 'drizzle-orm';
import { db } from './index.js';
import { users } from './schema.js';

const DEFAULT_ADMIN_EMAIL = 'sharmasonu97311@gmail.com';

export async function getOrCreateUser(uid, email, displayName) {
  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.uid, uid))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(users)
        .set({
          email,
          displayName: displayName || existing[0].displayName,
        })
        .where(eq(users.uid, uid))
        .returning();
      return updated[0];
    }

    const initialRole =
      email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()
        ? 'admin'
        : 'student';

    const inserted = await db
      .insert(users)
      .values({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        role: initialRole,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || email.split('@')[0],
        },
      })
      .returning();

    return inserted[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Failed to synchronize user account.', { cause: error });
  }
}

export async function getUserByUid(uid) {
  try {
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.uid, uid))
      .limit(1);
    return rows[0] || null;
  } catch (error) {
    console.error('Database query failed in getUserByUid:', error);
    throw new Error('Failed to load user profile.', { cause: error });
  }
}
