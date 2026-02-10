import { z } from 'zod';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'application/json',
  'text/html',
  'text/javascript',
  'application/javascript',
  'text/typescript',
  'application/typescript'
];

export const artifactSchema = z.object({
  type: z.enum(['visualization', 'spec']),
  format: z.enum(['file', 'link']),
  value: z.string().min(1, 'Artifact value is required'),
  name: z.string().optional(),
  mimeType: z.string().optional().refine(val => !val || ALLOWED_MIME_TYPES.includes(val), {
    message: 'Unsupported file format'
  }),
  size: z.number().max(10 * 1024 * 1024, 'Max file size 10MB').optional()
});

/**
 * Validates strict E.164 format.
 * Format: +[country code][subscriber number], max 15 digits.
 */
export const isValidE164 = (phone: string): boolean => {
  return /^\+[1-9]\d{1,14}$/.test(phone);
};

export const identitySchema = z.object({
  linkedin: z.string().url('Invalid URL format').refine(val => val.toLowerCase().includes('linkedin.com'), 'LinkedIn profile URL must contain "linkedin.com". Format: https://www.linkedin.com/in/username'),
  phone: z.string().refine(isValidE164, 'E.164 format REQUIRED (e.g. +14155552671).'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  country: z.string().min(2, 'Country code required'),
  otpVerified: z.boolean(),
});

export const auditSubmissionSchema = z.object({
  intent: z.string().min(10, 'Intent description must be at least 10 characters'),
  visualization: artifactSchema,
  spec: artifactSchema.optional(),
  ...identitySchema.shape,
  scheduledAt: z.string().datetime().optional()
}).superRefine((data, ctx) => {
  // Enforce OTP verification for US contacts
  if (data.country === 'US' && !data.otpVerified) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'OTP verification required for USA contacts',
      path: ['otpVerified']
    });
  }
});

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
  blockingReasons: string[];
}

/**
 * Normalizes phone strings to strict E.164 compatibility.
 * Strips all non-numeric characters EXCEPT a single leading '+'.
 */
export const normalizePhone = (val: string): string => {
  if (!val) return '';
  let cleaned = val.replace(/[^\d+]/g, '');
  if (cleaned.length > 0 && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  // Trim to max E.164 length (15 digits + 1 plus sign)
  return cleaned.slice(0, 16);
};

/**
 * Validates scheduling constraints against institutional rules.
 */
// FIX: Removed invalid backslash line continuation and merged the arrow function signature to ensure 'date' parameter scope.
export const checkSchedulingWindow = (date: Date): { valid: boolean; reason?: string; code?: string } => {
  const now = new Date();
  const bufferTime = 72 * 60 * 60 * 1000; // 72 hours
  
  if (date.getTime() < now.getTime() + bufferTime) {
    return { 
      valid: false, 
      reason: 'Temporal buffer violation: 72-hour provisioning window required.', 
      code: 'TEMPORAL_BUFFER_VIOLATION' 
    };
  }

  const mins = date.getMinutes();
  if (mins !== 0 && mins !== 30) {
    return { 
      valid: false, 
      reason: 'Sync alignment error: Please select a 30-minute block (:00 or :30).', 
      code: 'ALIGNMENT_ERROR' 
    };
  }

  const day = date.getDay(); // 0 = Sun
  const hour = date.getHours();
  const timeVal = hour + date.getMinutes() / 60;

  if (day === 0) {
    return { 
      valid: false, 
      reason: 'Sunday is reserved for OFFLINE_MAINTENANCE protocol.', 
      code: 'OFFLINE_WINDOW' 
    };
  }
  
  if (day >= 1 && day <= 5) {
    if (timeVal < 9 || timeVal >= 18) {
      return { 
        valid: false, 
        reason: 'Outside operational window: 9:00 AM - 6:00 PM UST (M-F).', 
        code: 'CORE_WINDOW_VIOLATION' 
      };
    }
  }
  
  if (day === 6) {
    if (timeVal < 12 || timeVal >= 17) {
      return { 
        valid: false, 
        reason: 'Outside operational window: 12:00 PM - 5:00 PM UST (Sat).', 
        code: 'VENTURE_WINDOW_VIOLATION' 
      };
    }
  }

  return { valid: true };
};

/**
 * Step-aware validation logic for client-side enforcement.
 * Now precisely identifies which mandatory fields are missing.
 */
export const validateStep = (step: string, data: any): ValidationResult => {
  const result: ValidationResult = { isValid: true, errors: {}, warnings: [], blockingReasons: [] };
  const missingNodes: string[] = [];

  if (step === 'intent') {
    if (!data.intent || data.intent.trim().length < 10) {
      result.isValid = false;
      result.errors.intent = 'Institutional intent manifest is too brief (min 10 chars).';
      missingNodes.push('BUSINESS_INTENT');
    }
  }

  if (step === 'materials') {
    if (!data.visualization || !data.visualization.value || data.visualization.value.trim().length === 0) {
      result.isValid = false;
      result.errors.visualization = 'System visualization artifact is REQUIRED for scoping.';
      missingNodes.push('VISUALIZATION_LINK');
    }
  }

  if (step === 'identity') {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!data.linkedin || !data.linkedin.toLowerCase().includes('linkedin.com')) {
      result.isValid = false;
      result.errors.linkedin = '[!] UPLINK_REJECTED: Identity link must contain "linkedin.com".';
      missingNodes.push('IDENTITY_URL');
    }
    
    if (!data.phone) {
        result.isValid = false;
        result.errors.phone = 'UPLINK_ERROR: Phone signal missing.';
        missingNodes.push('CONTACT_PHONE');
    } else if (!data.phone.startsWith('+')) {
        result.isValid = false;
        result.errors.phone = 'UPLINK_ERROR: E.164 requires leading "+" prefix.';
        missingNodes.push('CONTACT_PHONE');
    } else if (!isValidE164(data.phone)) {
        result.isValid = false;
        result.errors.phone = 'UPLINK_ERROR: Invalid E.164 sequence detected.';
        missingNodes.push('CONTACT_PHONE');
    }

    if (!data.email || !emailRegex.test(data.email)) {
      result.isValid = false;
      result.errors.email = '[!] UPLINK_REJECTED: Invalid RFC-compliant email format.';
      missingNodes.push('UPLINK_EMAIL');
    }
  }

  if (step === 'scheduling') {
    if (!data.scheduledAt) {
      result.isValid = false;
      result.errors.scheduling = 'Strategic signal synchronization is REQUIRED.';
      missingNodes.push('TEMPORAL_SYNC');
    } else {
      const check = checkSchedulingWindow(new Date(data.scheduledAt));
      if (!check.valid) {
        result.isValid = false;
        result.errors.scheduling = check.reason || 'Invalid temporal window.';
        result.blockingReasons.push(check.code || 'Temporal window violation');
      }
    }
  }

  if (missingNodes.length > 0) {
    result.blockingReasons = [`[!] MANDATORY_FIELD_MISSING: [${missingNodes.join(' :: ')}]`, ...result.blockingReasons];
  }

  return result;
};