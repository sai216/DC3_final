import { Router } from 'express';
import { seedController } from '../controllers/seedController.js';

const router = Router();

/**
 * Seed database
 * POST /api/seed
 * Body: { seedType?, overwrite? }
 * No auth required for development purposes
 */
router.post('/', seedController.seedDatabase);

export default router;
