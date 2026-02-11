# 🚀 Start Audit Quick Reference

## Flow Trigger Points

Any of these buttons trigger the Start Audit flow:

1. **Hero Section** - "Start Audit" CTA in header (when not logged in)
2. **AI Solutions Cards** - "Start Audit" button on service cards  
3. **Learn More Modals** - "Start Audit" button in expanded details
4. **Navbar** - Login/Console button

## Steps at a Glance

| # | Step | Required Fields | Next Step |
|---|------|----------------|-----------|
| 1 | Confirmation | ☑ Handshake checkbox | Privy Auth |
| 2 | Privy Auth | Select any wallet | Manifest |
| 3 | Manifest | Loom URL + Docs URL | Auth Identity |
| 4 | Auth Identity | LinkedIn + Email + WhatsApp | OTP Verify |
| 5 | OTP Verify | 6-digit code | Google Meet |
| 6 | Google Meet | Date/Time | Success |
| 7 | Success | - | Close Modal |

## Component Props

```typescript
<ServiceBookingModal 
  item={{ 
    id: string,
    name: string,
    title?: string,
    price?: number,
    isByo?: boolean 
  }}
  onClose={() => void}
  initialStep?: BookingStep  // Default: 'confirmation'
/>
```

## Step IDs (BookingStep)

```typescript
type BookingStep = 
  | 'confirmation'
  | 'privy_auth'
  | 'manifest_composition'
  | 'auth_identity'
  | 'otp_verify'
  | 'google_meet'
  | 'phone_ident'    // Legacy BYO flow
  | 'checkout'        // Direct payment flow
  | 'scheduling'      // Generic scheduling
  | 'success'
```

## Data Structure

### Manifest Data
```typescript
{
  loomUrl: string,          // "https://loom.com/share/..."
  docsUrl: string,          // "https://figma.com/..."
  uploadedFiles: File[]     // Array of File objects
}
```

### Auth Identity Data
```typescript
{
  linkedinUrl: string,      // "https://linkedin.com/in/..."
  businessEmail: string,    // "user@company.com"
  whatsappNumber: string    // "+15555550000" (E.164)
}
```

## Key Functions

```typescript
// Navigate to next step
setCurrentStep('next_step_id')

// Handle file upload
const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  // Add to manifestData.uploadedFiles
}

// Validate and proceed
const handleManifestSubmit = async () => {
  // Validate loomUrl and docsUrl
  // Show errors or proceed to auth_identity
}

// OTP verification
const handleOtpVerify = async () => {
  // Verify 6-digit code
  // Proceed to google_meet
}
```

## Validation Rules

### Manifest Composition
- ✅ Loom URL: Required, non-empty
- ✅ Docs URL: Required, non-empty
- ⚠️ Files: Optional, max 25MB each

### Auth Identity
- ✅ LinkedIn: Required, non-empty
- ✅ Email: Required, valid email format
- ✅ WhatsApp: Required, valid E.164 format (+1234567890)

## File Upload Specs

- **Max Size**: 25MB per file
- **Formats**: .pdf, .doc, .docx, .txt, .md, .zip
- **Multiple**: Yes
- **Preview**: Shows name + size
- **Removal**: Click X button on each file

## Styling Guide

### Colors
- Primary: `bg-decensat` (#a3e635)
- Success: `text-green-500`
- Info: `text-blue-500`  
- Warning: `text-orange-500`
- Error: `text-rose-500`

### Typography
- Headers: `uppercase tracking-tighter italic`
- Labels: `text-[9px] font-black uppercase tracking-widest`
- Buttons: `text-[10px] uppercase tracking-[0.4em]`

### Spacing
- Modal padding: `p-6 sm:p-8`
- Input height: `py-4`
- Gap between fields: `gap-4 sm:gap-6`

## Common Tasks

### Skip to Specific Step
```typescript
<ServiceBookingModal 
  initialStep="manifest_composition"
  // ... other props
/>
```

### Handle Modal Close
```typescript
const [showModal, setShowModal] = useState(false);

<ServiceBookingModal 
  onClose={() => setShowModal(false)}
  // ... other props
/>
```

### Access Form Data
```typescript
// In ServiceBookingModal component
console.log(manifestData.loomUrl);
console.log(authIdentityData.whatsappNumber);
console.log(manifestData.uploadedFiles);
```

## Error Handling

### Display Errors
```typescript
setErrors({ 
  manifest: 'UPLINK_ERROR: Loom URL required.' 
});

// Clear errors
setErrors({});
```

### Error States
```typescript
{errors.manifest && (
  <p className="text-rose-500 text-[9px] uppercase">
    {errors.manifest}
  </p>
)}
```

## Loading States

```typescript
const [isSyncing, setIsSyncing] = useState(false);

// Show loading
setIsSyncing(true);
await someAsyncOperation();
setIsSyncing(false);

// In button
<button disabled={isSyncing}>
  {isSyncing ? <Loader2 className="animate-spin" /> : 'Submit'}
</button>
```

## Animations

All steps use:
- Entry: `animate-in slide-in-from-right-4 duration-500`
- Buttons: `active:scale-95 transition-all`
- Icons: `hover:animate-pulse`

## Responsive Breakpoints

- `xs`: 475px
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Modal Size

- Max width: `max-w-6xl` (Checkout/Main)
- Max width: `max-w-3xl` (Form steps)
- Max width: `max-w-md` (OTP)
- Height: `max-h-[100dvh] sm:max-h-[88vh]`

## Testing Hooks

For E2E testing, add these data attributes:

```tsx
data-testid="manifest-loom-input"
data-testid="manifest-docs-input"
data-testid="auth-linkedin-input"
data-testid="auth-email-input"
data-testid="auth-whatsapp-input"
data-testid="otp-digit-0"
data-testid="submit-manifest"
```

## Debug Mode

Add to component for debugging:
```typescript
useEffect(() => {
  console.log('Current Step:', currentStep);
  console.log('Manifest Data:', manifestData);
  console.log('Auth Data:', authIdentityData);
}, [currentStep, manifestData, authIdentityData]);
```

## Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| File not uploading | Check file size < 25MB and type is allowed |
| Phone validation fails | Ensure E.164 format with country code |
| Step won't advance | Check all required fields are filled |
| Modal won't close | Verify onClose prop is set |
| Styling broken | Check for CSS class conflicts |

## API Integration Points

```typescript
// 1. File Upload
POST /api/audit/manifest/upload
FormData: files[]

// 2. Send OTP
POST /api/audit/otp/send
{ phone: "+15555550000" }

// 3. Verify OTP
POST /api/audit/otp/verify
{ phone: "+15555550000", code: "123456" }

// 4. Schedule Meeting
POST /api/audit/meeting/schedule
{ 
  dateTime: "ISO-8601",
  manifestData: {...},
  authData: {...}
}
```

## Environment Variables Needed

```env
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

---

**Quick Start**: Click "Start Audit" → Check box → Select wallet → Fill forms → Verify OTP → Schedule meeting → Done! 🎉
