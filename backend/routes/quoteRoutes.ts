import { Router } from 'express';
import { quoteController } from '../controllers/quoteController';
import { authenticateToken, requireAuthStage } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Generate quote for project
 * POST /api/quotes/generate/:projectId
 * Requires: Auth Stage 2 (fully authenticated)
 */
router.post(
  '/generate/:projectId',
  requireAuthStage(2),
  quoteController.generateQuote
);

/**
 * Get quote by ID
 * GET /api/quotes/:quoteId
 */
router.get('/:quoteId', quoteController.getQuoteById);

/**
 * Get all quotes for authenticated user
 * GET /api/quotes
 */
router.get('/', quoteController.getUserQuotes);

/**
 * Accept quote
 * POST /api/quotes/:quoteId/accept
 */
router.post('/:quoteId/accept', quoteController.acceptQuote);

/**
 * Decline quote
 * POST /api/quotes/:quoteId/decline
 * Body: { reason?: string }
 */
router.post('/:quoteId/decline', quoteController.declineQuote);

export default router;
