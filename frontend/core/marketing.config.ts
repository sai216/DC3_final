import { PRICING_CONFIG } from './pricing.config';
import { PORTFOLIO_IMAGES, UI_TEXTURES } from '../assets/images/registry';

export const MARKETING_CONFIG = {
  HERO: {
    TITLE_MVP: "From MVP to",
    TITLE_SCALE: "Enterprise Scale",
    SUBHEADLINE: "DC3, Unifying Design, Engineering, and Launch—Ready to Scale Your Vision."
  },

  BOOKING: {
    CONFIRMATION_TITLE: "Protocol Handshake Required",
    CONFIRMATION_SUMMARY: "You are about to initiate an Advanced Strategic Sync. This session involves principal allocation for technical scoping and architectural alignment. Expected duration: 30-45 minutes.",
    CONF_LABEL: "CONFIRM_&_INITIALIZE_UPLINK",
    CANCEL_LABEL: "ABORT_SEQUENCE"
  },

  PRICING: {
    USDC_LABEL: "USDC",
    STABLECOIN_TOOLTIP: "Deterministic settlement protocol optimized for USDC via Google UCP and Coinbase A2A. This structure eliminates legacy banking latency and ensures sub-second milestone finality via agentic handshakes.",
    NETWORK_SIGNAL: "MULTI_PROTOCOL // UCP_A2A_SOL_BASE",
    SETTLEMENT_DESC: "All pricing in USDC stablecoin. Google UCP & Coinbase A2A verified for agentic autonomous settlement.",
    USDC_DETAILS: [
      { label: "Google UCP", value: "Enabled v1.4" },
      { label: "Coinbase A2A", value: "Verified Protocol" },
      { label: "Asset Rail", value: "USDC Stablecoin" },
      { label: "Execution", value: "Deterministic" }
    ]
  },

  SERVICE_TIERS: {
    BRANDING: [
      { id: 'b_startup', name: 'Talent Node | Growth', summary: 'Essential growth signals for ventures. Google UCP and A2A settlement ready.', features: ['Social management', 'Content calendar', 'Branding Signal'], tier: 'Startup' },
      { id: 'b_growing', name: 'Deployment Bundle | Velocity', summary: 'High-velocity branding & social ops. Includes Coinbase A2A handshake verification.', features: ['Full social management', 'Video production', 'Brand Identity'], tier: 'Growing' },
      { id: 'b_established', name: 'Enterprise Advisory', summary: 'Advanced market strategy with full UCP commerce protocol orchestration.', features: ['Advanced social strategy', 'Global SEO Node', 'Campaign analytics'], tier: 'Established' }
    ],
    WEB3: [
      { id: 'w_startup', name: 'Talent Node | Protocol', summary: 'Core protocol development. Native support for Coinbase Agent2Agent handshakes.', features: ['Solidity/Rust Engineering', 'Security Audit Sync', 'Tokenomics Design'], tier: 'Foundational' },
      { id: 'w_growing', name: 'Deployment Bundle | Treasury', summary: 'Advanced treasury tech and Google UCP cross-border settlement rails.', features: ['Stablecoin Orchestration', 'Yield Management Nodes', 'Compliance Layer'], tier: 'Institutional' },
      { id: 'w_established', name: 'Ecosystem Engineering', summary: 'Blockchain ecosystem design featuring multi-protocol A2A/UCP reconciliation.', features: ['L1/L2 Infrastructure', 'Bridge Orchestration', 'Staking Hubs'], tier: 'Enterprise' }
    ],
    FULLSTACK: [
      { id: 'f_scale', name: 'Platform Node | Core', summary: 'Advanced engineering with integrated Google UCP commerce nodes.', features: ['Next.js Architecture', 'Cloud Native Backend', 'Real-time Data Sync'], tier: 'Scale' },
      { id: 'f_velocity', name: 'Deployment Bundle | Pro', summary: 'Enterprise development with Coinbase A2A agentic workflow support.', features: ['Microservices Mesh', 'Advanced CI/CD Pipelines', 'Performance Monitoring'], tier: 'Velocity' },
      { id: 'f_enterprise', name: 'Optimization Advisory', summary: 'Systemic optimization for institutional-scale UCP/A2A settlements.', features: ['Systemic Audit', 'Latency Compression', 'Zero-Downtime Migration'], tier: 'Mastery' }
    ]
  },

  PORTFOLIO: [
    { id: 'dc-01', name: 'ENTERTAINMENT', systemType: 'UI/UX • MOBILE_APP • SAAS', clientStage: 'Growth', year: '2024', month: 'MARCH', clientPartner: 'FRIZDA', longDescription: 'FRIZDA MAKES NIGHTCLUB BOOKING EFFORTLESS - RESERVE TABLES, DISCOVER EVENTS, AND ENJOY PREMIUM ENTERTAINMENT APP.', bgTexture: PORTFOLIO_IMAGES.QUANTUM_LEDGER, caseStudyUrl: 'https://decensat.com/frizda', techStack: ['UI/UX', 'MOBILE_APP', 'SAAS'] },
    { id: 'dc-02', name: 'FINTECH', systemType: 'UI/UX • WEBSITE • SAAS', clientStage: 'Growth', year: '2024', month: 'FEBRUARY', clientPartner: 'FUNDIO', longDescription: 'FUNDIO EMPOWERS SMARTER CAPITAL COMMITMENTS THROUGH INTUITIVE FINTECH SOLUTIONS.', bgTexture: PORTFOLIO_IMAGES.VOX_ORCHESTRATOR, caseStudyUrl: 'https://fundio.vc', techStack: ['UI/UX', 'WEBSITE', 'SAAS'] },
    { id: 'dc-03', name: 'BOTANICAL CMS', systemType: 'Distributed Asset Mgmt', clientStage: 'Internal', year: '2023', month: 'NOVEMBER', clientPartner: 'Creative Hub V', longDescription: 'INTERNAL CULTURE-FIRST ASSET MANAGEMENT SYSTEM. DENOTES GLOBAL TALENT PRINCIPALS THROUGH SPECIALIZED BOTANICAL PERFORMANCE INDICATORS.', bgTexture: PORTFOLIO_IMAGES.BOTANICAL_CMS, caseStudyUrl: 'https://decensat.com/botanical', techStack: ['Edge Runtime', 'GraphQL', 'Vault'] },
    { id: 'dc-04', name: 'NEXUS RESERVE', systemType: 'Liquidity Aggregator', clientStage: 'Growth', year: '2024', month: 'JANUARY', clientPartner: 'DeFi Labs', longDescription: 'INSTITUTIONAL LIQUIDITY LAYER FOR DECENTRALIZED TREASURY MANAGEMENT. FEATURES AUTOMATED YIELD REBALANCING AND RISK MITIGATION PROTOCOLS.', bgTexture: PORTFOLIO_IMAGES.NEXUS_RESERVE, caseStudyUrl: 'https://decensat.com/nexus', techStack: ['Rust', 'EVM Bridge', 'Tenderly'] },
    { id: 'dc-05', name: 'HYPER VAULT', systemType: 'Secure Custody Protocol', clientStage: 'Enterprise', year: '2024', month: 'APRIL', clientPartner: 'Institutional Crypto', longDescription: 'ADVANCED ASSET ISOLATION PROTOCOL PROVIDING BIOMETRIC-LINKED HARDWARE SECURITY FOR HIGH-VALUE VENTURE ASSETS.', bgTexture: PORTFOLIO_IMAGES.HYPER_VAULT, caseStudyUrl: 'https://decensat.com/hyper-vault', techStack: ['ZK-Rollup', 'Enclave', 'Auth_v5'] },
    { id: 'dc-06', name: 'NEURAL BRIDGE', systemType: 'AI Data Interop', clientStage: 'Growth', year: '2024', month: 'MAY', clientPartner: 'DataCorp Enterprise', longDescription: 'DATA BRIDGING BETWEEN LEGACY SYSTEMS AND AGENTIC LLM NODES. ENSURES ACCURATE SIGNAL PARITY ACROSS DISPARATE DATABASES.', bgTexture: PORTFOLIO_IMAGES.NEURAL_BRIDGE, caseStudyUrl: 'https://decensat.com/neural-bridge', techStack: ['FastAPI', 'Redis', 'Python'] },
    { id: 'dc-07', name: 'AETHER DEX', systemType: 'Decentralized Exchange', clientStage: 'MVP', year: '2023', month: 'DECEMBER', clientPartner: 'Capital Partners', longDescription: 'LIQUIDITY OPTIMIZED DEX WITH LOW-SLIPPAGE PROTOCOLS AND INSTITUTIONAL ORDER MATCHING FOR SCALE.', bgTexture: PORTFOLIO_IMAGES.AETHER_DEX, caseStudyUrl: 'https://decensat.com/aether', techStack: ['Uniswap v4', 'React', 'Solidity'] },
    { id: 'dc-08', name: 'TITAN MESH', systemType: 'Global Node Infra', clientStage: 'Enterprise', year: '2024', month: 'JUNE', clientPartner: 'Infrastructure Fund', longDescription: 'GEOGRAPHICALLY DISTRIBUTED SERVER CLUSTERS FOR RESILIENT DAPP HOSTING AND DECENTRALIZED CLOUD COMPUTE ORCHESTRATION.', bgTexture: PORTFOLIO_IMAGES.TITAN_MESH, caseStudyUrl: 'https://decensat.com/titan', techStack: ['Kubernetes', 'Go', 'Docker'] },
    { id: 'dc-09', name: 'SOLARIS ERP', systemType: 'Venture Ops System', clientStage: 'Growth', year: '2024', month: 'JULY', clientPartner: 'Startup Studio X', longDescription: 'UNIFIED EXECUTION SYSTEM FOR VENTURE MANAGEMENT AND RESOURCE ALLOCATION. OPTIMIZED FOR MULTI-TENANT WORKFLOW TRACKING.', bgTexture: PORTFOLIO_IMAGES.SOLARIS_ERP, caseStudyUrl: 'https://decensat.com/solaris', techStack: ['Next.js', 'Prisma', 'Postgres'] },
    { id: 'dc-10', name: 'ORACLE NODE', systemType: 'Deterministic Data Feed', clientStage: 'Growth', year: '2024', month: 'AUGUST', clientPartner: 'Market Intelligence', longDescription: 'INSTITUTIONAL DATA INGESTION LAYER FOR REAL-TIME MARKET SIGNALS. VERIFIED PROOF OF DELIVERY FOR EXTERNAL DATA CONSUMPTION.', bgTexture: PORTFOLIO_IMAGES.ORACLE_NODE, caseStudyUrl: 'https://decensat.com/oracle', techStack: ['TypeScript', 'Node.js', 'MQTT'] }
  ],

  L2L: {
    PHASES: [
      { id: 0, title: 'Secondary Pipeline', desc: 'Ages 17–18. High school senior exposure to work expectations, modern toolsets, and mindset alignment.' },
      { id: 1, title: 'Core Onboarding', desc: 'Ages 19–22. Initiation of 1st and 2nd execution sequences focused on skill velocity and delivery habits.' },
      { id: 2, title: 'Execution Logic', desc: 'Ages 19–22. Completion of 3rd and 4th projects with portfolio-ready outputs grounded in real execution.' },
      { id: 3, title: 'Verified Proof', desc: 'Age 22+. Attestation of peer-outperformance and final verification of professional capability.' },
      { id: 4, title: 'Marketplace Gateway', desc: 'Ages 23–30. Qualified participants may earn visibility in the Assurative.al Juice Nodes marketplace.' }
    ],
    ROLES: [
      { id: 'CORE_CODER', label: 'Core Coder', desc: 'Technical engineering & logic' },
      { id: 'BUILDER_FULL_STACK', label: 'Builder+', desc: 'End-to-end product delivery' },
      { id: 'BUILDER_BLOCKCHAIN', label: 'Blockchain', desc: 'Smart contracts & protocols' },
      { id: 'CULTURE_BUILDER', label: 'Culture Builder', desc: 'Audience & distribution' },
      { id: 'PROJECT_LEAD', label: 'Project Lead', desc: 'Strategy & orchestration' },
      { id: 'DROPOUT_INNOVATOR', label: 'Innovator', desc: 'Rapid execution & prototyping' }
    ]
  }
} as const;