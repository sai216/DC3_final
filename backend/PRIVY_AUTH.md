# Privy Authentication Integration

This backend now uses **Privy** for authentication instead of email/phone OTP verification.

## Setup

### Environment Variables

Add the following to your `.env` file:

```env
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
```

Get these credentials from your [Privy Dashboard](https://console.privy.io/).

## Authentication Flow

### 1. User Authentication with Privy

**Endpoint:** `POST /api/auth/privy/authenticate`

**Request Body:**
```json
{
  "accessToken": "privy_access_token_from_frontend"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authenticated successfully",
  "token": "jwt_token_for_subsequent_requests",
  "user": {
    "id": "user_uuid",
    "email": "user@example.com",
    "walletAddress": "0x...",
    "privyUserId": "did:privy:...",
    "businessName": null,
    "authStage": 2,
    "emailVerified": true
  }
}
```

**How it works:**
1. Frontend authenticates user with Privy and obtains an access token
2. Frontend sends the Privy access token to this endpoint
3. Backend verifies the token with Privy
4. Backend creates or updates the user in the database
5. Backend returns a JWT token for subsequent API requests

### 2. Using Protected Endpoints

Once authenticated, include the JWT token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```

The middleware now supports both:
- JWT tokens issued by our backend
- Privy access tokens (direct from Privy)

## Database Schema

The User model now includes Privy-specific fields:

```prisma
model User {
  id               String    @id @default(uuid())
  email            String?   @unique           // Optional - can be null
  emailVerified    Boolean   @default(false)
  walletAddress    String?   @unique           // NEW: Ethereum wallet address
  privyUserId      String?   @unique           // NEW: Privy user DID
  phoneE164        String?
  phoneVerified    Boolean   @default(false)
  whatsappVerified Boolean   @default(false)
  businessName     String?
  authStage        Int       @default(0)
  // ... other fields
}
```

## Migration Notes

### Deprecated OTP Routes

The following routes are now commented out and deprecated:
- `POST /api/auth/email/send-otp`
- `POST /api/auth/email/verify-otp`
- `POST /api/auth/phone/send-otp`
- `POST /api/auth/phone/verify-otp`

These can be found in the auth controller with `[DEPRECATED]` tags and wrapped in comments.

### Active Routes

- ✅ `POST /api/auth/privy/authenticate` - Authenticate with Privy
- ✅ `GET /api/auth/session` - Get current user session
- ✅ `POST /api/auth/logout` - Logout

## Frontend Integration

Your frontend should:

1. Install the Privy React SDK:
   ```bash
   npm install @privy-io/react-auth
   ```

2. Wrap your app with PrivyProvider:
   ```tsx
   import { PrivyProvider } from '@privy-io/react-auth';
   
   <PrivyProvider appId="your_privy_app_id">
     <App />
   </PrivyProvider>
   ```

3. Use Privy authentication hooks:
   ```tsx
   import { usePrivy } from '@privy-io/react-auth';
   
   const { login, authenticated, user, getAccessToken } = usePrivy();
   
   // After user logs in with Privy
   if (authenticated) {
     const accessToken = await getAccessToken();
     
     // Send to your backend
     const response = await fetch('/api/auth/privy/authenticate', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ accessToken })
     });
     
     const { token } = await response.json();
     // Store token and use for subsequent requests
   }
   ```

## Security Notes

- Privy handles all authentication security (wallet signatures, email verification, etc.)
- Our backend verifies Privy tokens before creating sessions
- JWT tokens are still used for subsequent API requests for performance
- Both Privy tokens and JWT tokens are accepted by the middleware

## Benefits of Privy

- ✅ **Web3 Native:** Supports wallet authentication (MetaMask, WalletConnect, etc.)
- ✅ **Social Logins:** Google, Twitter, Discord, Apple, etc.
- ✅ **Email/SMS:** Built-in OTP verification
- ✅ **Embedded Wallets:** Users don't need existing wallets
- ✅ **Multi-chain:** Supports Ethereum, Polygon, Solana, etc.
- ✅ **Production Ready:** Battle-tested authentication infrastructure
