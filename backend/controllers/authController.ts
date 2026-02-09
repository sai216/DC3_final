import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      authStage?: number;
    }
  }
}

// Generate JWT token
const generateToken = (userId: string, authStage: number): string => {
  const secret = process.env.JWT_SECRET || 'default-secret-change-in-production';
  return jwt.sign(
    { userId, authStage },
    secret,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
  );
}

export const authController = {
  /**
   * Authenticate with Privy (TEMPORARY: Verification disabled)
   * POST /api/auth/privy/authenticate
   * Body: { accessToken: string }
   */
  async authenticateWithPrivy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { accessToken } = req.body;

      if (!accessToken) {
        res.status(400).json({
          success: false,
          error: 'Access token is required',
        });
        return;
      }

      // TEMPORARY: Skip Privy verification
      // Create a session based on timestamp to simulate unique users
      const timestamp = Date.now();
      const mockEmail = `user_${timestamp}@decentdesign.com`;

      // Check if user exists, create if not
      let user = await prisma.user.findFirst({
        where: { email: mockEmail }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: mockEmail,
            emailVerified: true,
            authStage: 2,
            lastLogin: new Date(),
          },
        });
      } else {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            lastLogin: new Date(),
            authStage: 2,
          },
        });
      }

      // Generate JWT token
      const token = generateToken(user.id, 2);

      // Log authentication event
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'user_login_temp',
          entityType: 'user',
          entityId: user.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });

      res.json({
        success: true,
        message: 'Authenticated successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          authStage: user.authStage,
          emailVerified: user.emailVerified,
        },
      });
    } catch (error) {
      console.error('authenticateWithPrivy error:', error);
      next(error);
    }
  },

  /**
   * Get current session
   * GET /api/auth/session
   */
  async getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          businessName: true,
          phoneE164: true,
          emailVerified: true,
          phoneVerified: true,
          whatsappVerified: true,
          authStage: true,
          createdAt: true,
          lastLogin: true,
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        user,
      });
    } catch (error) {
      console.error('getSession error:', error);
      next(error);
    }
  },

  /**
   * Logout
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      if (userId) {
        await prisma.auditLog.create({
          data: {
            userId,
            action: 'user_logout',
            entityType: 'user',
            entityId: userId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          },
        });
      }

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      console.error('logout error:', error);
      next(error);
    }
  },
};