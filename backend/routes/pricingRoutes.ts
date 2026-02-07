import { Router } from 'express';
import { pricingController } from '../controllers/pricingController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * Calculate pricing
 * POST /api/pricing/calculate
 * Body: { bundleId, revenueCategory, companyRevenueScale, complexityRating? }
 */
router.post('/calculate', authRateLimiter, pricingController.calculatePricing);

/**
 * Get revenue categories
 * GET /api/pricing/categories
 */
router.get('/categories', pricingController.getRevenueCategories);

/**
 * Get company scales
 * GET /api/pricing/scales
 */
router.get('/scales', pricingController.getCompanyScales);

/**
 * Get complexity tiers
 * GET /api/pricing/complexity
 */
router.get('/complexity', pricingController.getComplexityTiers);

/**
 * Get all base pricing
 * GET /api/pricing/base
 */
router.get('/base', pricingController.getAllBasePricing);

export default router;
