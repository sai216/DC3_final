/**
 * API Service - Central backend connection for the entire website
 * Replace API_BASE_URL with your actual backend URL
 */

// Get the API base URL from environment variable or use default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const AUTH_TOKEN_KEY = 'decensat_auth_token';

const getStoredAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const authTokenStore = {
  get: getStoredAuthToken,
  set: (token: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  clear: () => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },
};

const getAuthHeader = (): Record<string, string> => {
  const token = getStoredAuthToken();
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Assessment/Audit Form APIs
 */
export const assessmentAPI = {
  // Submit goals and video
  submitGoalsAndVideo: async (data: {
    goals: string;
    videoLink?: string;
    loomLink?: string;
    uploadedFiles?: Array<{ name: string; size: number; type: string }>;
  }) => {
    return apiRequest('/assessment/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verify email
  verifyEmail: async (email: string) => {
    return apiRequest('/assessment/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Validate LinkedIn and Phone
  validateContactInfo: async (data: {
    linkedinUrl: string;
    phoneNumber: string;
  }) => {
    return apiRequest('/assessment/validate-contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Book meeting
  bookMeeting: async (data: {
    meetingDate: string;
    meetingTime: string;
    email: string;
  }) => {
    return apiRequest('/assessment/book-meeting', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Complete assessment
  completeAssessment: async (fullData: any) => {
    return apiRequest('/assessment/complete', {
      method: 'POST',
      body: JSON.stringify(fullData),
    });
  },
};

/**
 * Auth APIs
 */
export const authAPI = {
  authenticateWithPrivy: async (accessToken: string) => {
    return apiRequest('/auth/privy/authenticate', {
      method: 'POST',
      body: JSON.stringify({ accessToken }),
    });
  },
};

/**
 * Audit Flow APIs
 */
export const auditAPI = {
  uploadFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch(`${API_BASE_URL}/audit/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.error || errorData.message || `Upload failed: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  submitManifest: async (data: {
    loomUrl?: string;
    docsUrl?: string;
    fileIds?: string[];
  }) => {
    return apiRequest('/audit/manifest', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submitIdentity: async (data: {
    linkedinUrl?: string;
    businessEmail?: string;
    whatsappNumber?: string;
  }) => {
    return apiRequest('/audit/identity', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  sendOtp: async (phoneNumber: string) => {
    return apiRequest('/audit/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber }),
    });
  },

  verifyOtp: async (phoneNumber: string, code: string) => {
    return apiRequest('/audit/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phoneNumber, code }),
    });
  },

  scheduleCall: async (data: {
    date: string;
    time: string;
    timezone: string;
    duration?: number;
  }) => {
    return apiRequest('/audit/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  submitAudit: async (data: {
    manifestId: string;
    identityId: string;
    meetingId: string;
    goals?: Record<string, unknown>;
  }) => {
    return apiRequest('/audit/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * User/Auth APIs (if needed beyond Privy)
 */
export const userAPI = {
  createProfile: async (userData: any) => {
    return apiRequest('/users/profile', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async (userId: string) => {
    return apiRequest(`/users/profile/${userId}`, {
      method: 'GET',
    });
  },
};

/**
 * File Upload API
 */
export const fileAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          ...getAuthHeader(),
        },
        // Don't set Content-Type header - browser will set it with boundary for multipart
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || `Upload failed: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },

  uploadMultipleFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/files/upload-multiple`, {
        method: 'POST',
        body: formData,
        headers: {
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.message || `Upload failed: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  },
};

/**
 * Analytics/Tracking APIs
 */
export const analyticsAPI = {
  trackEvent: async (eventName: string, eventData: any) => {
    return apiRequest('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ eventName, eventData, timestamp: new Date().toISOString() }),
    });
  },
};

export default {
  assessmentAPI,
  authAPI,
  auditAPI,
  userAPI,
  fileAPI,
  analyticsAPI,
};
