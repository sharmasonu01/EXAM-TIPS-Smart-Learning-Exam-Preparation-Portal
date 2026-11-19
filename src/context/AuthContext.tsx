import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import type { DbUser, StudentState } from '../types/lms';

interface AuthContextValue {
  firebaseUser: User | null;
  dbUser: DbUser | null;
  idToken: string | null;
  authLoading: boolean;
  authError: string | null;
  studentState: StudentState;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  markTopicViewed: (topicId: number) => Promise<void>;
  toggleTopicCompleted: (topicId: number, completed: boolean) => Promise<void>;
  toggleBookmark: (itemType: 'question' | 'topic', itemId: number) => Promise<void>;
  toggleQuestionStatus: (
    questionId: number,
    field: 'important' | 'completed'
  ) => Promise<void>;
  saveQuizAttempt: (payload: {
    unitId: number | null;
    mode: 'practice' | 'timed-mock';
    score: number;
    totalQuestions: number;
    percentage: number;
    durationSeconds: number;
  }) => Promise<void>;
  refreshStudentState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const EMPTY_STATE: StudentState = {
  progress: [],
  bookmarks: [],
  attempts: [],
  questionStatuses: [],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [studentState, setStudentState] = useState<StudentState>(EMPTY_STATE);

  // Keep Firebase ID token strictly in memory (never localStorage)
  const tokenRef = useRef<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  const syncWithBackend = useCallback(async (user: User) => {
    try {
      const token = await user.getIdToken();
      tokenRef.current = token;
      setIdToken(token);

      const meRes = await fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (meRes.ok) {
        const meJson = await meRes.json();
        setDbUser(meJson.user);
      }

      const stateRes = await fetch('/api/student/state', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (stateRes.ok) {
        const stateJson = await stateRes.json();
        setStudentState(stateJson);
      }
    } catch (err) {
      console.error('Failed to sync authenticated user state:', err);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await syncWithBackend(user);
      } else {
        tokenRef.current = null;
        setIdToken(null);
        setDbUser(null);
        setStudentState(EMPTY_STATE);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [syncWithBackend]);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      await syncWithBackend(result.user);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Google sign-in could not be completed.';
      setAuthError(message);
    }
  };

  const logout = async () => {
    await signOut(auth);
    tokenRef.current = null;
    setIdToken(null);
    setDbUser(null);
    setStudentState(EMPTY_STATE);
  };

  const getFreshToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    const token = await auth.currentUser.getIdToken();
    tokenRef.current = token;
    setIdToken(token);
    return token;
  };

  const refreshStudentState = async () => {
    const token = await getFreshToken();
    if (!token) return;
    const res = await fetch('/api/student/state', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setStudentState(await res.json());
    }
  };

  const markTopicViewed = async (topicId: number) => {
    const nowIso = new Date().toISOString();
    setStudentState((prev) => {
      const existing = prev.progress.find((p) => p.topicId === topicId);
      if (existing) {
        return {
          ...prev,
          progress: [
            { ...existing, lastViewedAt: nowIso },
            ...prev.progress.filter((p) => p.topicId !== topicId),
          ],
        };
      }
      return {
        ...prev,
        progress: [
          {
            id: Date.now(),
            userUid: firebaseUser?.uid || 'guest',
            topicId,
            completed: false,
            lastViewedAt: nowIso,
          },
          ...prev.progress,
        ],
      };
    });

    const token = await getFreshToken();
    if (!token) return;
    await fetch('/api/student/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topicId }),
    });
  };

  const toggleTopicCompleted = async (topicId: number, completed: boolean) => {
    const nowIso = new Date().toISOString();
    setStudentState((prev) => {
      const existing = prev.progress.find((p) => p.topicId === topicId);
      const updatedRow = existing
        ? { ...existing, completed, lastViewedAt: nowIso }
        : {
            id: Date.now(),
            userUid: firebaseUser?.uid || 'guest',
            topicId,
            completed,
            lastViewedAt: nowIso,
          };
      return {
        ...prev,
        progress: [updatedRow, ...prev.progress.filter((p) => p.topicId !== topicId)],
      };
    });

    const token = await getFreshToken();
    if (!token) return;
    await fetch('/api/student/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ topicId, completed }),
    });
  };

  const toggleBookmark = async (itemType: 'question' | 'topic', itemId: number) => {
    setStudentState((prev) => {
      const exists = prev.bookmarks.some(
        (b) => b.itemType === itemType && b.itemId === itemId
      );
      if (exists) {
        return {
          ...prev,
          bookmarks: prev.bookmarks.filter(
            (b) => !(b.itemType === itemType && b.itemId === itemId)
          ),
        };
      }
      return {
        ...prev,
        bookmarks: [
          {
            id: Date.now(),
            userUid: firebaseUser?.uid || 'guest',
            itemType,
            itemId,
            createdAt: new Date().toISOString(),
          },
          ...prev.bookmarks,
        ],
      };
    });

    const token = await getFreshToken();
    if (!token) return;
    await fetch('/api/student/bookmarks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemType, itemId }),
    });
  };

  const toggleQuestionStatus = async (
    questionId: number,
    field: 'important' | 'completed'
  ) => {
    let nextValue = true;
    const nowIso = new Date().toISOString();

    setStudentState((prev) => {
      const list = prev.questionStatuses ?? [];
      const existing = list.find((s) => s.questionId === questionId);
      nextValue = existing ? !existing[field] : true;
      const updatedRow = existing
        ? { ...existing, [field]: nextValue, updatedAt: nowIso }
        : {
            id: Date.now(),
            userUid: firebaseUser?.uid || 'guest',
            questionId,
            important: field === 'important' ? nextValue : false,
            completed: field === 'completed' ? nextValue : false,
            updatedAt: nowIso,
          };
      return {
        ...prev,
        questionStatuses: [
          updatedRow,
          ...list.filter((s) => s.questionId !== questionId),
        ],
      };
    });

    const token = await getFreshToken();
    if (!token) return;
    await fetch('/api/student/question-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questionId, [field]: nextValue }),
    });
  };

  const saveQuizAttempt = async (payload: {
    unitId: number | null;
    mode: 'practice' | 'timed-mock';
    score: number;
    totalQuestions: number;
    percentage: number;
    durationSeconds: number;
  }) => {
    setStudentState((prev) => ({
      ...prev,
      attempts: [
        {
          id: Date.now(),
          userUid: firebaseUser?.uid || 'guest',
          ...payload,
          createdAt: new Date().toISOString(),
        },
        ...prev.attempts,
      ],
    }));

    const token = await getFreshToken();
    if (!token) return;
    await fetch('/api/student/quiz-attempts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        idToken,
        authLoading,
        authError,
        studentState,
        signInWithGoogle,
        logout,
        markTopicViewed,
        toggleTopicCompleted,
        toggleBookmark,
        toggleQuestionStatus,
        saveQuizAttempt,
        refreshStudentState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
