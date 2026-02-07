import { Router } from 'express';
import { calendarController } from '../controllers/calendarController';
import { authenticateToken, requireAuthStage } from '../middleware/authMiddleware';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Get available time slots for strategy calls
 * GET /api/calendar/available-slots?startDate=2026-01-23&days=7&duration=60
 * Query params:
 *  - startDate: ISO date string (optional, defaults to tomorrow)
 *  - days: number of days to look ahead (optional, defaults to 7)
 *  - duration: call duration in minutes (optional, defaults to 60)
 */
router.get('/available-slots', calendarController.getAvailableSlots);

/**
 * Book a strategy call
 * POST /api/calendar/book
 * Body: { projectId?: string, scheduledAt: Date }
 * Requires: Auth Stage 2 (fully authenticated)
 */
router.post('/book', requireAuthStage(2), calendarController.bookStrategyCall);

/**
 * Get user's booked strategy calls
 * GET /api/calendar/my-calls
 */
router.get('/my-calls', calendarController.getUserCalls);

/**
 * Get strategy call by ID
 * GET /api/calendar/call/:callId
 */
router.get('/call/:callId', calendarController.getCallById);

/**
 * Cancel a strategy call
 * DELETE /api/calendar/:callId
 */
router.delete('/:callId', calendarController.cancelStrategyCall);

export default router;
