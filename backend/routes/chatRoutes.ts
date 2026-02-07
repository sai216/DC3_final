import { Router } from 'express';
import { chatController } from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Generate AI response with RAG
 * POST /api/chat/generate
 * Body: { sessionId?, prompt, context? }
 */
router.post('/generate', authRateLimiter, chatController.generateResponse);

/**
 * Create new conversation
 * POST /api/conversations
 * Body: { initialContext? }
 */
router.post('/', authRateLimiter, chatController.createConversation);

/**
 * Get conversation by ID
 * GET /api/conversations/:sessionId
 */
router.get('/:sessionId', chatController.getConversation);

/**
 * Get user's conversations
 * GET /api/conversations
 */
router.get('/', chatController.getUserConversations);

/**
 * Delete conversation
 * DELETE /api/conversations/:sessionId
 */
router.delete('/:sessionId', chatController.deleteConversation);

export default router;
