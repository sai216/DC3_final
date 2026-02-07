import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PricingCalculation {
  basePricing: number;
  scaleMultiplier: number;
  complexityAdjustment: number;
  finalPrice: number;
  breakdown: {
    base: number;
    scaleAdjustment: number;
    complexityAdjustment: number;
  };
}

class PricingService {
  /**
   * Calculate pricing based on RC + Scale + Complexity
   */
  async calculatePricing(
    bundleId: string,
    revenueCategory: string,
    companyRevenueScale: string,
    complexityRating: number
  ): Promise<PricingCalculation> {
    try {
      // Find revenue category
      const revCategory = await prisma.revenueCategory.findFirst({
        where: {
          OR: [
            { code: revenueCategory },
            { name: { equals: revenueCategory, mode: 'insensitive' } },
          ],
        },
      });

      if (!revCategory) {
        throw new Error(`Revenue category '${revenueCategory}' not found`);
      }

      // Find company scale
      const scale = await prisma.companyScale.findFirst({
        where: {
          OR: [
            { code: companyRevenueScale },
            { name: { equals: companyRevenueScale, mode: 'insensitive' } },
          ],
        },
      });

      if (!scale) {
        throw new Error(`Company scale '${companyRevenueScale}' not found`);
      }

      // Find base pricing
      const basePricing = await prisma.basePricing.findFirst({
        where: {
          bundleId,
          revenueCategoryId: revCategory.id,
          companyScaleId: scale.id,
        },
      });

      if (!basePricing) {
        throw new Error(
          `No pricing found for bundle '${bundleId}', category '${revenueCategory}', and scale '${companyRevenueScale}'`
        );
      }

      // Find complexity tier
      const complexityTier = await prisma.complexityTier.findFirst({
        where: { rating: complexityRating },
      });

      const complexityMultiplier = complexityTier
        ? Number(complexityTier.adjustmentMultiplier)
        : 1.0;

      // Calculate pricing
      const base = Number(basePricing.basePrice);
      const scaleMultiplier = Number(scale.multiplier);
      const scaleAdjustment = base * (scaleMultiplier - 1);
      const complexityAdjustmentValue = (base + scaleAdjustment) * (complexityMultiplier - 1);
      const finalPrice = base + scaleAdjustment + complexityAdjustmentValue;

      return {
        basePricing: base,
        scaleMultiplier,
        complexityAdjustment: complexityMultiplier,
        finalPrice: Math.round(finalPrice * 100) / 100,
        breakdown: {
          base,
          scaleAdjustment: Math.round(scaleAdjustment * 100) / 100,
          complexityAdjustment: Math.round(complexityAdjustmentValue * 100) / 100,
        },
      };
    } catch (error) {
      console.error('Error calculating pricing:', error);
      throw error;
    }
  }

  /**
   * Get all revenue categories
   */
  async getRevenueCategories() {
    return await prisma.revenueCategory.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get all company scales
   */
  async getCompanyScales() {
    return await prisma.companyScale.findMany({
      orderBy: { revenueMin: 'asc' },
    });
  }

  /**
   * Get all complexity tiers
   */
  async getComplexityTiers() {
    return await prisma.complexityTier.findMany({
      orderBy: { rating: 'asc' },
    });
  }

  /**
   * Get all base pricing
   */
  async getAllBasePricing() {
    return await prisma.basePricing.findMany({
      include: {
        revenueCategory: true,
        companyScale: true,
      },
      orderBy: { bundleId: 'asc' },
    });
  }
}

export const pricingService = new PricingService();
