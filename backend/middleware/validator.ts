import { Request, Response, NextFunction } from 'express';

/**
 * Validate email format
 */
export const validateEmail = (req: Request, res: Response, next: NextFunction): void => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({
      success: false,
      error: 'Email is required',
    });
    return;
  }

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      error: 'Invalid email format',
    });
    return;
  }

  next();
};

/**
 * Validate phone number format (E.164)
 */
export const validatePhone = (req: Request, res: Response, next: NextFunction): void => {
  const { phoneNumber, method } = req.body;

  if (!phoneNumber) {
    res.status(400).json({
      success: false,
      error: 'Phone number is required',
    });
    return;
  }

  // E.164 format validation (international phone numbers)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  const phoneE164 = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  
  if (!phoneRegex.test(phoneE164)) {
    res.status(400).json({
      success: false,
      error: 'Invalid phone number format. Use E.164 format (e.g., +1234567890)',
    });
    return;
  }

  // Validate method if provided
  if (method && !['sms', 'whatsapp'].includes(method)) {
    res.status(400).json({
      success: false,
      error: 'Method must be either "sms" or "whatsapp"',
    });
    return;
  }

  next();
};

/**
 * Validate OTP code format
 */
export const validateOTP = (req: Request, res: Response, next: NextFunction): void => {
  const { otpCode } = req.body;

  if (!otpCode) {
    res.status(400).json({
      success: false,
      error: 'OTP code is required',
    });
    return;
  }

  // OTP should be 6 digits
  if (!/^\d{6}$/.test(otpCode)) {
    res.status(400).json({
      success: false,
      error: 'OTP code must be 6 digits',
    });
    return;
  }

  next();
};

/**
 * Validate request body has required fields
 */
export const validateRequired = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];

    fields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`,
      });
      return;
    }

    next();
  };
};
