export enum TrackType {
  Commerce = 'commerce',
  Learning = 'learning'
}

export enum Discipline {
  Web3Dev = 'web3_developer',
  FullstackDev = 'fullstack_developer',
  UiUx = 'ui_ux_designer',
  Architect = 'credentialed_architect'
}

// RBAC & Session Context (OpenAPI v1.1)
export type Role = 'user' | 'admin' | 'ops' | 'finance';

export enum AuthStage {
  Anonymous = 0,
  IdentityVerified = 1, // Phone OTP + Business Email verified
  PrivyHandshakeComplete = 2, // JWT Linked via Privy.io (Returning Account)
  ActiveQuoting = 3, // In negotiation/assessment
  ProjectEngaged = 4, // Formal Relationship Consummated - UNLOCKS C3
  CDP = 5 // Complete, Delivered & Paid
}

export type KycStatus = 'idle' | 'pending' | 'verified' | 'rejected';

export type SettlementRail = 'crypto_wallet' | 'usdc_solana' | 'usdc_base' | 'usdc_eth' | 'stripe';

export interface UserProfile {
  userId: string;
  email: string;
  businessDomain: string;
  srt: number;
  nodes: number;
  tier: 'CORE' | 'ELITE' | 'VENTURE';
  authStage: AuthStage;
  roles: Role[];
  authTimestamp: number;
  avatarUrl?: string;
  authProvider: 'privy';
  jwtToken?: string; 
  phone?: string;
}

// ... rest of the file remains unchanged ...
export type ProjectStatus = 'initiated' | 'assessment_complete' | 'quote_generated' | 'closed';
export type ProjectType = 'design' | 'brand' | 'content' | 'development' | 'consulting';
export type Urgency = 'standard' | 'expedited' | 'critical';
export type ClientTier = 'MVP' | 'PAYFI' | 'WEB3' | 'SME' | 'SMB' | 'FI' | 'CRE' | 'ELITE' | 'VENTURE';

export interface Project {
  id: string;
  uuid: string; 
  userId: string;
  projectType: ProjectType;
  scope: Record<string, any>;
  urgency: Urgency; 
  status: ProjectStatus;
  complexityScore?: number;
  createdAt: string;
  kycStatus?: KycStatus;
  adminOverridePercentage?: number; 
  overrideReason?: string;
  clientTier: ClientTier; 
  auditData?: any; 
}

export interface QuoteInstallment {
  dueInDays: number | null;
  percentage: number;
  amount: number;
  trigger?: 'milestone' | 'days' | 'delivery';
}

export interface QuotePaymentTerms {
  advancePercentage: number;
  advanceAmount: number;
  remainingTerms: string;
  installments: QuoteInstallment[];
  earlyPayDiscount?: {
    enabled: boolean;
    percentage: number;
    windowDays: number;
  };
  kycStatus: KycStatus;
  requiresEscrow: boolean;
  adminOverrideActive?: boolean;
}

export interface Quote {
  id: string;
  projectId: string;
  totalPrice: number;
  timelineWeeks: number;
  notToExceed: true;
  status: 'pending' | 'sent' | 'accepted' | 'expired';
  createdAt: string;
  paymentTerms?: QuotePaymentTerms;
  selectedRail?: SettlementRail;
}

