import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { MESSAGES } from '../config/messages';

interface TokenPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: MESSAGES.MISSING_TOKEN });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: MESSAGES.INVALID_TOKEN });
  }
};
