import { adminAuth } from '../lib/firebase-admin.js';
import { getOrCreateUser, getUserByUid } from '../db/users.js';

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    const dbUser = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || '',
      decodedToken.name
    );
    req.dbUser = dbUser;
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const optionalAuth = async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      req.user = decodedToken;
      req.dbUser = await getOrCreateUser(
        decodedToken.uid,
        decodedToken.email || '',
        decodedToken.name
      );
    } catch {
      // Ignore invalid optional token
    }
  }
  next();
};

export const requireAdmin = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const dbUser = req.dbUser || (await getUserByUid(req.user.uid));
  if (!dbUser || dbUser.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Administrator access required' });
  }
  req.dbUser = dbUser;
  next();
};
