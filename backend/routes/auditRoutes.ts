import { Router } from 'express';
import multer from 'multer';
import { auditController } from '../controllers/auditController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Configure multer for file uploads (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB per file
    files: 10, // Maximum 10 files per request
  },
  fileFilter: (_req, file, cb) => {
    // Allowed file types: PDF, DOC, DOCX, TXT
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
});

// All routes require authentication
router.use(authenticateToken);

/**
 * Upload supporting documents (Manifest Step)
 * POST /api/audit/upload
 * Content-Type: multipart/form-data
 * Max 25MB per file, max 10 files
 * Allowed types: PDF, DOC, DOCX, TXT
 */
router.post('/upload', authRateLimiter, upload.array('files', 10), auditController.uploadFiles);

/**
 * Submit Loom + Docs URLs (Manifest Step)
 * POST /api/audit/manifest
 * Body: { loomUrl?: string, docsUrl?: string, fileIds?: string[] }
 */
router.post('/manifest', authRateLimiter, auditController.submitManifest);

/**
 * Store identity verification (Auth Identity Step)
 * POST /api/audit/identity
 * Body: { linkedinUrl?: string, businessEmail?: string, whatsappNumber?: string }
 */
router.post('/identity', authRateLimiter, auditController.submitIdentity);

// ==========================================
// [DEPRECATED - OTP/WhatsApp/Twilio Routes]
// These routes are not currently in use
// ==========================================

/**
 * [DEPRECATED] Send WhatsApp OTP (OTP Step)
 * POST /api/audit/otp/send
 * Body: { phoneNumber: string }
 * Note: Currently not in use. OTP verification handled via Privy authentication.
 */
// router.post('/otp/send', authRateLimiter, auditController.sendOTP);

/**
 * [DEPRECATED] Verify WhatsApp OTP (OTP Step)
 * POST /api/audit/otp/verify
 * Body: { phoneNumber: string, code: string }
 * Note: Currently not in use. OTP verification handled via Privy authentication.
 */
// router.post('/otp/verify', authRateLimiter, auditController.verifyOTP);

/**
 * Schedule Google Meet (Google Meet Step)
 * POST /api/audit/schedule
 * Body: { date: string, time: string, timezone: string, duration?: number }
 */
router.post('/schedule', authRateLimiter, auditController.scheduleCall);

/**
 * Finalize audit submission (Success Step)
 * POST /api/audit/submit
 * Body: { manifestId: string, identityId: string, meetingId: string, goals?: object }
 */
router.post('/submit', authRateLimiter, auditController.submitAudit);

/**
 * Get user's audit submissions
 * GET /api/audit/my-submissions
 */
router.get('/my-submissions', auditController.getMySubmissions);

/**
 * Get specific audit submission by ID
 * GET /api/audit/submission/:id
 */
router.get('/submission/:id', auditController.getSubmissionById);

// Error handling middleware for multer
router.use((err: any, _req: any, res: any, _next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 25MB limit',
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Maximum 10 files allowed per upload',
      });
    }
  }
  
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    error: 'File upload error',
  });
});

export default router;
