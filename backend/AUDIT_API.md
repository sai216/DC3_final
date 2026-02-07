# Audit System API Documentation

## Overview
The Audit System provides a complete workflow for users to submit project audits, including file uploads, identity verification, OTP validation, and Google Meet scheduling.

## Authentication
All endpoints require JWT authentication via the `Authorization: Bearer <token>` header. Users must first authenticate using the Privy authentication endpoint.

## Workflow Steps
1. **File Upload** → Upload supporting documents
2. **Manifest Submission** → Submit Loom video and Google Docs URLs
3. **Identity Verification** → Provide LinkedIn, business email, and WhatsApp number
4. **OTP Verification** → Send and verify WhatsApp OTP
5. **Meeting Scheduling** → Schedule Google Meet call
6. **Final Submission** → Submit complete audit

---

## Endpoints

### 1. Upload Supporting Documents
**POST** `/api/audit/upload`

Upload supporting documents for the audit (Manifest Step).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
- `files`: Array of files (max 10 files, 25MB each)
- Supported formats: PDF, DOC, DOCX, TXT

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "id": "file_123",
      "url": "https://storage.googleapis.com/bucket-name/file_123.pdf",
      "name": "document.pdf",
      "size": 1048576
    }
  ]
}
```

**Error Responses:**
- `400` - No files uploaded / File exceeds 25MB limit / Invalid file type
- `401` - Unauthorized
- `500` - Failed to upload files

---

### 2. Submit Manifest
**POST** `/api/audit/manifest`

Submit Loom video URL, Google Docs URL, and uploaded file IDs.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "loomUrl": "https://loom.com/share/...",
  "docsUrl": "https://docs.google.com/...",
  "fileIds": ["file_123", "file_456"]
}
```

**Response:**
```json
{
  "success": true,
  "manifestId": "manifest_789"
}
```

**Error Responses:**
- `400` - Missing required fields / Invalid file IDs
- `401` - Unauthorized
- `500` - Failed to submit manifest

---

### 3. Submit Identity
**POST** `/api/audit/identity`

Store identity verification information.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "linkedinUrl": "https://linkedin.com/in/username",
  "businessEmail": "user@company.com",
  "whatsappNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "identityId": "identity_101"
}
```

**Error Responses:**
- `400` - At least one field is required
- `401` - Unauthorized
- `500` - Failed to submit identity

---

### 4. Send WhatsApp OTP
**POST** `/api/audit/otp/send`

Send OTP to WhatsApp number for verification.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "phoneNumber": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent",
  "expiresIn": 300
}
```

**Error Responses:**
- `400` - phoneNumber is required
- `401` - Unauthorized
- `500` - Failed to send OTP

---

### 5. Verify WhatsApp OTP
**POST** `/api/audit/otp/verify`

Verify the OTP code sent to WhatsApp.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "message": "Phone verified"
}
```

**Error Responses:**
- `400` - Missing required fields / Invalid or expired OTP
- `401` - Unauthorized
- `500` - Failed to verify OTP

---

### 6. Schedule Google Meet
**POST** `/api/audit/schedule`

Schedule a Google Meet call for the audit.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2026-02-15",
  "time": "14:00",
  "timezone": "America/New_York",
  "duration": 60
}
```

**Response:**
```json
{
  "success": true,
  "meetingId": "meeting_202",
  "googleMeetLink": "https://meet.google.com/abc-defg-hij",
  "eventId": "event_303"
}
```

**Error Responses:**
- `400` - Missing required fields (date, time, timezone)
- `401` - Unauthorized
- `500` - Failed to schedule call

---

### 7. Submit Audit
**POST** `/api/audit/submit`

