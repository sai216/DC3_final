import nodemailer from 'nodemailer';
import twilio from 'twilio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Configure email transporter
const createEmailTransporter = () => {
  if (process.env.SENDGRID_API_KEY) {
    // Using SendGrid
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else {
    // Fallback to Gmail or other SMTP
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
};

export const otpService = {
  /**
   * Send OTP via Email
   */
  async sendEmailOTP(email: string, otpCode: string, businessName?: string): Promise<void> {
    try {
      const transporter = createEmailTransporter();
      
      const mailOptions = {
        from: `${process.env.FROM_NAME || 'Decensat Design'} <${process.env.FROM_EMAIL || 'noreply@decensatdesign.com'}>`,
        to: email,
        subject: 'Your Verification Code',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 5px 5px; }
              .otp-code { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; letter-spacing: 8px; margin: 20px 0; padding: 15px; background-color: white; border-radius: 5px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Verification Code</h1>
              </div>
              <div class="content">
                <p>Hello${businessName ? ` ${businessName}` : ''},</p>
                <p>Your verification code is:</p>
                <div class="otp-code">${otpCode}</div>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <p>If you didn't request this code, please ignore this email.</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Decensat Design. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Your verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email OTP sent to ${email}`);
    } catch (error) {
      console.error('Error sending email OTP:', error);
      throw new Error('Failed to send email OTP');
    }
  },



  /**
   * Send OTP via SMS
   */
  async sendPhoneOTP(phoneNumber: string, otpCode: string): Promise<void> {
    try {
      const message = `Your verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.\n\n- Decensat Design`;

      await twilioClient.messages.create({
        from: process.env.TWILIO_PHONE_FROM,
        to: phoneNumber,
        body: message,
      });

      console.log(`SMS OTP sent to ${phoneNumber}`);
    } catch (error) {
      console.error('Error sending SMS OTP:', error);
      throw new Error('Failed to send SMS OTP');
    }
  },

  /**
   * Generate and send WhatsApp OTP for audit system
   */
  async sendWhatsAppOTP(phoneNumber: string, userId: string): Promise<string> {
    try {
      // Generate 6-digit OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiration to 5 minutes from now
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      // Save OTP to database
      await prisma.otpVerification.create({
        data: {
          userId,
          otpType: 'whatsapp',
          otpCode,
          destination: phoneNumber,
          expiresAt,
          verified: false,
        },
      });

      // Send OTP via WhatsApp
      const message = `Your verification code is: *${otpCode}*\n\nThis code will expire in 5 minutes.\n\n- DC3 Design`;

      await twilioClient.messages.create({
        from: process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886',
        to: `whatsapp:${phoneNumber}`,
        body: message,
      });

      console.log(`WhatsApp OTP sent to ${phoneNumber}`);
      return otpCode;
    } catch (error) {
      console.error('Error sending WhatsApp OTP:', error);
      throw new Error('Failed to send WhatsApp OTP');
    }
  },

  /**
   * Verify OTP code
   */
  async verifyOTP(phoneNumber: string, otpCode: string): Promise<boolean> {
    try {
      const otpRecord = await prisma.otpVerification.findFirst({
        where: {
          destination: phoneNumber,
          otpCode,
          verified: false,
          expiresAt: {
            gte: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (!otpRecord) {
        return false;
      }

      // Mark OTP as verified
      await prisma.otpVerification.update({
        where: { id: otpRecord.id },
        data: { verified: true },
      });

      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  },
};
