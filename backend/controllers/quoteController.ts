import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { ProjectType, Urgency } from '@prisma/client';

// Base rates by project type (from .env)
const BASE_RATES: Record<ProjectType, number> = {
  creative: parseFloat(process.env.BASE_RATE_CREATIVE || '5000'),
  fullstack: parseFloat(process.env.BASE_RATE_FULLSTACK || '8000'),
  web3: parseFloat(process.env.BASE_RATE_WEB3 || '12000'),
  ai_automation: parseFloat(process.env.BASE_RATE_AI_AUTOMATION || '10000'),
};

// Complexity multipliers
const COMPLEXITY_MULTIPLIERS = {
  low: 1.0,
  medium: 1.3,
  high: 1.5,
  critical: 1.8,
};

// Urgency multipliers
const URGENCY_MULTIPLIERS: Record<Urgency, number> = {
  standard: 1.0,
  urgent: 1.3,
  critical: 1.5,
};

/**
 * Calculate complexity score based on project scope
 * Returns 0.00 to 10.00 scale
 */
const calculateComplexity = (
  projectType: ProjectType,
  scope: any,
  urgency: Urgency
): number => {
  let score = 0;

  // Feature count scoring
  const features = scope?.features || [];
  score += Math.min(features.length * 0.5, 3.0); // Max 3 points

  // Integration complexity
  const integrations = scope?.integrations || [];
  const complexIntegrations = integrations.filter((i: any) =>
    ['payment', 'blockchain', 'ai', 'custom_api'].includes(i.type)
  );
  score += Math.min(complexIntegrations.length * 0.8, 3.0); // Max 3 points

  // Timeline pressure
  const timeline = scope?.timeline || 'standard';
  if (timeline === 'urgent') score += 1.5;
  if (timeline === 'critical') score += 2.5;

  // Project type base complexity
  const typeComplexity: Record<ProjectType, number> = {
    creative: 1.0,
    fullstack: 2.0,
    web3: 3.0,
    ai_automation: 2.5,
  };
  score += typeComplexity[projectType] || 1.0;

  // Urgency factor
  if (urgency === 'urgent') score += 0.5;
  if (urgency === 'critical') score += 1.0;

  // Cap at 10.00
  return Math.min(score, 10.0);
};

