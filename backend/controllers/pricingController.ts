import { Request, Response } from 'express';
import { pricingService } from '../services/pricingService.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

class PricingController {
  /**
   * POST /api/pricing/calculate
   * Calculate pricing based on RC + Scale + Complexity
   */
  async calculatePricing(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        bundleId,
        revenueCategory,
        companyRevenueScale,
        complexityRating,
      } = req.body;

      if (!bundleId || !revenueCategory || !companyRevenueScale) {
        res.status(400).json({
          success: false,
          error: 'bundleId, revenueCategory, and companyRevenueScale are required',
        });
        return;
      }

      const complexityRatingValue = complexityRating || 5; // Default to medium complexity

      const pricing = await pricingService.calculatePricing(
        bundleId,
        revenueCategory,
        companyRevenueScale,
        complexityRatingValue
      );

      res.json({
        success: true,
        pricing,
      });
    } catch (error: any) {
      console.error('Error calculating pricing:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to calculate pricing',
      });
    }
  }

  /**
   * GET /api/pricing/categories
   * Get all revenue categories
   */
  async getRevenueCategories(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const categories = await pricingService.getRevenueCategories();

      res.json({
        success: true,
        categories,
      });
    } catch (error) {
      console.error('Error fetching revenue categories:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch revenue categories',
      });
    }
  }

  /**
   * GET /api/pricing/scales
   * Get all company scales
   */
  async getCompanyScales(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const scales = await pricingService.getCompanyScales();

      res.json({
        success: true,
        scales,
      });
    } catch (error) {
      console.error('Error fetching company scales:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch company scales',
      });
    }
  }

  /**
   * GET /api/pricing/complexity
   * Get all complexity tiers
   */
  async getComplexityTiers(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const tiers = await pricingService.getComplexityTiers();

      res.json({
        success: true,
        tiers,
      });
    } catch (error) {
      console.error('Error fetching complexity tiers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch complexity tiers',
      });
    }
  }

  /**
   * GET /api/pricing/base
   * Get all base pricing
   */
  async getAllBasePricing(_req: AuthRequest, res: Response): Promise<void> {
    try {
      const pricing = await pricingService.getAllBasePricing();

      res.json({
        success: true,
        pricing,
      });
    } catch (error) {
      console.error('Error fetching base pricing:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch base pricing',
      });
    }
  }
}

export const pricingController = new PricingController();
