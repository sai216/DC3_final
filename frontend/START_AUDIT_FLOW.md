# Start Audit Flow - Complete Implementation

## Overview
When users click "Start Audit" anywhere in the application, they now go through a comprehensive onboarding process designed to authenticate, gather project requirements, verify identity, and schedule a strategy session.

## Flow Stages

### 1. **Confirmation** (`confirmation`)
- User acknowledges the settlement protocol
- Must check the handshake confirmation box
- Proceeds to Privy Authentication

### 2. **Privy Authentication** (`privy_auth`)
- **Title**: Privy Mesh_Sync
- User selects their DeFi wallet provider:
  - Phantom
  - Coinbase Wallet
  - MetaMask
  - Rainbow
  - Trust Wallet
  - Uniswap Wallet
- Simulates wallet connection via Privy.io SDK
- Sets wallet address upon connection
- **Next Step**: Manifest Composition

### 3. **Manifest Composition** (`manifest_composition`)
- **Title**: Manifest Composition
- **Subtitle**: "Define project requirements and technical artifacts"

#### Fields:
1. **Loom Signal** (Required)
   - Input field for Loom video URL
   - Placeholder: `loom.com/share/...`

2. **Docs Sync** (Required)
   - Input field for documentation links
   - Placeholder: `Figma / Docs / Notion...`
   - Accepts any documentation platform URL

3. **Ingestion Rail** (File Upload)
   - Multi-file upload system
   - Accepts: PDF, DOC, DOCX, TXT, MD, ZIP
   - Max file size: 25MB per file
   - Shows uploaded files with:
     - File name
     - File size in KB
     - Remove button (X icon)
   - Interactive drag & drop zone

**Validation**: Loom URL and Docs URL are required
**Next Step**: Auth Identity

### 4. **Auth Identity** (`auth_identity`)
- **Title**: Auth Identity
- **Subtitle**: "Establish secure communication rail"

#### Fields:
1. **LinkedIn URL** (Required)
   - Professional profile link
   - Icon: Blue LinkedIn icon
   - Placeholder: `linkedin.com/in/...`

2. **Business Email** (Required)
   - Professional email address
   - Icon: Green email icon
   - Placeholder: `uplink@node.io`

3. **WhatsApp Number** (Required)
   - Phone number for verification
   - Icon: Green WhatsApp/Phone icon
   - Placeholder: `+1 (555) 000-0000`
   - Auto-formats to E.164 standard

**Validation**: 
- All fields required
- WhatsApp number must be valid E.164 format
- Phone number is saved for OTP verification

**Next Step**: OTP Verification

### 5. **WhatsApp OTP Verification** (`otp_verify`)
- **Title**: WhatsApp Verification
- **Visual**: Green WhatsApp-branded icon (Smartphone)
- Shows the phone number being verified
- 6-digit OTP input
- Auto-focuses next digit on input
- **Subtitle**: "Enter the 6-digit code sent to {phone}"

**Next Step**: Google Meet Scheduling

### 6. **Google Meet Scheduling** (`google_meet`)
- **Title**: Schedule Google Meet
- **Visual**: Blue video camera icon
- **Subtitle**: "Select your preferred time for our strategy sync"

#### Features:
- Date/time picker for appointment
- Note: "We'll send you a Google Meet link 30 minutes before your scheduled time"
- Confirmation button: "CONFIRM_STRATEGY_SYNC"

**Next Step**: Success

### 7. **Success** (`success`)
- **Visual**: Large green checkmark with animation
- **Title**: "Node alignment Established."
- Confirmation message
- Button to close: "ENTER_CONTROL_MESH"

## User Journey Map

```
Start Audit Click
    ↓
Confirmation (Handshake)
    ↓
Privy Auth (Select Wallet)
    ↓
Manifest Composition
  - Loom URL ✓
  - Docs URL ✓
  - Upload Files (optional)
    ↓
Auth Identity
  - LinkedIn ✓
  - Business Email ✓
  - WhatsApp Number ✓
    ↓
WhatsApp OTP Verification
  - 6-digit code
    ↓
Google Meet Scheduling
  - Pick date/time
    ↓
Success!
```

## Technical Details

### File Upload Implementation
- Uses HTML5 file input with `multiple` attribute
- Hidden input triggered by styled label
- Validates file size (25MB max)
- Stores files in state as `File[]` array
- Real-time file list display with removal capability

### Form Validation
- Manifest: Requires Loom URL and Docs URL
- Auth Identity: All three fields required + E.164 phone validation
- Progressive disclosure: Errors shown inline

### State Management
```typescript
manifestData: {
  loomUrl: string,
  docsUrl: string,
  uploadedFiles: File[]
}

authIdentityData: {
  linkedinUrl: string,
  businessEmail: string,
  whatsappNumber: string
}
```

### Phone Number Handling
- Auto-formats using `normalizePhone()` utility
- Validates E.164 format with `isValidE164()`
- Transfers to OTP verification step
- Displays formatted number in verification screen

## Where "Start Audit" Appears

1. **AiSolutionsSection.tsx** - "Start Audit" button in service cards
2. **app/page.tsx** - Header CTA button (when not logged in)
3. **Navbar.tsx** - Login/Console button
4. Learn more modals in AI Solutions section

## Design Language

### Colors
- Primary: `decensat` (#a3e635 - lime green)
- Success: Green-500 (WhatsApp theme)
- Info: Blue-500 (LinkedIn, Google Meet)
- Error: Rose-500

### Typography
- Headers: Black, uppercase, italic accent on key words
- Labels: Tiny (8-10px), black weight, uppercase, wide tracking
- Inputs: Mono font, white text on black background
- Icons: Contextual colors (blue for LinkedIn, green for WhatsApp)

### Animations
- Slide-in-from-right on step transitions
- Fade-in effects
- Scale transforms on button interactions
- Pulse effects on loading states

## Integration Points

### Privy.io SDK
- Wallet connection simulation ready
- Replace `handlePrivyConnect` with actual Privy SDK calls
- Wallet address storage in state

### Backend Requirements
- File upload endpoint for ingestion rail
- OTP generation and validation for WhatsApp
- Google Meet calendar integration
- User profile creation with collected data

## Security Considerations
- E.164 phone validation prevents invalid numbers
- File size limits prevent DoS attacks
- File type restrictions enhance security
- All sensitive data should be encrypted in transit

## Future Enhancements
- Actual Privy.io integration
- Real WhatsApp OTP via Twilio/similar
- Google Calendar API integration
- File upload to secure cloud storage
- Email confirmation flow
- LinkedIn profile verification
