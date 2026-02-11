# Learn2LaunchPathway - Updated Flow Documentation

## New Multi-Step Authentication & Registration Flow

### Flow Overview

The Learn2LaunchPathway component has been completely restructured with a 6-step authentication and registration process:

```
EMAIL → IDENT → CLUSTERS → CONTACT → C3 → SUCCESS
```

---

## Step-by-Step Breakdown

### 1. **EMAIL** (Privy Authentication)
- **Purpose**: Authenticate user via Privy with email-only login
- **Fields**:
  - Email address input
- **Validation**:
  - Email format validation (RFC-compliant)
  - Privy authentication integration
- **Action**: 
  - Clicking "AUTHENTICATE_WITH_PRIVY" triggers Privy login modal
  - On successful authentication, user email is captured and form moves to IDENT step
  - `useEffect` listens for `user` changes from Privy hook and auto-advances

---

### 2. **IDENT** (Identity & Intent Signal)
- **Purpose**: Collect personal information and video proof of intent
- **Fields**:
  - Full Identity Handle (name)
  - Birth Date Signal (DOB)
  - Loom Video URL (must start with `https://loom.com/share/`)
  - Age attestation checkbox (18+ or within 9 months)
- **Validation**:
  - Name: Required, non-empty
  - DOB: Required, age eligibility check (17-29 range with 9-month buffer before 18th birthday)
  - Loom URL: Must start with `https://loom.com/share/` (not just any Loom format)
  - Checkbox: Must be checked
- **Actions**:
  - Back button returns to EMAIL step
  - "CONTINUE_TO_CLUSTERS" advances to next step after validation passes

---

### 3. **CLUSTERS** (Technical Focus Selection)
- **Purpose**: User selects technical/domain clusters they're interested in
- **Fields**:
  - Multi-select cluster buttons (from `MARKETING_CONFIG.L2L.ROLES`)
  - Display count of selected clusters
- **Validation**:
  - At least 1 cluster must be selected
- **Actions**:
  - Back button returns to IDENT step
  - "CONTINUE_TO_CONTACT" advances after selection validation
  - Selected clusters toggle visual state (green highlight with checkmark)

---

### 4. **CONTACT** (Communication Preference)
- **Purpose**: Collect one mandatory contact method (WhatsApp OR Telegram)
- **Fields**:
  - WhatsApp Number (E.164 format, e.g., +1 555 000 0000)
  - Telegram Handle (username without @ symbol)
- **Validation**:
  - At least ONE of WhatsApp or Telegram is required
  - WhatsApp: Must start with '+' and be minimum 10 characters
  - Telegram: Must NOT include '@' symbol
- **Actions**:
  - Back button returns to CLUSTERS step
  - "INITIATE_C3" advances after contact validation passes

---

### 5. **C3** (Integration Pending)
- **Purpose**: Placeholder for C3 ecosystem integration
- **Status**: Under development
- **Display**:
  - Loading animation with "Connecting to C3 Network" message
  - User data has been securely registered message
  - "RESTART_PROTOCOL" button to return to EMAIL step
- **Note**: This page is currently a holding pattern. Backend integration for C3 is pending

---

## Validation Rules Summary

| Field | Type | Required | Rule |
|-------|------|----------|------|
| Email | Text | ✓ | RFC-compliant email format |
| Name | Text | ✓ | Non-empty |
| DOB | Date | ✓ | Age 17-29 (with 9-month buffer before 18) |
| Loom URL | URL | ✓ | Must start with `https://loom.com/share/` |
| Age Attestation | Checkbox | ✓ | Must be checked |
| Clusters | Multi-select | ✓ | At least 1 selected |
| WhatsApp | Phone | (OR) | E.164 format, 10+ chars, starts with '+' |
| Telegram | Text | (OR) | Username without '@' |

---

## Key Implementation Details

