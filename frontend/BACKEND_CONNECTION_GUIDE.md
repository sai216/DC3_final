# Backend Connection Guide

## 🚀 Quick Setup

### 1. Update Environment Variables

Edit `.env` file and replace with your backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api  # Development
# NEXT_PUBLIC_API_URL=https://api.yourapp.com/api  # Production
```

### 2. Current Backend Routes (Verified)

These routes are currently available on the backend:

```
GET /api/health
GET /api/routes
POST /api/auth
GET /api/quotes
GET /api/calendar
POST /api/audit
GET /api/knowledge
POST /api/chat
GET /api/conversations
GET /api/pricing
POST /api/seed
```

Notes:
- `GET /api/calendar` requires an access token. If you see `{"success":false,"error":"Access token required"}`, call `POST /api/auth` to obtain a token and include it as `Authorization: Bearer <token>` in subsequent requests.

### 3. Your Backend Developer Needs to Create These Endpoints

#### Assessment/Audit Flow Endpoints

```
POST /api/assessment/goals
Body: {
  goals: string,
  videoLink?: string,
  loomLink?: string,
  uploadedFiles?: Array<{name: string, size: number, type: string}>
}
Response: { success: boolean, message: string, data?: any }

POST /api/assessment/verify-email
Body: { email: string }
Response: { success: boolean, verified: boolean }

POST /api/assessment/validate-contact
Body: { linkedinUrl: string, phoneNumber: string }
Response: { success: boolean, linkedinValid: boolean, phoneValid: boolean }

POST /api/assessment/book-meeting
Body: { meetingDate: string, meetingTime: string, email: string }
Response: { success: boolean, meetingLink: string, confirmationSent: boolean }

POST /api/assessment/complete
Body: { all assessment data }
Response: { success: boolean, assessmentId: string }
```

#### File Upload Endpoints

```
POST /api/files/upload
Headers: Content-Type: multipart/form-data
Body: FormData with 'file' field
Response: { success: boolean, fileUrl: string, fileId: string }

POST /api/files/upload-multiple
Headers: Content-Type: multipart/form-data
Body: FormData with 'files' field (array)
Response: { success: boolean, files: Array<{url: string, id: string}> }
```

#### User Profile Endpoints (Optional)

```
POST /api/users/profile
Body: { user profile data }
Response: { success: boolean, userId: string, profile: any }

GET /api/users/profile/:userId
Response: { success: boolean, profile: any }
```

#### Analytics Endpoints (Optional)

```
POST /api/analytics/track
Body: { eventName: string, eventData: any, timestamp: string }
Response: { success: boolean }
```

## 📝 How to Use in Components

### Example 1: In ProjectAssessmentHub Component

```typescript
import { assessmentAPI } from '@/services/apiService';

// Inside handleNext function
const handleNext = async () => {
  if (currentStep === 'goals_and_video') {
    setIsLoading(true);
    
    // Call backend API
    const { data, error } = await assessmentAPI.submitGoalsAndVideo({
      goals: submission.goals,
      videoLink: submission.videoLink,
      loomLink: submission.loomLink,
      uploadedFiles: submission.uploadedFiles,
    });

    if (error) {
      setErrors({ goals: `[!] ERROR: ${error}` });
      setIsLoading(false);
      return;
    }

    // Success - proceed to next step
    setIsLoading(false);
    setCurrentStep('privy_auth');
  }
};
```

### Example 2: File Upload

```typescript
import { fileAPI } from '@/services/apiService';

const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  
  setIsLoading(true);
  const { data, error } = await fileAPI.uploadMultipleFiles(files);
  
  if (error) {
    alert(`Upload failed: ${error}`);
  } else {
    console.log('Files uploaded:', data);
    // Store file URLs from response
  }
  setIsLoading(false);
};
```

### Example 3: Email Verification

```typescript
import { assessmentAPI } from '@/services/apiService';

const verifyEmail = async (email: string) => {
  const { data, error } = await assessmentAPI.verifyEmail(email);
  
  if (error) {
    setErrors({ email: `[!] ERROR: ${error}` });
    return false;
  }
  
  return data?.verified || false;
};
```

## 🔧 Backend Requirements

Your backend must:

1. **Accept JSON requests** with `Content-Type: application/json`
2. **Return JSON responses** in this format:
   ```json
   {
     "success": true,
     "message": "Operation successful",
     "data": { /* your data here */ }
   }
   ```
3. **Handle CORS** if frontend and backend are on different domains:
   ```javascript
   // Express example
   app.use(cors({
     origin: 'http://localhost:3001',
     credentials: true
   }));
   ```
4. **Handle errors** with proper HTTP status codes:
   - 200: Success
   - 400: Bad Request (validation errors)
   - 401: Unauthorized
   - 404: Not Found
   - 500: Server Error

## 📊 Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "phone": "Phone number required"
  }
}
```

## 🔐 Authentication (if needed)

If your backend requires authentication tokens:

```typescript
// Add token to API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  const token = localStorage.getItem('authToken'); // or get from your auth system
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Add this line
      ...options.headers,
    },
  });
  // ... rest of the code
}
```

## 🧪 Testing Backend Connection

1. **Start your backend server** (e.g., `npm run start` in backend folder)
2. **Verify backend is running**: Open http://localhost:5000 in browser
3. **Test API endpoint**: Use Postman or curl:
   ```bash
   curl -X POST http://localhost:5000/api/assessment/goals \
     -H "Content-Type: application/json" \
     -d '{"goals":"Test project","loomLink":"https://loom.com/test"}'
   ```
4. **Start frontend**: `npm run dev`
5. **Test the form**: Fill out the assessment form and submit

## 📦 Environment Files

- `.env` - Git committed (no secrets)
- `.env.local` - Not committed (local overrides, secrets)
- `.env.production` - Production variables

Create `.env.local` for local development:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Production Deployment

When deploying to production:

1. Update `.env.production`:
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourapp.com/api
   ```

2. Or set environment variable in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - AWS/Azure: Application Configuration

## 🛠️ Troubleshooting

### CORS Errors
**Problem**: `Access to fetch blocked by CORS policy`
**Solution**: Backend must allow requests from your frontend domain

### Network Error
**Problem**: `Network error occurred`
**Solution**: 
- Check backend is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check firewall/network settings

### 404 Not Found
**Problem**: API endpoint not found
**Solution**: Verify endpoint paths match between frontend and backend

## 📞 Contact Backend Developer

Share this guide with your backend developer and ask for:

1. ✅ Backend API base URL
2. ✅ Authentication method (if any)
3. ✅ Expected request/response format
4. ✅ CORS configuration confirmation
5. ✅ Error handling format
6. ✅ Any rate limiting or quotas

## Next Steps

1. ✅ Update `NEXT_PUBLIC_API_URL` in `.env`
2. ✅ Backend developer creates endpoints (see list above)
3. ✅ Test each endpoint with Postman
4. ✅ Integrate API calls into components (see `services/apiService.ts`)
5. ✅ Handle loading states and errors
6. ✅ Test entire flow end-to-end
