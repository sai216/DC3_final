import { prisma } from '../config/database.js';
import { privyService } from '../services/privyService.js';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      authStage?: number;
    }
  }
}

// ...existing code...

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
   * Authenticate with Privy and sync user data
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

      // Verify Privy token
      const verifiedClaims = await privyService.verifyToken(accessToken);
      const privyUserId = verifiedClaims.user_id;

      // Get user details from Privy
      const privyUser = await privyService.getUserByDid(privyUserId);

      // Extract email or wallet address from linked_accounts with proper type checking
      const emailAccount = privyUser.linked_accounts?.find(
        (account: any) => account.type === 'email'
      ) as any;
      
      const walletAccount = privyUser.linked_accounts?.find(
        (account: any) => account.type === 'wallet' || account.type === 'smart_wallet'
      ) as any;

      const email = emailAccount?.address;
      const walletAddress = walletAccount?.address;

      if (!email && !walletAddress) {
        res.status(400).json({
          success: false,
          error: 'User must have either email or wallet address',
        });
        return;
      }

      // Check if user exists in our database, create if not
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            email ? { email: email.toLowerCase() } : {},
            walletAddress ? { walletAddress: walletAddress.toLowerCase() } : {},
          ].filter(obj => Object.keys(obj).length > 0),
        },
      });

      if (!user) {
        // Create new user
        user = await prisma.user.create({
          data: {
            email: email?.toLowerCase() || null,
            walletAddress: walletAddress?.toLowerCase() || null,
            privyUserId: privyUserId,
            emailVerified: !!email,
            authStage: 2, // Fully authenticated with Privy
            lastLogin: new Date(),
          },
        });
      } else {
        // Update existing user
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            privyUserId: privyUserId,
            emailVerified: !!email,
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
          action: 'user_login_privy',
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
          walletAddress: user.walletAddress,
          privyUserId: user.privyUserId,
          businessName: user.businessName,
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
   * [DEPRECATED - OTP Auth] Phase 1: Send Email OTP
   * POST /api/auth/email/send-otp
   */
  /*
  async sendEmailOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, businessName } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          error: 'Email is required',
        });
        return;
      }

      const emailLower = email.toLowerCase();

      // Check if user exists, create if not
      let user = await prisma.user.findUnique({
        where: { email: emailLower },
        select: { id: true, authStage: true },
      });

      let userId: string;
      if (!user) {
        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: emailLower,
            businessName: businessName || null,
            authStage: 0,
          },
          select: { id: true },
        });
        userId = newUser.id;
      } else {
        userId = user.id;
      }

      // Generate OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP in database
      await prisma.otpVerification.create({
        data: {
          userId,
          otpType: 'email',
          otpCode,
          destination: emailLower,
          expiresAt,
        },
      });

      // Send OTP via email
      await otpService.sendEmailOTP(emailLower, otpCode, businessName);

      res.json({
        success: true,
        message: 'OTP sent to email',
        userId,
        expiresIn: 600, // seconds
      });
    } catch (error) {
      console.error('sendEmailOTP error:', error);
      next(error);
    }
  },
  */

  /**
   * [DEPRECATED - OTP Auth] Phase 1: Verify Email OTP
   * POST /api/auth/email/verify-otp
   */
  /*
  async verifyEmailOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otpCode } = req.body;

      if (!email || !otpCode) {
        res.status(400).json({
          success: false,
          error: 'Email and OTP code are required',
        });
        return;
      }

      const emailLower = email.toLowerCase();

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: emailLower },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // Find valid OTP
      const otpRecord = await prisma.otpVerification.findFirst({
        where: {
          userId: user.id,
          otpType: 'email',
          destination: emailLower,
          otpCode,
          verified: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!otpRecord) {
        res.status(400).json({
          success: false,
          error: 'Invalid or expired OTP',
        });
        return;
      }

      // Mark OTP as verified
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });

      // Update user: mark email as verified, set authStage to 1
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          authStage: 1,
          lastLogin: new Date(),
        },
      });

      // Generate JWT token
      const token = generateToken(user.id, 1);

      res.json({
        success: true,
        message: 'Email verified successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          businessName: user.businessName,
          authStage: 1,
          emailVerified: true,
        },
      });
    } catch (error) {
      console.error('verifyEmailOTP error:', error);
      next(error);
    }
  },
  */

  /**
   * [DEPRECATED - OTP Auth] Phase 2: Send Phone/WhatsApp OTP
   * POST /api/auth/phone/send-otp
   */
  /*
  async sendPhoneOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phoneNumber, method } = req.body; // method: 'sms' or 'whatsapp'
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized. Please complete email verification first.',
        });
        return;
      }

      if (!phoneNumber) {
        res.status(400).json({
          success: false,
          error: 'Phone number is required',
        });
        return;
      }

      // Validate phone number format (E.164)
      const phoneE164 = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

      // Generate OTP
      const otpCode = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store OTP
      const otpType = method === 'whatsapp' ? 'whatsapp' : 'phone';
      await prisma.otpVerification.create({
        data: {
          userId,
          otpType,
          otpCode,
          destination: phoneE164,
          expiresAt,
        },
      });

      // Send OTP
      if (method === 'whatsapp') {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { businessName: true },
        });
        await otpService.sendWhatsAppOTP(phoneE164, otpCode, user?.businessName || undefined);
      } else {
        await otpService.sendPhoneOTP(phoneE164, otpCode);
      }

      res.json({
        success: true,
        message: `OTP sent via ${method === 'whatsapp' ? 'WhatsApp' : 'SMS'}`,
        expiresIn: 600,
      });
    } catch (error) {
      console.error('sendPhoneOTP error:', error);
      next(error);
    }
  },
  */

  /**
   * [DEPRECATED - OTP Auth] Phase 2: Verify Phone/WhatsApp OTP
   * POST /api/auth/phone/verify-otp
   */
  /*
  async verifyPhoneOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phoneNumber, otpCode, method } = req.body;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      if (!phoneNumber || !otpCode) {
        res.status(400).json({
          success: false,
          error: 'Phone number and OTP code are required',
        });
        return;
      }

      const phoneE164 = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const otpType = method === 'whatsapp' ? 'whatsapp' : 'phone';

      // Find valid OTP
      const otpRecord = await prisma.otpVerification.findFirst({
        where: {
          userId,
          otpType,
          destination: phoneE164,
          otpCode,
          verified: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!otpRecord) {
        res.status(400).json({
          success: false,
          error: 'Invalid or expired OTP',
        });
        return;
      }

      // Mark OTP as verified
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });

      // Update user: mark phone as verified, set authStage to 2
      const updateData: any = {
        phoneE164,
        authStage: 2,
        lastLogin: new Date(),
      };

      if (method === 'whatsapp') {
        updateData.whatsappVerified = true;
      } else {
        updateData.phoneVerified = true;
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          businessName: true,
          phoneE164: true,
          emailVerified: true,
          phoneVerified: true,
          whatsappVerified: true,
          authStage: true,
        },
      });

      // Generate new JWT token with updated authStage
      const token = generateToken(user.id, 2);

      res.json({
        success: true,
        message: 'Phone verified successfully',
        token,
        user,
      });
    } catch (error) {
      console.error('verifyPhoneOTP error:', error);
      next(error);
    }
  },
  */

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
      // In a stateless JWT system, logout is handled client-side by removing the token
      // Here we can log the logout event for audit purposes
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