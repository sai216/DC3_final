import { BillingType } from '../types';

/**
 * STRATEGIC SETTLEMENT CONFIGURATION (v4.7.2)
 * Hardened for Google UCP Commerce Protocol & Coinbase Agent2Agent (A2A).
 * All valuations represented in USDC (Institutional Stable Digital Currency).
 */
export const PRICING_CONFIG = {
  CURRENCY: 'USDC',
  NETWORK: 'Google UCP // Coinbase A2A // Solana // Base',
  PROTOCOLS: {
    GOOGLE_UCP: 'Google Universal Commerce Protocol (UCP) v1.4',
    COINBASE_A2A: 'Coinbase Agent2Agent (A2A) v0.9'
  },
  
  DEFAULTS: {
    ADVANCE_PERCENTAGE: 15,
    PAYMENT_TERMS: '30-60-90 Day Terms',
    INVOICE_TERMS: 'Net 0'
  },
  
  SERVICE_TIERS: {
    BRANDING: {
      STARTUP: 1195,
      VELOCITY: 1595,
      ENTERPRISE: 1995
    },
    WEB3: {
      PROTOCOL: 3495,
      TREASURY: 5595,
      ECOSYSTEM: 9995
    },
    FULLSTACK: {
      CORE: 4995,
      PRO: 7995,
      MASTERY: 12995
    }
  },

  AI_OPTIMIZATION: {
    RECEPTIONIST: 1250,
    RAG_AGENT: 2400,
    WEBSITE: 3500,
    WHATSAPP_SDR: 1800,
    ELIZA_POLYMARKET: 4500,
    N8N_LEADGEN: 2800
  },

  CATALOG: {
    PLATFORM_CORE: 4995,
    WEB3_PROTOCOL: 3495,
    TREASURY_TECH: 5595,
    CREATIVE_STRATEGY: 1595,
    AI_OPTIMIZATION: 2000,
    BRANDING: 1800
  },

  BUNDLES: {
    GROWTH_V1: 8500,
    PROTOCOL_V4: 24500
  },

  FEES: {
    STRIPE_MULTIPLIER: 1.03333,
    UCP_PROTOCOL_FEE: 0,
    A2A_GAS_SUBSIDY: true
  }
} as const;