export interface AuditLog {
  id: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId?: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface CartItem { id: string; name: string; price: number; category: string; icon?: string; }
export type ChatMessage = { role: 'user' | 'model'; text: string; timestamp: number; sources?: { uri: string; title: string }[]; };
export interface AiSolution { 
  id: string; 
  title: string; 
  headline: string; 
  subHeadline: string; 
  problem: string[]; 
  solution: string; 
  services?: string[];
  tags: string[]; 
  price: number;
  iconName: 'MessageSquare' | 'Phone' | 'Brain' | 'Globe' | 'Zap'; 
}

export interface SRTLog {
  id: string;
  jobName: string;
  change: number;
  reason: string;
  date: string;
  formula: string;
}

export interface Agreement {
  id: string;
  type: string;
  status: 'ACTIVE' | 'PENDING' | 'RENEWING';
  nextTriggerDate: string;
  value: string;
  rail: 'STRIPE' | 'USDC';
}

export enum BillingType {
  OneTime = 'one-time',
  Recurring = 'recurring'
}

export enum PricingTier {
  AMVP = 'aMVP',
  Performance = 'Performance Platform',
  Scale = 'Scale',
  Velocity = 'Velocity',
  Mastery = 'Mastery'
}

export interface BundlePrice {
  id: string;
  currency: string;
  amount: number;
  billingType: BillingType;
  interval?: string;
  formatted: string;
}

export interface BundleTeamMember {
  role: string;
  count: number;
  seniority: string;
  location: string;
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  shortSummary: string;
  description: string;
  category: string;
  tags: string[];
  heroImage: string;
  deliverables: string[];
  timeline: string;
  jobDuration: string;
  sla: string;
  team: BundleTeamMember[];
  licensing: string;
  paymentTerms: string;
  usageRights: string;
  renewalPolicy: string;
  stack: string[];
  prerequisites: string[];
  prices: BundlePrice[];
  priceHistory: any[];
  tier: PricingTier;
  rating: number;
  reviewCount: number;
}

export type EmailMilestone = 
  | 'AUDIT_INITIATED' 
  | 'SYNC_SCHEDULED' 
  | 'SETTLEMENT_PROPOSAL' 
  | 'NODE_ACTIVE' 
  | 'MILESTONE_REACHED'
  | 'PROJECT_HANDOVER'
  | 'WEEKLY_PROGRESS_SIGNAL'
  | 'CDP_FINALIZED';

export interface PendingEmail {
  id: string;
  templateId: EmailMilestone;
  recipient: string;
  projectId: string;
  subject: string;
  body: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  clientTier: ClientTier;
  clientName?: string;
}

export type AdminView = 'dashboard' | 'projects' | 'quotes' | 'outreach' | 'audit' | 'health' | 'automation' | 'approvals' | 'architecture';

export enum JobStatus {
  Bidding = 'bidding',
  Active = 'active',
  Completed = 'completed'
}

export interface ServiceJob {
  id: string;
  title: string;
  image: string;
  status: JobStatus;
  budget: number;
  location: string;
  requiredStack: string[];
  complexity: number;
  days: number;
  owner: string;
  manager: string;
  nodeTier: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
}

export interface L2LProvider {
  id: string;
  name: string;
  discipline: Discipline;
  age: number;
  phase: number;
  yearsInternship: number;
  yearsNonInternship: number;
  commerceCompletions: number;
  learningCompletions: number;
  image: string;
  srt: number;
}

export interface L2LTeam {
  id: string;
  name: string;
  developers: L2LProvider[];
  projectManager: L2LProvider;
  usesFullStack: boolean;
}

export interface L2LOffering {
  id: string;
  name: string;
  type: TrackType;
  icon: string;
  team?: L2LTeam;
  instructor?: L2LProvider;
  durationWeeks: number;
  tier: string;
  price: number;
  description: string;
  studentCensus?: number;
  avgRating?: number;
}

export interface OutreachEvent {
  id: string;
  leadId: string;
  type: 'email' | 'linkedin' | 'x' | 'farcaster';
  status: 'sent' | 'replied' | 'failed';
  timestamp: string;
}

export interface BdrLead {
  id: string;
  companyName: string;
  companyDomain: string;
  contactRole: string;
  contactEmail: string;
  targetingScore: number;
  techSophistication: 'low' | 'medium' | 'high' | 'critical';
  recommendedTrack: 'Technical SDR' | 'Creative SDR' | 'Not Qualified';
  buyingSignals: string[];
  outreachAttempted: boolean;
  outreachChannel: 'email' | 'linkedin' | 'x' | 'farcaster' | null;
  handoffTriggered: boolean;
  handoffReason?: string;
  lastReplyAt?: string;
}

export interface AutomationConfig {
  id: string;
  name: string;
  enabled: boolean;
  rules: any[];
}

export interface EmailSequenceTemplate {
  id: EmailMilestone;
  subject: string;
  preheader: string;
  body: string;
  callToAction?: { label: string; url: string; };
  tierVariations: Record<string, string>;
}