### Privy Integration
- Uses `usePrivy()` hook from `@privy-io/react-auth`
- `login()` function opens Privy modal
- `user` object populated after successful authentication
- `useEffect` hook monitors user state changes and auto-advances to IDENT
- Email auto-populated from Privy `user.email.address`

### State Management
```typescript
const [formStep, setFormStep] = useState<'EMAIL' | 'IDENT' | 'CLUSTERS' | 'CONTACT' | 'C3' | 'SUCCESS'>('EMAIL');
const [formData, setFormData] = useState({
  email: '',
  name: '',
  dob: '',
  loomUrl: '',
  selectedClusters: [] as string[],
  whatsappNumber: '',
  telegramHandle: '',
  isAdult: false,
});
```

### Helper Functions
- `isValidLoom(url)`: Checks if URL starts with `https://loom.com/share/`
- `checkEligibility(dob)`: Validates age requirements (17-29 with 9-month buffer)
- `handlePrivyLogin()`: Initiates Privy authentication modal
- `toggleCluster(cluster)`: Toggle cluster selection on/off
- `handleNextToClusters()`: Validates IDENT fields before advancing
- `handleNextToContact()`: Validates CLUSTERS selection before advancing
- `handleNextToC3()`: Validates CONTACT fields before advancing

---

## UX Features

### Visual Feedback
- Form errors displayed in red banner with alert icon
- Selected clusters highlighted in decensat color with checkmark
- Loading states with spinner during Privy authentication
- Step indicators in left sidebar showing current flow progress
- Smooth animations between form steps (fade-in, slide-in effects)

### Navigation
- Back buttons on every step except EMAIL
- Forward buttons disabled until validation passes
- Error messages prevent advance to next step
- Responsive design for mobile (sm, xs breakpoints)

---

## Error Messages

The component uses specific error codes for validation failures:

| Error | Scenario |
|-------|----------|
| `[!] EMAIL_REQUIRED` | Email field empty on initial form |
| `[!] VALIDATION_ERROR: INVALID_EMAIL_FORMAT` | Email doesn't match RFC pattern |
| `[!] AUTHENTICATION_ERROR` | Privy login fails |
| `[!] MANDATORY_FIELD_MISSING` | Name, DOB, or age checkbox missing |
| `[!] MANDATORY_REQUIREMENT: Loom video URL is MISSING` | Loom URL field empty |
| `[!] MANDATORY_REQUIREMENT: Loom video URL INVALID` | URL doesn't start with `https://loom.com/share/` |
| `[!] SIGNAL_REJECTED: Age exceeds 30-year eligibility` | User over 30 |
| `[!] SIGNAL_REJECTED: Temporal gap exceeds 9-month threshold` | User too young (not yet 9 months before 18) |
| `[!] SELECT_AT_LEAST_ONE_CLUSTER` | No clusters selected |
| `[!] CONTACT_REQUIRED` | Neither WhatsApp nor Telegram provided |
| `[!] INVALID_PHONE` | WhatsApp number < 10 chars |
| `[!] TELEGRAM_FORMAT_ERROR` | Telegram handle includes '@' symbol |

---

## Technical Dependencies

- **React**: 18+
- **TypeScript**: For type safety
- **Lucide React**: Icon library
- **@privy-io/react-auth**: Email authentication
- **Tailwind CSS**: Styling
- **MARKETING_CONFIG**: Configuration file with L2L phases and roles

---

## Next Steps (Backend Work Needed)

1. **C3 Page Integration**: Create actual C3 page component and route
2. **Contact Verification**: Implement WhatsApp/Telegram verification (SMS OTP or webhook)
3. **Email Notifications**: Send confirmation emails when users complete flow
4. **Data Storage**: Store registration data in database
5. **Account Creation**: Create user accounts after C3 page completion
6. **Session Management**: Link registration flow to user session

---

## File Modified
- `components/Learn2LaunchPathway.tsx` - Complete rewrite with new 6-step flow
