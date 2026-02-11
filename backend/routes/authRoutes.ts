import { authController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { Router } from 'express';

const router = Router();

// ==========================================
// Privy Authentication
// ==========================================

/**
 * Authenticate with Privy
 * POST /api/auth/privy/authenticate
 * Body: { accessToken: string }
 */
router.post('/privy/authenticate', authRateLimiter, authController.authenticateWithPrivy);

// ==========================================
// [DEPRECATED - OTP Authentication Routes]
// ==========================================

/**
 * [DEPRECATED] Send OTP to email
 * POST /api/auth/email/send-otp
 * Body: { email: string, businessName?: string }
 */
// router.post('/email/send-otp', otpRateLimiter, validateEmail, authController.sendEmailOTP);

/**
 * [DEPRECATED] Verify email OTP
 * POST /api/auth/email/verify-otp
 * Body: { email: string, otpCode: string }
 */
// router.post('/email/verify-otp', authRateLimiter, validateEmail, authController.verifyEmailOTP);

/**
 * [DEPRECATED] Send OTP to phone/WhatsApp (requires authentication from Phase 1)
 * POST /api/auth/phone/send-otp
 * Headers: Authorization: Bearer <token>
 * Body: { phoneNumber: string, method: 'sms' | 'whatsapp' }
 */
// router.post('/phone/send-otp', otpRateLimiter, authenticateToken, validatePhone, authController.sendPhoneOTP);

/**
 * [DEPRECATED] Verify phone/WhatsApp OTP (requires authentication from Phase 1)
 * POST /api/auth/phone/verify-otp
 * Headers: Authorization: Bearer <token>
 * Body: { phoneNumber: string, otpCode: string, method: 'sms' | 'whatsapp' }
 */
// router.post('/phone/verify-otp', authRateLimiter, authenticateToken, validatePhone, authController.verifyPhoneOTP);

// ==========================================
// Session Management
// ==========================================

/**
 * Get current user session
 * GET /api/auth/session
 * Headers: Authorization: Bearer <token>
 */
router.get('/session', authenticateToken, authController.getSession);

/**
 * Logout
 * POST /api/auth/logout
 * Headers: Authorization: Bearer <token>
 */
router.post('/logout', authenticateToken, authController.logout);

export default router;