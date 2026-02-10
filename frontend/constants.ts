import { Bundle, BillingType, PricingTier, ServiceJob, JobStatus, SRTLog, AiSolution } from './types';

export const SERVICE_TIERS = {
  BRANDING: [
    {
      id: 'b_startup',
      name: 'Talent Node | Growth',
      price: 1195,
      summary: 'Essential growth signals for new ventures. Led by core creative principals.',
      features: ['Social management', 'Content calendar', 'Branding Signal'],
      tier: 'Startup'
    },
    {
      id: 'b_growing',
      name: 'Deployment Bundle | Velocity',
      price: 1595,
      summary: 'High-velocity branding & social ops. Dual principal expertise across creative hubs.',
      features: ['Full social management', 'Video production', 'Brand Identity'],
      tier: 'Growing'
    },
    {
      id: 'b_established',
      name: 'Enterprise Advisory',
      price: 1995,
      summary: 'Advanced market strategy. Managed by Decensat Design & Development Principals.',
      features: ['Advanced social strategy', 'Global SEO Node', 'Campaign analytics'],
      tier: 'Established'
    }
  ],
  WEB3: [
    {
      id: 'w_startup',
      name: 'Talent Node | Protocol',
      price: 3495,
      summary: 'Core protocol development and smart contract engineering.',
      features: ['Solidity/Rust Engineering', 'Security Audit Sync', 'Tokenomics Design'],
      tier: 'Foundational'
    },
    {
      id: 'w_growing',
      name: 'Deployment Bundle | Treasury',
      price: 5595,
      summary: 'Advanced treasury tech and cross-border settlement rails.',
      features: ['Stablecoin Orchestration', 'Yield Management Nodes', 'Compliance Layer'],
      tier: 'Institutional'
    },
    {
      id: 'w_established',
      name: 'Ecosystem Engineering',
      price: 9995,
      summary: 'Full-scale blockchain ecosystem design spanning global talent hubs.',
      features: ['L1/L2 Infrastructure', 'Bridge Orchestration', 'Staking Hubs'],
      tier: 'Enterprise'
    }
  ],
  FULLSTACK: [
    {
      id: 'f_scale',
      name: 'Platform Node | Core',
      price: 4995,
      summary: 'High-performance end-to-end platform engineering.',
      features: ['Next.js Architecture', 'Cloud Native Backend', 'Real-time Data Sync'],
      tier: 'Scale'
    },
    {
      id: 'f_velocity',
      name: 'Deployment Bundle | Pro',
      price: 7995,
      summary: 'High-velocity development for complex enterprise requirements.',
      features: ['Microservices Mesh', 'Advanced CI/CD Pipelines', 'Performance Monitoring'],
      tier: 'Velocity'
    },
    {
      id: 'byo_bundle',
      name: 'Build Your Own Bundle',
      price: 0,
      isByo: true,
      summary: 'Custom architecture design following the 443 Smart Collateral Protocol. No upfront settlement required.',
      features: ['443 Protocol Optimized', 'Principal Advisory', 'Custom Node Mapping'],
      tier: 'Custom_443'
    }
  ]
};

