import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { googleCalendarService } from '../services/googleCalendarService';

export const calendarController = {
  /**
   * Get available time slots for strategy calls
   * GET /api/calendar/available-slots?startDate=2026-01-23&days=7
   */
  async getAvailableSlots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      // Get query parameters
      const startDateParam = req.query.startDate as string;
      const daysParam = req.query.days as string;
      const durationParam = req.query.duration as string;

      // Default to tomorrow if no start date provided
      const startDate = startDateParam
        ? new Date(startDateParam)
        : new Date(Date.now() + 24 * 60 * 60 * 1000);

      const days = daysParam ? parseInt(daysParam) : 7;
      const duration = durationParam
        ? parseInt(durationParam)
        : parseInt(process.env.STRATEGY_CALL_DURATION_MIN || '60');

      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);

      // Get available slots
      const slots = await googleCalendarService.getAvailableSlots(
        startDate,
        endDate,
        duration
      );

      res.json({
        success: true,
        slots,
        duration,
      });
    } catch (error) {
      console.error('Get available slots error:', error);
      next(error);
    }
  },

  /**
   * Book a strategy call
   * POST /api/calendar/book
   * Body: { projectId?: string, scheduledAt: Date }
   */
  async bookStrategyCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { projectId, scheduledAt } = req.body;

      if (!scheduledAt) {
        res.status(400).json({
          success: false,
          error: 'scheduledAt is required',
        });
        return;
      }

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          businessName: true,
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // Validate project if provided
      if (projectId) {
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

        if (project.userId !== userId) {
          res.status(403).json({
            success: false,
            error: 'Access denied',
          });
          return;
        }
      }

      const scheduledDate = new Date(scheduledAt);
      const duration = parseInt(process.env.STRATEGY_CALL_DURATION_MIN || '60');

      // Check if user already has a call scheduled at this time
      const existingCall = await prisma.strategyCall.findFirst({
        where: {
          userId,
          scheduledAt: scheduledDate,
          status: { in: ['scheduled', 'confirmed'] },
        },
      });

      if (existingCall) {
        res.status(400).json({
          success: false,
          error: 'You already have a call scheduled at this time',
        });
        return;
      }

      const dayOfWeek = scheduledDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        res.status(400).json({
          success: false,
          error: 'Strategy calls are only available Monday through Friday',
        });
        return;
      }

      const isAvailable = await googleCalendarService.isSlotAvailable(
        scheduledDate,
        duration
      );

      if (!isAvailable) {
        res.status(409).json({
          success: false,
          error: 'Selected time is no longer available. Please choose another slot.',
        });
        return;
      }

      // Create Google Calendar event
      const calendarEvent = await googleCalendarService.createStrategyCall(
        user.email,
        user.businessName || 'Strategy Call',
        scheduledDate,
        duration
      );

      // Create strategy call record
      const strategyCall = await prisma.strategyCall.create({
        data: {
          userId,
          projectId: projectId || null,
          googleEventId: calendarEvent.eventId,
          scheduledAt: scheduledDate,
          durationMinutes: duration,
          meetLink: calendarEvent.meetLink,
          status: 'scheduled',
        },
      });

      // Update project status if project is linked
      if (projectId) {
        await prisma.projectAssessment.update({
          where: { id: projectId },
          data: { status: 'strategy_call_booked' },
        });
      }

      // Log action
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'strategy_call_booked',
          entityType: 'strategy_call',
          entityId: strategyCall.id,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          requestData: { projectId, scheduledAt },
        },
      });

      res.json({
        success: true,
        message: 'Strategy call booked successfully',
        call: strategyCall,
      });
    } catch (error) {
      console.error('Book strategy call error:', error);
      next(error);
    }
  },

  /**
   * Get user's booked strategy calls
   * GET /api/calendar/my-calls
   */
  async getUserCalls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const calls = await prisma.strategyCall.findMany({
        where: { userId },
        include: {
          project: {
            select: {
              projectName: true,
              projectType: true,
            },
          },
        },
        orderBy: { scheduledAt: 'desc' },
      });

      res.json({
        success: true,
        calls,
      });
    } catch (error) {
      console.error('Get user calls error:', error);
      next(error);
    }
  },

  /**
   * Cancel a strategy call
   * DELETE /api/calendar/:callId
   */
  async cancelStrategyCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { callId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const strategyCall = await prisma.strategyCall.findUnique({
        where: { id: callId },
      });

      if (!strategyCall) {
        res.status(404).json({
          success: false,
          error: 'Strategy call not found',
        });
        return;
      }

      // Verify ownership
      if (strategyCall.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
        });
        return;
      }

      // Check if call can be cancelled
      if (strategyCall.status === 'completed' || strategyCall.status === 'cancelled') {
        res.status(400).json({
          success: false,
          error: `Cannot cancel call with status: ${strategyCall.status}`,
        });
        return;
      }

      // Cancel Google Calendar event
      if (strategyCall.googleEventId) {
        try {
          await googleCalendarService.cancelStrategyCall(strategyCall.googleEventId);
        } catch (error) {
          console.error('Error canceling Google Calendar event:', error);
          // Continue even if calendar cancellation fails
        }
      }

      // Update strategy call status
      const updatedCall = await prisma.strategyCall.update({
        where: { id: callId },
        data: { status: 'cancelled' },
      });

      // Log action
      await prisma.auditLog.create({
        data: {
          userId,
          action: 'strategy_call_cancelled',
          entityType: 'strategy_call',
          entityId: callId,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
        },
      });

      res.json({
        success: true,
        message: 'Strategy call cancelled successfully',
        call: updatedCall,
      });
    } catch (error) {
      console.error('Cancel strategy call error:', error);
      next(error);
    }
  },

  /**
   * Get strategy call by ID
   * GET /api/calendar/call/:callId
   */
  async getCallById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { callId } = req.params;
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const strategyCall = await prisma.strategyCall.findUnique({
        where: { id: callId },
        include: {
          project: {
            select: {
              projectName: true,
              projectType: true,
              projectDescription: true,
            },
          },
          user: {
            select: {
              email: true,
              businessName: true,
            },
          },
        },
      });

      if (!strategyCall) {
        res.status(404).json({
          success: false,
          error: 'Strategy call not found',
        });
        return;
      }

      // Verify ownership
      if (strategyCall.userId !== userId) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
        });
        return;
      }

      res.json({
        success: true,
        call: strategyCall,
      });
    } catch (error) {
      console.error('Get call by ID error:', error);
      next(error);
    }
  },
};
