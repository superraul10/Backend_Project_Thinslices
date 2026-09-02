import type { Request, Response, NextFunction } from 'express';
import { verifyJWT as verifyToken, accessTokenSecret } from '../../utils/jwt.js';
import { AppError } from '../../types/AppError.js';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: 'Access token is required.' });
  }

  try {
    req.user = verifyToken(token, accessTokenSecret);
    return next();
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
