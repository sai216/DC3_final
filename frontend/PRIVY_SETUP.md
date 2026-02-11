# Privy Authentication Integration Guide

## Setup Steps

### 1. Create a Privy Account
- Go to [Privy Dashboard](https://dashboard.privy.io/)
- Sign up for a free account
- Create a new application

### 2. Get Your App ID
- In the Privy dashboard, find your Application ID (looks like `clxxxxxxxxxxxx`)
- Copy this ID

### 3. Configure Environment Variables
- Copy `.env.local.example` to `.env.local`
- Replace `YOUR_PRIVY_APP_ID_HERE` with your actual Privy App ID:
  ```
  NEXT_PUBLIC_PRIVY_APP_ID=clxxxxxxxxxxxx
  ```

### 4. Install Dependencies
```bash
npm install @privy-io/react-auth
```

### 5. Test Authentication
- Start your dev server: `npm run dev`
- Click "Start Audit" button or user avatar
- The Privy login modal should appear
- Authenticate using your preferred method (email, SMS, wallet, etc.)

## Files Created/Modified

### New Files:
- `core/privy.config.ts` - Privy configuration
- `app/PrivyProvider.tsx` - Privy provider wrapper
- `.env.local.example` - Environment variables template

### Modified Files:
- `app/ClientBoundary.tsx` - Added PrivyProvider
- `app/page.tsx` - Integrated Privy authentication

## Features Enabled

✅ Email authentication
✅ Phone (SMS) authentication  
✅ Wallet connection
✅ Google OAuth integration
✅ User profile sync with local state
✅ Dark theme matching your design
✅ Decensat brand color integration

## Customization

Edit `core/privy.config.ts` to customize:
- Login methods available
- Theme and appearance
- Embedded wallet settings
- Redirect URLs (when needed)

## Next Steps

1. Install the dependency: `npm install @privy-io/react-auth`
2. Create `.env.local` with your Privy App ID
3. Test the login flow
4. (Optional) Add additional Privy features like embedded wallets for Web3
