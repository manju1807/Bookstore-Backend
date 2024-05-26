import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const prisma = new PrismaClient();
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  if (!token && req.cookies.token) {
    token = req.cookies.token;
  }
  if (token) {
    try {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length).trimLeft();
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, role: string };
      const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
      if (user) {
        req.user = user;
        return next();
      } else {
        return res.status(401).json({ error: "User not found" });
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ error: "Token verification failed" });
    }
  } else {
    return next();
  }
};
