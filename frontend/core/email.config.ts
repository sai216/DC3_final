import { EmailSequenceTemplate, UserProfile } from '../types';

/**
 * INSTITUTIONAL COMMUNICATION MANIFEST (v4.8.0)
 * Hardened for Google UCP v1.4 & Coinbase A2A v0.9 Settlement.
 * Optimized for Capabilities Bundles and AI Automation Managed Services.
 */
export const RESEND_SEQUENCES: EmailSequenceTemplate[] = [
  {
    id: 'AUDIT_INITIATED',
    subject: '[!] PROTOCOL_INITIATED: {{SEGMENT_ID}} Architectural Ingestion // {{PROJECT_ID}}',
    preheader: 'System ingestion successful. Initiating node discovery sequence.',
    body: `Greetings {{CLIENT_NAME}},

NODE_ID: {{PROJECT_ID}}
TIER_CLASS: {{CLIENT_TIER}}
SIGNAL_STATUS: INGESTED
INGESTION_TIMESTAMP: {{TIMESTAMP_UTC}}
STITCH_PROTOCOL: v4.8.0_HARDENED

The architectural audit for your project has been initialized. Our orchestration layer is scanning provided artifacts to compute node requirements and allocation weights.

SETTLEMENT_PROTOCOL:
- PRIMARY_RAIL: Google UCP (Universal Commerce Protocol)
- AGENTIC_SYNC: Coinbase A2A (Agent2Agent)
- ADVANCE_DRAW: {{ADVANCE_PERCENT}}%
- PAYMENT_TERMS: {{PAYMENT_TERMS}}

NETWORK_TELEMETRY:
- Segment Protocol: {{SEGMENT_ID}}
- SLA_LEVEL: {{SLA_LEVEL}}
- Stitch Latency: {{LATENCY_INDEX}}ms
- Principal Matchability: {{MATCH_SCORE}}%
- Reputation Gating: SRT_CHECK_ACTIVE

Our system is assigning a Lead Architect based on your tier-specific service level agreement.`,
    callToAction: { label: 'OPEN_AUDIT_LOG', url: 'https://console.assurative.ai/audit/{{PROJECT_ID}}' },
    tierVariations: {
      CORE: "Priority: STANDARD. Your node discovery is scheduled within the T+24h operational window. Standard support buffer active.",
      ELITE: "Priority: ELEVATED. An Elite-tier Principal Node is being prioritized for immediate architectural alignment. Surge-buffer allocation active (+15% Velocity Target).",
      VENTURE: "Priority: CRITICAL. 443 Smart Collateral Protocol engaged. Lead Architect allocated to immediate ingestion. Infrastructure provisioning bypass active. Direct-line principal access initialized."
    }
  },
  {
    id: 'SETTLEMENT_PROPOSAL',
    subject: 'PROPOSAL_MANIFEST: {{SEGMENT_ID}} Settlement Rail Finalized // {{PROJECT_ID}}',
    preheader: 'Review the deterministic settlement schedule and technical roadmap.',
    body: `TOTAL_VALUATION: {{TOTAL_PRICE}} ISDC
SETTLEMENT_RAIL: {{SETTLEMENT_RAIL}}
VALUATION_PROTOCOL: Google UCP v1.4
HANDSHAKE_METHOD: Coinbase A2A v0.9
ADVANCE_REQUISITION: {{ADVANCE_PERCENT}}%
EARLY_PAYOFF_VALUATION: -{{EARLY_PAYOFF_DISCOUNT}}%

The scoping for {{PROJECT_ID}} is complete. The attached manifest details the deterministic build sequence and settlement triggers. 

This proposal utilizes the Google UCP rail for frictionless global ISDC draws, synchronized via Coinbase A2A agentic handshakes to ensure sub-second milestone finality.

Execution will initiate automatically upon advance draw verification.`,
    callToAction: { label: 'EXECUTE_SETTLEMENT', url: 'https://console.assurative.ai/settle/{{PROJECT_ID}}' },
    tierVariations: {
      CORE: "Standard settlement architecture: {{ADVANCE_PERCENT}}% Advance / Net-0 Invoicing on milestones.",
      ELITE: "Performance Platform routing: Velocity-optimized milestones. Priority finality on sub-second settlement rails. Early payoff discount of {{EARLY_PAYOFF_DISCOUNT}}% active.",
      VENTURE: "Full 443 SMP Protocol: Node cluster is 100% network-collateralized. Advanced liquidity routing active via Google UCP + Coinbase A2A Synergy."
    }
  },
  {
    id: 'CDP_FINALIZED',
    subject: 'CDP_SIGNAL: Settlement Terminal & Access Granted // {{SEGMENT_ID}} // {{PROJECT_ID}}',
    preheader: 'Full protocol reconciliation successful. Access to Capabilities/Automation node granted.',
    body: `CDP_STATUS: TERMINAL_SUCCESS
PAYMENT_FINALITY: CONFIRMED
SETTLEMENT_RAIL: {{SETTLEMENT_RAIL}}
UCP_TRANSACTION_HASH: {{UCP_HASH}}
A2A_HANDSHAKE_ID: {{A2A_ID}}
NODE_LIFECYCLE: ACTIVE_PROVISIONED
REPUTATION_GAIN: +{{SRT_CHANGE}} SRT

The settlement lifecycle for {{PROJECT_ID}} has reached terminal finality. 

PROTOCOL VERIFICATION:
1. Google UCP: Transaction verified on Institutional Rail.
2. Coinbase A2A: Agentic handshake signed and recorded.
3. Asset: ISDC Stablecoin Draw Completed.

Your node (Capabilities Bundle / AI Managed Service) is now fully provisioned and integrated into your active architecture. Technical artifacts and access credentials are archived in your persistent vault.`,
    callToAction: { label: 'ACCESS_NODE_CONSOLE', url: 'https://console.assurative.ai/console' },
    tierVariations: {
      CORE: "Project archived. Standard 30-day post-delivery support window active.",
      ELITE: "Project archived. Eligibility for Performance-tier venture builds unlocked. 90-day advisory active.",
      VENTURE: "Ecosystem node permanent. 443 SMP success recorded. Perpetual principal advisory and UCP/A2A referral-node logic active."
    }
  }
];