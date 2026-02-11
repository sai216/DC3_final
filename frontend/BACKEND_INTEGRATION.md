# Backend Integration Architecture

## Current Backend Connection Overview

This is a **Next.js full-stack application** with integration to several external services. Here's how the backend is connected:

### 1. **Frontend Framework**
- **Framework**: Next.js 15.1.0 (App Router)
- **Runtime**: Node.js
- **Dev Server**: `npm run dev` → http://localhost:3000
- **Build Process**: `next build` → Production bundle

### 2. **External Services Connected**

#### A. **Google Gemini AI API**
**File**: [services/geminiService.ts](services/geminiService.ts)

```typescript
// Uses @google/genai library
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-3-pro-preview';
```

**Endpoints**:
- `generateSuraResponseStream()` - Stream AI responses with Google Search grounding
- `analyzeTalentLoomAudit()` - Talent audit analysis with JSON output
- `generateSeoMetadata()` - SEO metadata generation

**Features**:
- Streaming responses with chunking
- Grounding with Google Search
- Extended thinking (2000-4000 token budgets)
- JSON-based responses

#### B. **Privy.io Authentication**
**File**: [core/privy.config.ts](core/privy.config.ts) & [app/PrivyProvider.tsx](app/PrivyProvider.tsx)

**Configuration**:
```typescript
NEXT_PUBLIC_PRIVY_APP_ID: cm0zu993e00ir12dh2hh0bpz2s
NEXT_PUBLIC_APP_URL: http://localhost:3000
```

**Wallet Integration**:
- Phantom
- Coinbase
- MetaMask
- Rainbow
- Trust Wallet
- Uniswap

**Features**:
- Web3 wallet authentication
- USDC settlement support
- Privy mesh sync protocol

#### C. **Learn2Launch Service (L2L)**
**File**: [services/l2lService.ts](services/l2lService.ts)

**Components**:
- Talent audit qualification system
- Commerce tier management (Tier 1-3)
- Learning tier validation (Tier 1-5)
- Team validation protocols
- Provider validation rules

### 3. **Environment Variables**
**File**: [.env](.env)

```env
# Privy Auth
NEXT_PUBLIC_PRIVY_APP_ID=cm0zu993e00ir12dh2hh0bpz2s

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Gemini (not shown in .env, add to .env.local)
API_KEY=<your-google-genai-api-key>
NEXT_PUBLIC_GEMINI_API_KEY=<same-key>
```

### 4. **API Data Flow**

```
Frontend (React Components)
        ↓
Next.js Server Functions / Route Handlers
        ↓
External APIs
├── Google Gemini AI (generateContentStream)
├── Privy.io (Web3 Auth)
├── Google Search (Grounding)
└── Other Integrations
```

### 5. **Key Service Methods**

#### Gemini Service
```typescript
// AI Response Streaming
generateSuraResponseStream(messages, onChunk, contextType)
  → Uses: gemini-3-pro-preview
  → Returns: { text, sources }

// Talent Audit Analysis
analyzeTalentLoomAudit(applicantData)
  → Analyzes Learn2Launch applicants
  → Returns: JSON with decision (APPROVE/DEFER/REJECT)

// SEO Generation
generateSeoMetadata(heroContent, feedContent)
  → Generates optimized meta tags
  → Returns: { title, description }
```

#### L2L Service
```typescript
// Validation Rules
validateProviderForLearning(provider)
  → Checks phase & age requirements

validateCommerceRequirements(provider)
  → Validates Web3 experience requirements

validateTeam(team)
  → Enforces cluster composition rules
```

### 6. **Missing Backend Components**

Currently, there is **NO dedicated backend server** for:
- User authentication persistence
- Project storage/database
- Payment processing (Stripe/USDC transactions)
- Email sending
- File uploads/storage
- Booking calendar integration
- Google Meet scheduling

### 7. **Recommended Next Steps**

To fully implement backend connectivity, you'll need:

#### Option A: **Next.js API Routes** (Recommended for this stack)
```
app/api/
├── auth/
│   ├── privy/route.ts
│   └── verify/route.ts
├── bookings/
│   ├── schedule/route.ts
│   └── list/route.ts
├── projects/
│   ├── create/route.ts
│   ├── [id]/route.ts
│   └── audit/route.ts
├── users/
│   ├── profile/route.ts
│   └── identity/route.ts
└── webhooks/
    └── privy/route.ts
```

#### Option B: **Separate Node.js Backend**
- Express.js / Fastify server
- PostgreSQL/MongoDB database
- Dedicated API endpoints

### 8. **Current Integration Points in UI**

The ServiceBookingModal flow integrates with:
1. **Privy Authentication** → Wallet connection
2. **Manifest Composition** → Loom + Docs (stored locally, needs backend)
3. **Auth Identity** → LinkedIn + Email + WhatsApp (needs storage)
4. **Google Meet** → Needs backend to integrate with Google Calendar API
5. **Success** → Should trigger email/notification backend

### 9. **Database Schema Recommendation**

```typescript
// Projects
{
  id: string
  userId: string
  title: string
  loomUrl: string
  docsUrl: string
  nodeRegistry?: File
  status: 'draft' | 'submitted' | 'auditing' | 'completed'
  createdAt: Date
}

// User Profiles
{
  id: string
  privyDid: string
  email: string
  linkedinUrl: string
  whatsappNumber: string
  walletAddress: string
  createdAt: Date
}

// Bookings
{
  id: string
  userId: string
  projectId: string
  scheduledTime: Date
  meetLink: string
  status: 'pending' | 'confirmed' | 'completed'
  createdAt: Date
}
```

### 10. **Development Checklist**

- [ ] Set up Next.js API routes
- [ ] Connect database (PostgreSQL recommended)
- [ ] Implement Privy webhook for auth state
- [ ] Add email service (SendGrid/Resend)
- [ ] Integrate Google Calendar API
- [ ] Add file storage (S3/Cloudinary)
- [ ] Implement booking confirmation flow
- [ ] Add payment processing (Stripe/USDC)
- [ ] Create admin dashboard for bookings
- [ ] Set up environment variables for production

---

## Quick Start for Adding Backend

### Step 1: Create API Route
```bash
mkdir -p app/api/bookings
touch app/api/bookings/route.ts
```

### Step 2: Add Environment Variables
```env
DATABASE_URL=postgresql://user:password@localhost:5432/decensat
STRIPE_API_KEY=sk_...
SENDGRID_API_KEY=SG...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

### Step 3: Connect to Database
```typescript
// lib/db.ts
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
```

### Step 4: Implement API Handler
```typescript
// app/api/bookings/route.ts
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const data = await req.json();
  const booking = await prisma.booking.create({ data });
  return Response.json(booking);
}
```

---

**Status**: Frontend infrastructure ready, backend integration pending
