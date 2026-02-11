# Privy Integration Guide - Email, SMS & Google Auth (No Wallets)

## Overview
This guide shows how to integrate Privy.io for authentication **without requiring crypto wallets**. Privy handles email OTP, SMS verification, and Google OAuth seamlessly.

---

## Why Privy for Authentication?

### ✅ Benefits
1. **All-in-One Solution**: Email, SMS, and Google OAuth in one SDK
2. **No Wallet Required**: Can disable wallet features entirely
3. **Built-in OTP**: Handles email/SMS OTP generation and delivery
4. **Session Management**: JWT tokens and refresh tokens included
5. **SOC 2 Compliant**: Enterprise-grade security
6. **Easy Frontend Integration**: React hooks ready
7. **Progressive Enhancement**: Start with email/social, add wallets later if needed

### 💰 Pricing
- **Free tier**: Up to 1,000 monthly active users
- **Pro**: $99/month for 10,000 MAU
- No per-SMS or per-email charges (included in pricing)

---

## Setup Steps

### 1. Create Privy Account
1. Go to https://privy.io
2. Sign up for an account
3. Create a new app
4. Copy your **App ID** and **App Secret**

### 2. Configure Authentication Methods
In the Privy Dashboard:
1. Go to **Settings** → **Login Methods**
2. **Enable**:
   - ✅ Email
   - ✅ SMS
   - ✅ Google OAuth
3. **Disable**:
   - ❌ Wallet (MetaMask, Phantom, etc.)
   - ❌ Twitter/Discord (unless you want them)

### 3. Install Privy SDK

**Frontend (React/Next.js)**:
```bash
npm install @privy-io/react-auth
```

**Backend (Node.js)**:
```bash
npm install @privy-io/server-auth
```

---

## Frontend Integration

### 1. Configure Privy Provider

**File**: `app/layout.tsx` or `_app.tsx`

```tsx
'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
          config={{
            loginMethods: ['email', 'sms', 'google'],
            appearance: {
              theme: 'dark',
              accentColor: '#10b981', // Your brand color
              logo: 'https://yourapp.com/logo.png',
            },
            embeddedWallets: {
              createOnLogin: 'off', // DISABLE WALLETS
            },
          }}
        >
          {children}
        </PrivyProvider>
      </body>
    </html>
  );
}
```

### 2. Update ServiceBookingModal Authentication

**File**: `components/ServiceBookingModal.tsx`

Replace the authentication handlers:

```tsx
import { usePrivy } from '@privy-io/react-auth';

const ServiceBookingModal = ({ item, onClose }) => {
  const { login, authenticated, user, logout } = usePrivy();
  const [authMethod, setAuthMethod] = useState<'email' | 'sms' | 'google' | null>(null);

  // Handle authentication method selection
  const handleAuthMethodSelect = async (method: 'email' | 'sms' | 'google') => {
    setAuthMethod(method);
    setIsSyncing(true);

    try {
      await login({
        loginMethods: [method],
      });
      
      // User is now authenticated
      if (authenticated && user) {
        setWalletAddress(user.email?.address || user.phone?.number || user.google?.email);
        setCurrentStep('manifest_composition');
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      setErrors({ auth: 'Authentication failed. Please try again.' });
    } finally {
      setIsSyncing(false);
    }
  };

  // Check if already authenticated
  useEffect(() => {
    if (authenticated && user && currentStep === 'email_auth') {
      setWalletAddress(user.email?.address || user.phone?.number || user.google?.email);
      setCurrentStep('manifest_composition');
    }
  }, [authenticated, user]);

  return (
    // ... rest of modal
  );
};
```

### 3. Simplified UI (Privy handles modals)

```tsx
{currentStep === 'email_auth' && (
  <div className="min-h-full flex flex-col justify-center py-10 px-6">
    <div className="text-center space-y-6 mb-12">
      <h3 className="text-5xl font-black text-white uppercase">
        Authentication <span className="text-decensat">Gateway</span>
      </h3>
      <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em]">
        SELECT_AUTH_METHOD
      </p>
    </div>

    <div className="grid gap-4 max-w-2xl mx-auto w-full">
      {/* Email */}
      <button
        onClick={() => handleAuthMethodSelect('email')}
        className="p-7 bg-black border-2 border-white/10 rounded-[2rem] flex items-center gap-5 hover:border-decensat/40 transition-all"
      >
        <Mail size={32} className="text-decensat" />
        <div className="text-left">
          <div className="text-lg font-black text-white uppercase">Email</div>
          <div className="text-[9px] text-slate-500 uppercase">Magic link sign-in</div>
        </div>
      </button>

      {/* SMS */}
      <button
        onClick={() => handleAuthMethodSelect('sms')}
        className="p-7 bg-black border-2 border-white/10 rounded-[2rem] flex items-center gap-5 hover:border-decensat/40 transition-all"
      >
        <Smartphone size={32} className="text-decensat" />
        <div className="text-left">
          <div className="text-lg font-black text-white uppercase">SMS</div>
          <div className="text-[9px] text-slate-500 uppercase">Phone verification</div>
        </div>
      </button>

      {/* Google */}
      <button
        onClick={() => handleAuthMethodSelect('google')}
        className="p-7 bg-black border-2 border-white/10 rounded-[2rem] flex items-center gap-5 hover:border-decensat/40 transition-all"
      >
        <Chrome size={32} className="text-decensat" />
        <div className="text-left">
          <div className="text-lg font-black text-white uppercase">Google</div>
          <div className="text-[9px] text-slate-500 uppercase">OAuth sign-in</div>
        </div>
      </button>
    </div>
  </div>
)}
```