export const quoteController = {
  /**
   * Generate automated quote with "Not to Exceed" guarantee
   * POST /api/quotes/generate/:projectId
   */
  async generateQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      // Fetch project details
      const project = await prisma.projectAssessment.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        res.status(404).json({
          success: false,
          error: 'Project not found',
        });
        return;
      }

      // Verify ownership
      if (project.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
        });
        return;
      }

      // Check if quote already exists
      const existingQuote = await prisma.projectQuote.findFirst({
        where: {
          projectId,
          status: { in: ['pending', 'sent', 'accepted'] },
        },
      });

      if (existingQuote) {
        res.status(400).json({
          success: false,
          error: 'Active quote already exists for this project',
        });
        return;
      }

      const scope = project.projectScope as any;

      // Calculate complexity if not already set
      let complexityScore = project.complexityScore
        ? parseFloat(project.complexityScore.toString())
        : calculateComplexity(project.projectType, scope, project.urgency || 'standard');

      // Update project with complexity score if not set
      if (!project.complexityScore) {
        await prisma.projectAssessment.update({
          where: { id: projectId },
          data: { complexityScore },
        });
      }

      // Base rate for project type
      const baseRate = BASE_RATES[project.projectType] || 5000;

      // Complexity adjustment
      const complexityLevel =
        complexityScore < 3 ? 'low' :
        complexityScore < 6 ? 'medium' :
        complexityScore < 8 ? 'high' : 'critical';

      const complexityMultiplier = COMPLEXITY_MULTIPLIERS[complexityLevel];
      const complexityAdjustment = baseRate * (complexityMultiplier - 1);

      // Urgency adjustment
      const urgencyMultiplier = URGENCY_MULTIPLIERS[project.urgency || 'standard'];
      const urgencyAdjustment = baseRate * (urgencyMultiplier - 1);

      // Total estimate
      const totalEstimate = baseRate + complexityAdjustment + urgencyAdjustment;

      // "Not to Exceed" guarantee (15% buffer)
      const notToExceed = Math.ceil(totalEstimate * 1.15);

      // Estimated timeline (weeks)
      const baseTimeline: Record<ProjectType, number> = {
        creative: 4,
        fullstack: 8,
        web3: 12,
        ai_automation: 10,
      };

      const estimatedTimeline = Math.ceil(
        (baseTimeline[project.projectType] || 6) * complexityMultiplier
      );

      // Delivery date
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + estimatedTimeline * 7);

      // Payment structure (milestone-based)
      const paymentStructure = {
        deposit: Math.round(totalEstimate * 0.3),
        milestone_1: Math.round(totalEstimate * 0.3),
        milestone_2: Math.round(totalEstimate * 0.2),
        final: Math.round(totalEstimate * 0.2),
      };

      // Quote validity (30 days)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      // Create quote record
      const quote = await prisma.projectQuote.create({
        data: {
          projectId,
          userId,
          baseRate,
          complexityAdjustment,
          urgencyAdjustment,
          totalEstimate,
          notToExceed,
          estimatedTimelineWeeks: estimatedTimeline,
          deliveryDate,
          paymentStructure,
          validUntil,
          status: 'pending',
        },
      });

      // Update project status
      await prisma.projectAssessment.update({
        where: { id: projectId },
        data: { status: 'quote_generated' },
      });

      // Log action
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'quote_generated',
          entityType: 'quote',
          entityId: quote.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          requestData: { projectId },
          responseStatus: 200,
        },
      });

      res.json({
        success: true,
        message: 'Quote generated successfully',
        quote: {
          ...quote,
          baseRate: parseFloat(quote.baseRate.toString()),
          complexityAdjustment: parseFloat(quote.complexityAdjustment.toString()),
          urgencyAdjustment: parseFloat(quote.urgencyAdjustment.toString()),
          totalEstimate: parseFloat(quote.totalEstimate.toString()),
          notToExceed: parseFloat(quote.notToExceed.toString()),
        },
      });
    } catch (error) {
      console.error('Quote generation error:', error);
      next(error);
    }
  },

  /**
   * Get quote by ID
   * GET /api/quotes/:quoteId
   */
  async getQuoteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quoteId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const quote = await prisma.projectQuote.findUnique({
        where: { id: quoteId },
        include: {
          project: {
            select: {
              projectName: true,
              projectType: true,
              projectDescription: true,
              urgency: true,
            },
          },
        },
      });

      if (!quote) {
        res.status(404).json({
          success: false,
          error: 'Quote not found',
        });
        return;
      }

      // Verify ownership
      if (quote.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
        });
        return;
      }

      res.json({
        success: true,
        quote: {
          ...quote,
          baseRate: parseFloat(quote.baseRate.toString()),
          complexityAdjustment: parseFloat(quote.complexityAdjustment.toString()),
          urgencyAdjustment: parseFloat(quote.urgencyAdjustment.toString()),
          totalEstimate: parseFloat(quote.totalEstimate.toString()),
          notToExceed: parseFloat(quote.notToExceed.toString()),
        },
      });
    } catch (error) {
      console.error('Get quote error:', error);
      next(error);
    }
  },

  /**
   * Get all quotes for user
   * GET /api/quotes
   */
  async getUserQuotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const quotes = await prisma.projectQuote.findMany({
        where: { userId },
        include: {
          project: {
            select: {
              projectName: true,
              projectType: true,
              urgency: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        quotes: quotes.map((quote) => ({
          ...quote,
          baseRate: parseFloat(quote.baseRate.toString()),
          complexityAdjustment: parseFloat(quote.complexityAdjustment.toString()),
          urgencyAdjustment: parseFloat(quote.urgencyAdjustment.toString()),
          totalEstimate: parseFloat(quote.totalEstimate.toString()),
          notToExceed: parseFloat(quote.notToExceed.toString()),
        })),
      });
    } catch (error) {
      console.error('Get user quotes error:', error);
      next(error);
    }
  },

  /**
   * Accept quote
   * POST /api/quotes/:quoteId/accept
   */
  async acceptQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quoteId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const quote = await prisma.projectQuote.findUnique({
        where: { id: quoteId },
      });

      if (!quote) {
        res.status(404).json({
          success: false,
          error: 'Quote not found',
        });
        return;
      }

      // Verify ownership
      if (quote.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
        });
        return;
      }

      // Check if quote is still valid
      if (new Date() > quote.validUntil) {
        res.status(400).json({
          success: false,
          error: 'Quote has expired',
        });
        return;
      }

      // Check if quote is in pending or sent status
      if (quote.status !== 'pending' && quote.status !== 'sent') {
        res.status(400).json({
          success: false,
          error: `Quote cannot be accepted (status: ${quote.status})`,
        });
        return;
      }

      // Update quote status
      const updatedQuote = await prisma.projectQuote.update({
        where: { id: quoteId },
        data: {
          status: 'accepted',
          termsAccepted: true,
          acceptedAt: new Date(),
        },
      });

      // Update project status
      await prisma.projectAssessment.update({
        where: { id: quote.projectId },
        data: { status: 'quote_accepted' },
      });

      // Log action
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'quote_accepted',
          entityType: 'quote',
          entityId: quoteId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });

      res.json({
        success: true,
        message: 'Quote accepted successfully',
        quote: {
          ...updatedQuote,
          baseRate: parseFloat(updatedQuote.baseRate.toString()),
          complexityAdjustment: parseFloat(updatedQuote.complexityAdjustment.toString()),
          urgencyAdjustment: parseFloat(updatedQuote.urgencyAdjustment.toString()),
          totalEstimate: parseFloat(updatedQuote.totalEstimate.toString()),
          notToExceed: parseFloat(updatedQuote.notToExceed.toString()),
        },
      });
    } catch (error) {
      console.error('Accept quote error:', error);
      next(error);
    }
  },

  /**
   * Decline quote
   * POST /api/quotes/:quoteId/decline
   */
  async declineQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quoteId } = req.params;
      const { reason } = req.body;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const quote = await prisma.projectQuote.findUnique({
        where: { id: quoteId },
      });

      if (!quote) {
        res.status(404).json({
          success: false,
          error: 'Quote not found',
        });
        return;
      }

      // Verify ownership
      if (quote.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
        });
        return;
      }

      // Update quote status
      const updatedQuote = await prisma.projectQuote.update({
        where: { id: quoteId },
        data: {
          status: 'declined',
          metadata: {
            ...((quote.metadata as any) || {}),
            declineReason: reason,
            declinedAt: new Date().toISOString(),
          },
        },
      });

      // Log action
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'quote_declined',
          entityType: 'quote',
          entityId: quoteId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          requestData: { reason },
        },
      });

      res.json({
        success: true,
        message: 'Quote declined',
        quote: updatedQuote,
      });
    } catch (error) {
      console.error('Decline quote error:', error);
      next(error);
    }
  },
};
