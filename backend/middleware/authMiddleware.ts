import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { privyService } from '../services/privyService.js';

interface JwtPayload {
  userId: string;
  authStage: number;
  iat?: number;
  exp?: number;
}

/**
 * Middleware to authenticate JWT token or Privy token
 * Supports both our JWT tokens and Privy access tokens
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
      });
      return;
    }

    // Try to verify as JWT token first
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default-secret-change-in-production'
      ) as JwtPayload;

      // Attach userId and authStage to request
      req.userId = decoded.userId;
      req.authStage = decoded.authStage;
      next();
      return;
    } catch (jwtError) {
      // If JWT verification fails, try Privy token verification
      try {
        const verifiedClaims = await privyService.verifyToken(token);
        const privyUserId = (verifiedClaims as any).userId || (verifiedClaims as any).user_id;

        if (!privyUserId) {
          res.status(401).json({
            success: false,
            error: 'Invalid Privy token: missing user id',
          });
          return;
        }

        // Find user by Privy ID
        const user = await prisma.user.findFirst({
          where: { privyUserId },
          select: { id: true, authStage: true },
        });

        if (!user) {
          res.status(401).json({
            success: false,
            error: 'User not found. Please authenticate first.',
          });
          return;
        }

        // Attach userId and authStage to request
        req.userId = user.id;
        req.authStage = user.authStage;
        next();
        return;
      } catch (privyError) {
        // Both verifications failed
        res.status(403).json({
          success: false,
          error: 'Invalid or expired token',
        });
        return;
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token verification failed',
    });
  }
};

/**
 * Middleware to check if user has completed specific auth stage
 */
export const requireAuthStage = (minStage: number) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { authStage: true },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      if (user.authStage < minStage) {
        res.status(403).json({
          success: false,
          error: `Authentication stage ${minStage} required. Current stage: ${user.authStage}`,
        });
        return;
      }

      next();
    } catch (error) {
      console.error('requireAuthStage error:', error);
      res.status(500).json({
        success: false,
        error: 'Authorization check failed',
      });
    }
  };
};

/**
 * Middleware to check if user's email is verified
 */
export const requireEmailVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { emailVerified: true },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({
        success: false,
        error: 'Email verification required',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('requireEmailVerified error:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization check failed',
    });
  }
};

/**
 * Middleware to check if user's phone is verified
 */
export const requirePhoneVerified = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phoneVerified: true, whatsappVerified: true },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    if (!user.phoneVerified && !user.whatsappVerified) {
      res.status(403).json({
        success: false,
        error: 'Phone verification required',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('requirePhoneVerified error:', error);
    res.status(500).json({
      success: false,
      error: 'Authorization check failed',
    });
  }
};