---

## Backend Integration

### 1. Verify Privy Tokens

**File**: `lib/auth.ts`

```typescript
import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

export async function verifyPrivyToken(authToken: string) {
  try {
    const verifiedClaims = await privy.verifyAuthToken(authToken);
    return {
      userId: verifiedClaims.userId,
      authenticated: true,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { userId: null, authenticated: false };
  }
}
```

### 2. Protect API Routes

**File**: `app/api/audit/manifest/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { verifyPrivyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const { userId, authenticated } = await verifyPrivyToken(token);

  if (!authenticated) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Process manifest submission
  const body = await req.json();
  // ... rest of logic

  return NextResponse.json({
    success: true,
    manifestId: 'manifest_123',
    userId,
  });
}
```

### 3. Get User Information

```typescript
import { privy } from '@/lib/privy-client';

export async function getUserInfo(userId: string) {
  const user = await privy.getUser(userId);
  
  return {
    id: user.id,
    email: user.email?.address,
    phone: user.phone?.number,
    google: user.google?.email,
    createdAt: user.createdAt,
  };
}
```

---

## Environment Variables

**File**: `.env.local`

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=clxxxxxxxxxx
PRIVY_APP_SECRET=your_secret_key_here
PRIVY_VERIFICATION_KEY=your_verification_key

# Other services (for audit flow)
WHATSAPP_API_KEY=your_twilio_key
GOOGLE_CALENDAR_API_KEY=your_calendar_key
```

---

## API Endpoints with Privy

### Authentication Flow

#### 1. User clicks "Email" button
```typescript
// Frontend automatically handles via Privy SDK
await login({ loginMethods: ['email'] });
```

Privy will:
1. Show email input modal
2. Send OTP to email
3. Verify OTP
4. Return authenticated user object
5. Generate JWT token

#### 2. Backend receives authenticated request
```http
POST /api/audit/manifest
Authorization: Bearer privy_token_here

{
  "loomUrl": "...",
  "docsUrl": "..."
}
```

Backend verifies:
```typescript
const { userId } = await privy.verifyAuthToken(token);
```

---

## User Object Structure

When user authenticates, you get:

```typescript
{
  id: "did:privy:clxxxxxxxxxxxx",
  createdAt: "2026-01-31T10:00:00.000Z",
  
  // Email login
  email: {
    address: "user@example.com",
    verified: true
  },
  
  // SMS login
  phone: {
    number: "+14155552671",
    verified: true
  },
  
  // Google OAuth
  google: {
    email: "user@gmail.com",
    name: "John Doe",
    subject: "1234567890",
    verifiedAt: "2026-01-31T10:00:00.000Z"
  },
  
  // Linked accounts (user can have multiple)
  linkedAccounts: [
    { type: "email", address: "user@example.com" },
    { type: "google_oauth", email: "user@gmail.com" }
  ]
}
```

---

## Customization Options

### 1. Custom Branding
```tsx
<PrivyProvider
  config={{
    appearance: {
      theme: 'dark',
      accentColor: '#10b981',
      logo: 'https://yourapp.com/logo.png',
      landingHeader: 'Welcome to Decensat',
      loginMessage: 'Sign in to start your audit',
    },
  }}
>
```

### 2. Custom Login Flow
```tsx
await login({
  loginMethods: ['email'],
  prefill: {
    email: 'user@example.com', // Pre-fill email
  },
});
```

### 3. Session Configuration
```tsx
<PrivyProvider
  config={{
    sessionConfig: {
      cookieLifetime: 3600, // 1 hour
      cookieName: 'privy-token',
    },
  }}
>
```

---

## Testing

### Test Email Login
1. Click "Email" button
2. Enter: `test@example.com`
3. Check console for OTP (dev mode)
4. Enter OTP code
5. Should see authenticated state

### Test SMS Login
1. Click "SMS" button
2. Enter: `+14155552671` (Twilio test number)
3. Check console for OTP
4. Verify authentication

### Test Google OAuth
1. Click "Google" button
2. OAuth popup appears
3. Select Google account
4. Redirects back authenticated

---

## Production Checklist

- [ ] Privy App ID configured
- [ ] Privy App Secret stored securely
- [ ] Login methods enabled (Email, SMS, Google)
- [ ] Wallet login disabled
- [ ] Custom branding applied
- [ ] Token verification working on backend
- [ ] Session management tested
- [ ] Error handling implemented
- [ ] Rate limiting on auth endpoints
- [ ] CORS configured correctly

---

## Advantages Over Custom Auth

| Feature | Custom Auth | Privy Auth |
|---------|-------------|------------|
| Email OTP | ❌ Need SendGrid/SES | ✅ Built-in |
| SMS OTP | ❌ Need Twilio | ✅ Built-in |
| Google OAuth | ❌ Manual setup | ✅ One click |
| Session Management | ❌ Custom JWT | ✅ Handled |
| Security Compliance | ❌ DIY | ✅ SOC 2 |
| Cost (1K users) | ~$50-100/mo | ✅ Free |
| Development Time | ~2-3 weeks | ✅ 1-2 days |

---

## Support & Documentation

- **Privy Docs**: https://docs.privy.io
- **React Hooks**: https://docs.privy.io/guide/react
- **Server Auth**: https://docs.privy.io/guide/server
- **Discord**: https://discord.gg/privy
