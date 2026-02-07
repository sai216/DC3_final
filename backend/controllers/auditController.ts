import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { storageService } from '../services/storageService';
import { googleCalendarService } from '../services/googleCalendarService';
import { otpService } from '../services/otpService';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId?: string;
  authStage?: number;
}

class AuditController {
  /**
   * POST /api/audit/upload
   * Upload supporting documents (Manifest Step)
   */
  async uploadFiles(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          error: 'No files uploaded',
        });
        return;
      }

      // Check file size limit (25MB per file)
      const maxSize = 25 * 1024 * 1024; // 25MB in bytes
      for (const file of files) {
        if (file.size > maxSize) {
          res.status(400).json({
            success: false,
            error: `File ${file.originalname} exceeds 25MB limit`,
          });
          return;
        }
      }

      // Upload files to GCP Cloud Storage
      const uploadedFiles = await storageService.uploadMultipleFiles(
        files,
        userId
      );

      // Save file metadata to database
      const fileRecords = await Promise.all(
        uploadedFiles.map((fileInfo) =>
          prisma.uploadedFile.create({
            data: {
              userId,
              fileName: fileInfo.id,
              originalName: fileInfo.name,
              mimeType: files.find((f) => f.originalname === fileInfo.name)
                ?.mimetype || 'application/octet-stream',
              fileSize: fileInfo.size,
              storageUrl: fileInfo.url,
              signedUrl: fileInfo.signedUrl,
              signedUrlExpiry: fileInfo.signedUrlExpiry,
              bucketPath: fileInfo.bucketPath,
            },
          })
        )
      );

      res.json({
        success: true,
        files: fileRecords.map((record, index) => ({
          id: record.id,
          url: uploadedFiles[index].signedUrl,
          name: record.originalName,
          size: record.fileSize,
        })),
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload files',
      });
    }
  }

  /**
   * POST /api/audit/manifest
   * Submit Loom + Docs URLs (Manifest Step)
   */
  async submitManifest(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { loomUrl, docsUrl, fileIds } = req.body;

      // Validate input
      if (!loomUrl && !docsUrl && (!fileIds || fileIds.length === 0)) {
        res.status(400).json({
          success: false,
          error: 'At least one of loomUrl, docsUrl, or fileIds is required',
        });
        return;
      }

      // Verify fileIds belong to the user
      if (fileIds && fileIds.length > 0) {
        const files = await prisma.uploadedFile.findMany({
          where: {
            id: { in: fileIds },
            userId,
          },
        });

        if (files.length !== fileIds.length) {
          res.status(400).json({
            success: false,
            error: 'Some files not found or do not belong to user',
          });
          return;
        }
      }

      // Create manifest
      const manifest = await prisma.auditManifest.create({
        data: {
          userId,
          loomUrl,
          docsUrl,
          files: {
            create: fileIds
              ? fileIds.map((fileId: string) => ({
                  fileId,
                }))
              : [],
          },
        },
        include: {
          files: {
            include: {
              file: true,
            },
          },
        },
      });

      res.json({
        success: true,
        manifestId: manifest.id,
      });
    } catch (error) {
      console.error('Error submitting manifest:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit manifest',
      });
    }
  }

  /**
   * POST /api/audit/identity
   * Store identity verification (Auth Identity Step)
   */
  async submitIdentity(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { linkedinUrl, businessEmail, whatsappNumber } = req.body;

      // Validate at least one field is provided
      if (!linkedinUrl && !businessEmail && !whatsappNumber) {
        res.status(400).json({
          success: false,
          error:
            'At least one of linkedinUrl, businessEmail, or whatsappNumber is required',
        });
        return;
      }

      // Create identity record
      const identity = await prisma.auditIdentity.create({
        data: {
          userId,
          linkedinUrl,
          businessEmail,
          whatsappNumber,
          verified: false,
        },
      });

      res.json({
        success: true,
        identityId: identity.id,
      });
    } catch (error) {
      console.error('Error submitting identity:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit identity',
      });
    }
  }

  /**
   * POST /api/audit/otp/send
   * Send WhatsApp OTP (OTP Step)
   */
  // async sendOTP(req: AuthRequest, res: Response): Promise<void> {
  //   try {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       res.status(401).json({
  //         success: false,
  //         error: 'Unauthorized',
  //       });
  //       return;
  //     }

  //     const { phoneNumber } = req.body;

  //     if (!phoneNumber) {
  //       res.status(400).json({
  //         success: false,
  //         error: 'phoneNumber is required',
  //       });
  //       return;
  //     }

  //     // Send OTP via WhatsApp
  //     await otpService.sendWhatsAppOTP(phoneNumber, userId);

  //     res.json({
  //       success: true,
  //       message: 'OTP sent',
  //       expiresIn: 300, // 5 minutes
  //     });
  //   } catch (error) {
  //     console.error('Error sending OTP:', error);
  //     res.status(500).json({
  //       success: false,
  //       error: 'Failed to send OTP',
  //     });
  //   }
  // }

  /**
   * POST /api/audit/otp/verify
   * Verify WhatsApp OTP (OTP Step)
   */
  // async verifyOTP(req: AuthRequest, res: Response): Promise<void> {
  //   try {
  //     const userId = req.user?.id;
  //     if (!userId) {
  //       res.status(401).json({
  //         success: false,
  //         error: 'Unauthorized',
  //       });
  //       return;
  //     }

  //     const { phoneNumber, code } = req.body;

  //     if (!phoneNumber || !code) {
  //       res.status(400).json({
  //         success: false,
  //         error: 'phoneNumber and code are required',
  //       });
  //       return;
  //     }

  //     // Verify OTP
  //     const isValid = await otpService.verifyOTP(phoneNumber, code);

  //     if (!isValid) {
  //       res.status(400).json({
  //         success: false,
  //         error: 'Invalid or expired OTP',
  //       });
  //       return;
  //     }

  //     // Update user's phone verification status
  //     await prisma.user.update({
  //       where: { id: userId },
  //       data: {
  //         phoneE164: phoneNumber,
  //         whatsappVerified: true,
  //       },
  //     });

  //     res.json({
  //       success: true,
  //       verified: true,
  //       message: 'Phone verified',
  //     });
  //   } catch (error) {
  //     console.error('Error verifying OTP:', error);
  //     res.status(500).json({
  //       success: false,
  //       error: 'Failed to verify OTP',
  //     });
  //   }
  // }

  /**
   * POST /api/audit/schedule
   * Schedule Google Meet (Google Meet Step)
   */
  async scheduleCall(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { date, time, timezone, duration } = req.body;

      if (!date || !time || !timezone) {
        res.status(400).json({
          success: false,
          error: 'date, time, and timezone are required',
        });
        return;
      }

      // Combine date and time
      const scheduledDateTime = new Date(`${date}T${time}:00`);

      // Get user email from database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true }
      });

      const calendarEnabled = Boolean(process.env.GOOGLE_REFRESH_TOKEN);
      let calendarEvent: { eventId: string; meetLink?: string } | null = null;

      if (calendarEnabled) {
        // Create Google Calendar event with Meet link
        calendarEvent = await googleCalendarService.createStrategyCall(
          user?.email || 'noreply@dc3.com',
          'DC3 Audit User',
          scheduledDateTime,
          duration || 60
        );
      }

      // Create strategy call record
      const strategyCall = await prisma.strategyCall.create({
        data: {
          userId,
          googleEventId: calendarEvent?.eventId || null,
          scheduledAt: scheduledDateTime,
          durationMinutes: duration || 60,
          meetLink: calendarEvent?.meetLink || null,
          status: 'scheduled',
        },
      });

      res.json({
        success: true,
        meetingId: strategyCall.id,
        googleMeetLink: calendarEvent?.meetLink || '',
        eventId: calendarEvent?.eventId || '',
      });
    } catch (error: any) {
      console.error('Error scheduling call:', error);
      console.error('Error details:', error.message);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        error: 'Failed to schedule call',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/audit/submit
   * Finalize audit submission (Success Step)
   */
  async submitAudit(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { manifestId, identityId, meetingId, goals } = req.body;

      // Validate required fields
      if (!manifestId || !identityId || !meetingId) {
        res.status(400).json({
          success: false,
          error: 'manifestId, identityId, and meetingId are required',
        });
        return;
      }

      // Verify all records belong to the user
      const [manifest, identity, meeting] = await Promise.all([
        prisma.auditManifest.findFirst({
          where: { id: manifestId, userId },
        }),
        prisma.auditIdentity.findFirst({
          where: { id: identityId, userId },
        }),
        prisma.strategyCall.findFirst({
          where: { id: meetingId, userId },
        }),
      ]);

      if (!manifest) {
        res.status(404).json({
          success: false,
          error: 'Manifest not found',
        });
        return;
      }

      if (!identity) {
        res.status(404).json({
          success: false,
          error: 'Identity not found',
        });
        return;
      }

      if (!meeting) {
        res.status(404).json({
          success: false,
          error: 'Meeting not found',
        });
        return;
      }

      // Get user's phone verification status
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      // Create audit submission
      const submission = await prisma.auditSubmission.create({
        data: {
          userId,
          manifestId,
          identityId,
          meetingId,
          goals: goals || {},
          status: 'submitted',
          phoneVerified: user?.whatsappVerified || false,
          googleMeetLink: meeting.meetLink,
          scheduledDate: meeting.scheduledAt,
          submittedAt: new Date(),
        },
        include: {
          manifest: {
            include: {
              files: {
                include: {
                  file: true,
                },
              },
            },
          },
          identity: true,
        },
      });

      res.json({
        success: true,
        auditId: submission.id,
        status: 'submitted',
      });
    } catch (error) {
      console.error('Error submitting audit:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to submit audit',
      });
    }
  }

  /**
   * GET /api/audit/my-submissions
   * Get user's audit submissions
   */
  async getMySubmissions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const submissions = await prisma.auditSubmission.findMany({
        where: { userId },
        include: {
          manifest: {
            include: {
              files: {
                include: {
                  file: true,
                },
              },
            },
          },
          identity: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        success: true,
        submissions,
      });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch submissions',
      });
    }
  }

  /**
   * GET /api/audit/submission/:id
   * Get specific audit submission by ID
   */
  async getSubmissionById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Unauthorized',
        });
        return;
      }

      const { id } = req.params;

      const submission = await prisma.auditSubmission.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          manifest: {
            include: {
              files: {
                include: {
                  file: true,
                },
              },
            },
          },
          identity: true,
        },
      });

      if (!submission) {
        res.status(404).json({
          success: false,
          error: 'Submission not found',
        });
        return;
      }

      res.json({
        success: true,
        submission,
      });
    } catch (error) {
      console.error('Error fetching submission:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch submission',
      });
    }
  }
}

export const auditController = new AuditController();