export const AI_OPTIMIZATION_NODES: AiSolution[] = [
  {
    id: 'ai_receptionist',
    title: 'AI Receptionist',
    headline: '24/7 Instant Response.',
    subHeadline: 'Never miss another lead again with 24/7 instant response.',
    problem: ['Missed after-hours calls', 'High overhead'],
    solution: '24/7 coverage • Automatic booking • Saves $40K-$80K+ annually',
    services: [
      'Voice Synthesis Node (Neural Voice)',
      'Real-time Calendar Sync (Cal.com/Calendly)',
      'CRM Auto-population Logic',
      'Multi-language Support Protocol'
    ],
    tags: ['Reception', '24/7'],
    price: 1250,
    iconName: 'Zap'
  },
  {
    id: 'ai_rag',
    title: 'AI RAG Agent',
    headline: 'Institutional Brain.',
    subHeadline: "Your business's brain that never forgets.",
    problem: ['Siloed knowledge', 'Slow onboarding'],
    solution: 'Centralized knowledge • 24/7 answers • 10x faster onboarding',
    services: [
      'Document Vectorization Pipeline',
      'Semantic Search Knowledge Layer',
      'Custom Knowledge Base Sync (Notion/PDF)',
      'External API Integration Node'
    ],
    tags: ['Knowledge', 'RAG'],
    price: 2400,
    iconName: 'Brain'
  },
  {
    id: 'ai_website',
    title: 'AI-Powered Website',
    headline: 'High-Conversion Portals.',
    subHeadline: 'A website that sells, not just sits there.',
    problem: ['Static legacy sites', 'Low conversion'],
    solution: 'Fully done-for-you • Launch in days • Built to convert',
    services: [
      'Dynamic Conversion Logic Mesh',
      'Edge-runtime Optimization',
      'Interactive UI/UX Generative Nodes',
      'Automated SEO Synthesis v4'
    ],
    tags: ['Web', 'Conversion'],
    price: 3500,
    iconName: 'Globe'
  },
  {
    id: 'ai_whatsapp',
    title: 'AI WhatsApp SDR',
    headline: 'Autonomous Qualification.',
    subHeadline: 'Every lead answered. Every opportunity qualified. Automatically.',
    problem: ['Slow response times', 'Manual qualification'],
    solution: 'Instant response • Smart qualification • Works 24/7',
    services: [
      'Lead Qualification Logic (BDR-01)',
      'Sentiment Analysis Node',
      'Autonomous Follow-up Loops',
      'Hubspot/Salesforce Rail Bridge'
    ],
    tags: ['Sales', 'WhatsApp'],
    price: 1800,
    iconName: 'MessageSquare'
  },
  {
    id: 'ai_eliza_treasury',
    title: 'Eliza SME Treasury Tool',
    headline: 'Eliza Cloud Agentic Guidance.',
    subHeadline: 'SME Event Treasury Tooling for decentralized capital orchestration.',
    problem: ['Treasury fragmentation', 'Manual draws'],
    solution: 'Autonomous liquidity sync • Eliza Cloud Bridge • Event-driven draws',
    services: [
      'Eliza Agentic Cloud Handshake',
      'SME Event Triage Protocol',
      'Multi-chain Treasury Orchestration',
      'Deterministic Payout Logic'
    ],
    tags: ['Treasury', 'Agentic'],
    price: 4500,
    iconName: 'Zap'
  },
  {
    id: 'ai_byo',
    title: 'Build Your Own Bundle',
    headline: 'Custom Architecture.',
    subHeadline: 'Tailored AI automation nodes following the 443 Smart Collateral Protocol.',
    problem: ['Unique workflow needs', 'Off-shelf limitations'],
    solution: 'Full Principal consultation • 443 SMP Optimized • Bespoke Agents',
    services: [
      '443 Protocol Optimized Design',
      'Principal Architectural Advisory',
      'Custom Agentic Mapping Sequence',
      'Hybrid UCP/A2A Settlement'
    ],
    tags: ['Bespoke', 'Advisory'],
    price: 0,
    iconName: 'Brain'
  }
];

export const SERVICES_CATALOG = [
  { id: 'sc1', name: 'Platform Core Node', price: 4995, category: 'Engineering' },
  { id: 'sc2', name: 'Web3 Protocol Node', price: 3495, category: 'Engineering' },
  { id: 'sc3', name: 'Treasury Tech Node', price: 5595, category: 'Engineering' },
  { id: 'sc4', name: 'Creative Strategy Node', price: 1595, category: 'Design' },
  { id: 'sc5', name: 'AI Optimization Node', price: 2000, category: 'Automation' },
  { id: 'sc6', name: 'Branding Node', price: 1800, category: 'Creative' }
];

export const BUNDLES: Bundle[] = [
  {
    id: 'bnd-01',
    slug: 'growth-bundle',
    name: 'Growth Bundle V1',
    shortSummary: 'Comprehensive design & branding foundation for series-A ready ventures.',
    description: 'A pre-configured deployment bundle designed to establish institutional-grade brand presence. Includes full identity systems, content strategy, and a high-conversion landing node.',
    category: 'Venture Build',
    tags: ['Identity', 'Strategy', 'Launch'],
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800',
    deliverables: ['Full Visual Identity', 'Content Strategy Deck', 'Performance Landing Page'],
    timeline: '4 Weeks',
    jobDuration: 'Project Based',
    sla: '99.9% Uptime',
    team: [
      { role: 'Creative Director', count: 1, seniority: 'Lead', location: 'Onshore' },
      { role: 'UI/UX Designer', count: 1, seniority: 'Senior', location: 'Offshore' }
    ],
    licensing: 'IP Ownership Transfer',
    paymentTerms: 'USDC / Stripe Milestone',
    usageRights: 'Unlimited Global',
    renewalPolicy: 'N/A',
    stack: ['Figma', 'Adobe Suite', 'Next.js'],
    prerequisites: ['Brand Questionnaire'],
    prices: [{ id: 'p1', currency: 'USD', amount: 8500, billingType: BillingType.OneTime, formatted: '$8,500' }],
    priceHistory: [],
    tier: PricingTier.AMVP,
    rating: 5.0,
    reviewCount: 12
  }
];

export const AI_SOLUTIONS: AiSolution[] = AI_OPTIMIZATION_NODES;
export const SERVICE_JOBS: ServiceJob[] = [];
export const SRT_HISTORY: SRTLog[] = [];