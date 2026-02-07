# DC3 Authentication System

A robust two-phase authentication system built with TypeScript, Express, and Prisma.

## 🌟 Features

### Authentication Flow
- **Phase 1**: Email OTP verification (validates business email)
- **Phase 2**: Phone/WhatsApp OTP verification (completes authentication)

### Quote Generation System
- **Automated Pricing**: Based on project type, complexity, and urgency
- **"Not to Exceed" Guarantee**: 15% buffer for client peace of mind
- **Milestone Payments**: 30-30-20-20 payment structure
- **30-Day Validity**: Quotes expire after 30 days

### Strategy Call Booking
- **Google Calendar Integration**: Automatic event creation
- **Google Meet Links**: Auto-generated video conference links
- **Email Notifications**: Automated invitations and reminders
- **Smart Scheduling**: Available slots based on business hours

### Security Features
- ✅ JWT-based authentication
- ✅ Rate limiting (prevents brute force)
- ✅ OTP expiration (10 minutes)
- ✅ Single-use OTPs
- ✅ Progressive authentication stages
- ✅ Audit logging
- ✅ Input validation
- ✅ Secure password hashing ready

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Email**: SendGrid / Nodemailer
- **SMS/WhatsApp**: Twilio
- **Security**: Helmet, Rate Limiting

## 📁 Project Structure

```
dc3/
├── config/
│   └── database.ts              # Prisma client singleton
├── controllers/
│   ├── authController.ts        # Authentication logic
│   ├── quoteController.ts       # Quote generation logic
│   └── calendarController.ts    # Strategy call booking
├── middleware/
│   ├── authMiddleware.ts        # JWT verification
│   ├── rateLimiter.ts           # Rate limiting config
│   └── validator.ts             # Input validation
├── prisma/
│   └── schema.prisma            # Database schema
├── routes/
│   ├── authRoutes.ts            # Auth endpoints
│   ├── quoteRoutes.ts           # Quote endpoints
│   ├── otpService.ts            # OTP sending (email/SMS)
│   └── googleCalendarService.ts # Google Calendar API
├── services/
│   └── otpService.ts            # OTP sending (email/SMS)
├── server.ts                     # Main server file
├── QUOTES_CALENDAR_API.md        # Quotes & Calendar API docs
├── AUTH_API.md                   # API documentation
├── SETUP.md                      # Setup instructions
├── postman_collection.json       # Postman collection
└── test-api.sh                   # API test script
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

**Required Environment Variables:**

### Server Configuration
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 8000)
- `FRONTEND_URL` - Frontend application URL (e.g., https://decensatdesign.com)

### Database
- `DATABASE_URL` - PostgreSQL connection string (format: postgresql://user:password@host:port/database)

### JWT Authentication
- `JWT_SECRET` - Secure random string (minimum 32 characters)
- `JWT_EXPIRES_IN` - Token expiration time (default: 7d)

### Email Service (SendGrid/SMTP)
- `SENDGRID_API_KEY` - SendGrid API key for sending emails
- `FROM_EMAIL` - Sender email address (e.g., noreply@decensatdesign.com)
- `FROM_NAME` - Sender display name (default: Decensat Design)
- `EMAIL_USER` - SMTP username (if not using SendGrid)
- `EMAIL_PASSWORD` - SMTP password (if not using SendGrid)

### SMS/WhatsApp Service (Twilio)
- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Twilio Auth Token
- `TWILIO_WHATSAPP_FROM` - Twilio WhatsApp number (format: whatsapp:+14155238886)
- `TWILIO_PHONE_FROM` - Twilio SMS phone number (format: +1234567890)

### Google Calendar Integration
- `GOOGLE_CLIENT_ID` - Google OAuth2 Client ID (from Google Cloud Console)
- `GOOGLE_CLIENT_SECRET` - Google OAuth2 Client Secret
- `GOOGLE_REDIRECT_URI` - OAuth callback URL (e.g., http://localhost:8000/api/calendar/oauth/callback)
- `GOOGLE_CALENDAR_ID` - Google Calendar ID for booking calls (e.g., dev@decensatdesign.com or primary)
- `STRATEGY_CALL_DURATION_MIN` - Default call duration in minutes (default: 60)

### Quote Engine (Optional)
- `BASE_RATE_CREATIVE` - Base rate for creative projects (default: 5000)
- `BASE_RATE_FULLSTACK` - Base rate for full-stack projects (default: 8000)
- `BASE_RATE_WEB3` - Base rate for Web3 projects (default: 12000)
- `BASE_RATE_AI_AUTOMATION` - Base rate for AI/automation projects (default: 10000)
- `COMPLEXITY_MULTIPLIER_HIGH` - Multiplier for high complexity (default: 1.5)
- `TIMELINE_URGENCY_MULTIPLIER` - Multiplier for urgent timeline (default: 1.3)

**Setting Up Google Calendar OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen (add calendar scopes)
6. Create OAuth 2.0 Client ID (Web application)
7. Add authorized redirect URIs (e.g., http://localhost:8000/api/calendar/oauth/callback)
8. Copy Client ID and Client Secret to your `.env` file

### 3. Generate Prisma Client
```bash
npm run prisma:generate
```

### 4. Run Database Migrations
```bash
npm run prisma:migrate
```

### 5. Start the Server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server will start on `http://localhost:8000`

