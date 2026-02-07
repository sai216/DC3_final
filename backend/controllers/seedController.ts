import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class SeedController {
  /**
   * POST /api/seed
   * Seed database with initial data
   */
  async seedDatabase(req: Request, res: Response): Promise<void> {
    try {
      const { seedType = 'all', overwrite = false } = req.body;

      const seeded: string[] = [];
      let count = 0;

      // Seed Revenue Categories
      if (seedType === 'all' || seedType === 'categories') {
        if (overwrite) {
          await prisma.revenueCategory.deleteMany({});
        }

        const categories = [
          { name: 'SaaS', code: 'saas', description: 'Software as a Service businesses' },
          { name: 'E-Commerce', code: 'ecommerce', description: 'Online retail and marketplace businesses' },
          { name: 'Consulting', code: 'consulting', description: 'Professional services and consulting firms' },
          { name: 'Agency', code: 'agency', description: 'Marketing, design, and creative agencies' },
          { name: 'Marketplace', code: 'marketplace', description: 'Two-sided marketplace platforms' },
          { name: 'Fintech', code: 'fintech', description: 'Financial technology services' },
          { name: 'Healthcare', code: 'healthcare', description: 'Healthcare and medical services' },
        ];

        for (const cat of categories) {
          await prisma.revenueCategory.upsert({
            where: { code: cat.code },
            create: cat,
            update: cat,
          });
          count++;
        }

        seeded.push('categories');
      }

      // Seed Company Scales
      if (seedType === 'all' || seedType === 'scales') {
        if (overwrite) {
          await prisma.companyScale.deleteMany({});
        }

        const scales = [
          { name: 'Pre-Revenue', code: 'pre_revenue', revenueMin: 0, revenueMax: 0, multiplier: 0.5, description: 'No revenue yet' },
          { name: 'Startup (< $100K)', code: 'startup_100k', revenueMin: 1, revenueMax: 100000, multiplier: 1.0, description: 'Early stage startup' },
          { name: 'Small ($100K - $1M)', code: 'small_1m', revenueMin: 100000, revenueMax: 1000000, multiplier: 1.2, description: 'Small business' },
          { name: 'Medium ($1M - $10M)', code: 'medium_10m', revenueMin: 1000000, revenueMax: 10000000, multiplier: 1.5, description: 'Medium-sized business' },
          { name: 'Large ($10M - $50M)', code: 'large_50m', revenueMin: 10000000, revenueMax: 50000000, multiplier: 2.0, description: 'Large enterprise' },
          { name: 'Enterprise ($50M+)', code: 'enterprise_50m_plus', revenueMin: 50000000, revenueMax: null, multiplier: 3.0, description: 'Enterprise organization' },
        ];

        for (const scale of scales) {
          await prisma.companyScale.upsert({
            where: { code: scale.code },
            create: scale,
            update: scale,
          });
          count++;
        }

        seeded.push('scales');
      }

      // Seed Complexity Tiers
      if (seedType === 'all' || seedType === 'complexity') {
        if (overwrite) {
          await prisma.complexityTier.deleteMany({});
        }

        const complexities = [
          { rating: 1, name: 'Very Simple', description: 'Basic features, minimal customization', adjustmentMultiplier: 0.7 },
          { rating: 2, name: 'Simple', description: 'Standard features, some customization', adjustmentMultiplier: 0.85 },
          { rating: 3, name: 'Low-Medium', description: 'Multiple features, moderate customization', adjustmentMultiplier: 0.95 },
          { rating: 4, name: 'Medium', description: 'Complex features, significant customization', adjustmentMultiplier: 1.0 },
          { rating: 5, name: 'Medium-High', description: 'Advanced features, heavy customization', adjustmentMultiplier: 1.1 },
          { rating: 6, name: 'High', description: 'Sophisticated features, extensive integration', adjustmentMultiplier: 1.2 },
          { rating: 7, name: 'Very High', description: 'Complex architecture, multiple integrations', adjustmentMultiplier: 1.35 },
          { rating: 8, name: 'Extremely High', description: 'Enterprise-grade, mission-critical', adjustmentMultiplier: 1.5 },
          { rating: 9, name: 'Expert Level', description: 'Cutting-edge technology, specialized expertise', adjustmentMultiplier: 1.75 },
          { rating: 10, name: 'Maximum', description: 'Most complex projects, R&D level', adjustmentMultiplier: 2.0 },
        ];

        for (const complexity of complexities) {
          await prisma.complexityTier.upsert({
            where: { rating: complexity.rating },
            create: complexity,
            update: complexity,
          });
          count++;
        }

        seeded.push('complexity');
      }

      // Seed Base Pricing
      if (seedType === 'all' || seedType === 'pricing') {
        if (overwrite) {
          await prisma.basePricing.deleteMany({});
        }

        // Get categories and scales
        const categories = await prisma.revenueCategory.findMany();
        const scales = await prisma.companyScale.findMany();

        // Sample bundles
        const bundles = [
          { id: 'bundle_saas_starter', name: 'SaaS Starter Bundle', basePrice: 5000 },
          { id: 'bundle_saas_pro', name: 'SaaS Pro Bundle', basePrice: 12000 },
          { id: 'bundle_saas_enterprise', name: 'SaaS Enterprise Bundle', basePrice: 25000 },
          { id: 'bundle_web_basic', name: 'Web Basic', basePrice: 3000 },
          { id: 'bundle_web_advanced', name: 'Web Advanced', basePrice: 8000 },
          { id: 'bundle_mobile_app', name: 'Mobile App', basePrice: 15000 },
        ];

        for (const bundle of bundles) {
          for (const category of categories) {
            for (const scale of scales) {
              // Adjust price based on scale
              const adjustedPrice = bundle.basePrice * Number(scale.multiplier);

              await prisma.basePricing.upsert({
                where: {
                  bundleId_revenueCategoryId_companyScaleId: {
                    bundleId: bundle.id,
                    revenueCategoryId: category.id,
                    companyScaleId: scale.id,
                  },
                },
                create: {
                  bundleId: bundle.id,
                  bundleName: bundle.name,
                  revenueCategoryId: category.id,
                  companyScaleId: scale.id,
                  basePrice: adjustedPrice,
                  description: `${bundle.name} for ${category.name} at ${scale.name} scale`,
                },
                update: {
                  basePrice: adjustedPrice,
                  description: `${bundle.name} for ${category.name} at ${scale.name} scale`,
                },
              });
              count++;
            }
          }
        }

        seeded.push('pricing');
      }

      res.json({
        success: true,
        seeded,
        count,
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to seed database',
      });
    }
  }

  /**
   * GET /api/health
   * Health check endpoint
   */
  async healthCheck(_req: Request, res: Response): Promise<void> {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
      });
    }
  }
}

export const seedController = new SeedController();