Finalize the audit submission by linking all previous steps.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "manifestId": "manifest_789",
  "identityId": "identity_101",
  "meetingId": "meeting_202",
  "goals": {
    "description": "Project goals and objectives",
    "timeline": "Expected timeline"
  }
}
```

**Response:**
```json
{
  "success": true,
  "auditId": "audit_404",
  "status": "submitted"
}
```

**Error Responses:**
- `400` - Missing required fields
- `404` - Manifest/Identity/Meeting not found
- `401` - Unauthorized
- `500` - Failed to submit audit

---

### 8. Get My Submissions
**GET** `/api/audit/my-submissions`

Retrieve all audit submissions for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "submissions": [
    {
      "id": "audit_404",
      "status": "submitted",
      "phoneVerified": true,
      "googleMeetLink": "https://meet.google.com/abc-defg-hij",
      "scheduledDate": "2026-02-15T14:00:00Z",
      "submittedAt": "2026-02-01T10:00:00Z",
      "createdAt": "2026-02-01T09:00:00Z",
      "manifest": { ... },
      "identity": { ... }
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Failed to fetch submissions

---

### 9. Get Submission by ID
**GET** `/api/audit/submission/:id`

Retrieve a specific audit submission by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "submission": {
    "id": "audit_404",
    "status": "submitted",
    "phoneVerified": true,
    "googleMeetLink": "https://meet.google.com/abc-defg-hij",
    "scheduledDate": "2026-02-15T14:00:00Z",
    "submittedAt": "2026-02-01T10:00:00Z",
    "manifest": {
      "id": "manifest_789",
      "loomUrl": "https://loom.com/share/...",
      "docsUrl": "https://docs.google.com/...",
      "files": [...]
    },
    "identity": {
      "id": "identity_101",
      "linkedinUrl": "https://linkedin.com/in/username",
      "businessEmail": "user@company.com",
      "whatsappNumber": "+1234567890"
    }
  }
}
```

**Error Responses:**
- `404` - Submission not found
- `401` - Unauthorized
- `500` - Failed to fetch submission

---

## Environment Variables Required

Add these to your `.env` file:

```env
# Google Cloud Storage
GCP_PROJECT_ID=your_gcp_project_id
GCP_BUCKET_NAME=dc3-audit-uploads
GCP_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

## Database Schema

The audit system uses the following Prisma models:
- `UploadedFile` - Stores uploaded file metadata
- `AuditManifest` - Links Loom/Docs URLs with uploaded files
- `AuditManifestFile` - Join table for manifest-file relationship
- `AuditIdentity` - Stores identity verification data
- `AuditSubmission` - Final audit submission record
- `OtpVerification` - OTP codes and verification status

## Rate Limiting

All endpoints are rate-limited to prevent abuse. Default limits apply.

## Example Complete Flow

```bash
# 1. Authenticate with Privy
curl -X POST https://api.dc3.com/api/auth/privy/authenticate \
  -H "Content-Type: application/json" \
  -d '{"accessToken": "privy-token"}'

# 2. Upload files
curl -X POST https://api.dc3.com/api/audit/upload \
  -H "Authorization: Bearer <token>" \
  -F "files=@document1.pdf" \
  -F "files=@document2.pdf"

# 3. Submit manifest
curl -X POST https://api.dc3.com/api/audit/manifest \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"loomUrl": "...", "docsUrl": "...", "fileIds": ["file_123"]}'

# 4. Submit identity
curl -X POST https://api.dc3.com/api/audit/identity \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"linkedinUrl": "...", "businessEmail": "...", "whatsappNumber": "..."}'

# 5. Send OTP
curl -X POST https://api.dc3.com/api/audit/otp/send \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890"}'

# 6. Verify OTP
curl -X POST https://api.dc3.com/api/audit/otp/verify \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+1234567890", "code": "123456"}'

# 7. Schedule meeting
curl -X POST https://api.dc3.com/api/audit/schedule \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-02-15", "time": "14:00", "timezone": "America/New_York", "duration": 60}'

# 8. Submit audit
curl -X POST https://api.dc3.com/api/audit/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"manifestId": "...", "identityId": "...", "meetingId": "...", "goals": {...}}'
```
