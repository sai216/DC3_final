export const KNOWLEDGE_CONFIG = {
  FAQS: [
    {
      id: 'f-proto-1',
      category: 'Protocols',
      question: "443 Smart Collateral Protocol",
      answer: "The 443 SMP is our flagship de-risking mechanism. By applying deterministic build logic to complex software engineering, we ensure that every 4th node in a stack is fully collateralized through venture-partner assets, providing institutional certainty in high-volatility delivery environments."
    },
    {
      id: 'f-proto-2',
      category: 'Protocols',
      question: "Sovereign Reputation Tracking (SRT)",
      answer: "SRT is the core immutable ledger of the Decensat ecosystem. Unlike legacy CVs, SRT records every node's performance, code quality, and delivery speed on a permanent record. This allows for automated talent routing based on proven execution history rather than subjective claims."
    },
    {
      id: 'f-infra-1',
      category: 'Infrastructure',
      question: "Fintech Rails & L2 Integration",
      answer: "Decensat utilizes L2-native fintech bridges to connect legacy banking APIs (Stripe) with high-throughput blockchains (Solana/Base). This architecture reduces settlement latency from standard 3-5 day banking windows to sub-second finality for digital asset draws, bridging the gap between TradFi and DeFi."
    },
    {
      id: 'f-econ-1',
      category: 'Economics',
      question: "UCP Settlement Logic",
      answer: "The Universal Commerce Protocol (UCP) automates the conversion of traditional fiat signals into institutional stablecoin draws (USDC). This ensures deterministic payout cycles across global jurisdictional boundaries, governed by smart contract escrow and autonomous agentic handshakes."
    },
    {
      id: 'f-node-1',
      category: 'Nodes',
      question: "Principal Nodes: Lead Talent",
      answer: "Principal Nodes represent the apex talent tier within the DC3 ecosystem. These verified specialists (maintaining SRT scores of 900+) lead architectural orchestration and quality assurance, ensuring every build sequence maintains 100% parity with institutional specifications and delivery timelines."
    },
    {
      id: 'f-arch-1',
      category: 'Architecture',
      question: "Multi-Talent Node Skill Synchronization",
      answer: "Our Skills Architecture utilizes a high-fidelity 'Skill Mesh' where specialized talent nodes—Design, Web3, and Fullstack—operate in a synchronized execution layer. This allows for multi-disciplinary output where code, brand, and economic logic are developed in parallel rather than series."
    }
  ],

  KNOWLEDGE_NODES: [
    { id: 'kn-1', label: 'Node Integrity', content: 'Protocol-verified performance monitoring ensures sub-second output alignment.' },
    { id: 'kn-2', label: 'Capital De-risking', content: 'Automated 443 collateral triggers activate upon milestone divergence.' },
    { id: 'kn-3', label: 'Mesh Routing', content: 'Talent allocation is governed by dynamic SRT reputation vectors.' },
    { id: 'kn-4', label: 'Compliance Lock', content: 'Institutional SOC-2 standards are enforced at the node execution layer.' }
  ]
} as const;