## 📚 API Endpoints

### Authentication (Phase 1 & 2)
- `POST /api/auth/email/send-otp` - Send email OTP
- `POST /api/auth/email/verify-otp` - Verify email OTP
- `POST /api/auth/phone/send-otp` - Send phone/WhatsApp OTP
- `POST /api/auth/phone/verify-otp` - Verify phone OTP
- `GET /api/auth/session` - Get current session
- `POST /api/auth/logout` - Logout

### Project Quotes
- `POST /api/quotes/generate/:projectId` - Generate quote
- `GET /api/quotes/:quoteId` - Get quote details
- `GET /api/quotes` - Get all user quotes
- `POST /api/quotes/:quoteId/accept` - Accept quote
- `POST /api/quotes/:quoteId/decline` - Decline quote

### Strategy Call Booking
- `GET /api/calendar/available-slots` - Get available time slots
- `POST /api/calendar/book` - Book strategy call
- `GET /api/calendar/my-calls` - Get user's calls
- `GET /api/calendar/call/:callId` - Get call details
- `DELETE /api/calendar/:callId` - Cancel strategy call

## 🧪 Testing

### Using the Test Script
```bash
# Make sure server is running first
./test-api.sh
```

### Using Postman
1. Import `postman_collection.json`
2. Set variables: `baseUrl`, `email`, `phoneNumber`
3. Run requests in order

### Using cURL
```bash
# Send email OTP
curl -X POST http://localhost:8000/api/auth/email/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Verify email OTP
curl -X POST http://localhost:8000/api/auth/email/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otpCode":"123456"}'
```

## 🔒 Security Best Practices

1. **JWT Secret**: Use a strong, random secret (minimum 32 characters)
2. **Environment Variables**: Never commit `.env` file
3. **Rate Limiting**: Configured for OTP and auth endpoints
4. **OTP Expiration**: OTPs expire after 10 minutes
5. **HTTPS**: Always use HTTPS in production
6. **Database**: Use connection pooling and prepared statements (Prisma handles this)

## 🗄️ Database Schema

### Users Table
- Email verification
- Phone verification
- WhatsApp verification
- Auth stage tracking (0, 1, 2)
- Business name
- Last login timestamp

### OTP Verifications Table
- OTP code (6 digits)
- Type (email, phone, whatsapp)
- Destination (email or phone)
- Expiration timestamp
- Verification status

### Audit Logs Table
- User actions
- IP addresses
- User agents
- Request/response data

## 🛠️ Development Commands

```bash
# Start development server with watch mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# TypeScript type checking
npx tsc --noEmit
```

## 📦 NPM Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🤝 Authentication Flow Example

```
1. User enters email → POST /api/auth/email/send-otp
2. User receives OTP via email (6-digit code)
3. User enters OTP → POST /api/auth/email/verify-otp
4. Server returns JWT token (auth stage 1)
5. User enters phone → POST /api/auth/phone/send-otp (with token)
6. User receives OTP via SMS/WhatsApp
7. User enters phone OTP → POST /api/auth/phone/verify-otp (with token)
8. Server returns new JWT token (auth stage 2)
9. User is fully authenticated! 🎉
```

## 🔧 Troubleshooting

### Common Issues

1. **Prisma Client not found**
   ```bash
   npm run prisma:generate
   ```

2. **Database connection error**
   - Check `DATABASE_URL` in `.env`
   - Ensure PostgreSQL is running
   - Verify credentials

3. **Email OTP not sending**
   - Verify `SENDGRID_API_KEY`
   - Check SendGrid dashboard
   - Ensure sender email is verified

4. **SMS/WhatsApp not working**
   - Verify Twilio credentials
   - Check Twilio console
   - Ensure account is funded
   - Verify phone format (E.164)

