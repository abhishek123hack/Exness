export type PageData = {
  variant: "markets" | "trade" | "platforms" | "accounts" | "pricing" | "about" | "contact";
  eyebrow: string;
  title: string;
  description: string;
  accent: string;
  primaryCta: string;
  secondaryCta: string;
  cards: Array<{ title: string; text: string; metric: string }>;
  highlights: string[];
};

export const pageData: Record<string, PageData> = {
  markets: {
    variant: "markets",
    eyebrow: "Global Market Access",
    title: "Trade crypto, forex, stocks, gold and indices in one place.",
    description: "Explore real-time pricing, deep liquidity, tight spreads and AI-ranked market opportunities across every major asset class.",
    accent: "from-neonBlue via-neonCyan to-neonGreen",
    primaryCta: "Explore Markets",
    secondaryCta: "View spreads",
    cards: [
      { title: "Crypto pairs", text: "BTC, ETH, SOL and high-liquidity alt markets with advanced risk controls.", metric: "250+" },
      { title: "Forex symbols", text: "Major, minor and exotic currency pairs routed through premium liquidity.", metric: "70+" },
      { title: "Equities and ETFs", text: "Trade global tech, blue-chip and sector baskets from one dashboard.", metric: "4K+" },
      { title: "Metals and indices", text: "Gold, oil, NASDAQ, DAX and more with institutional execution.", metric: "90+" }
    ],
    highlights: ["Live market heatmaps", "AI volatility rankings", "Depth of market panels", "Custom watchlists and alerts"]
  },
  trade: {
    variant: "trade",
    eyebrow: "Execution Engine",
    title: "Lightning-fast trading tools for precision entries.",
    description: "Place advanced orders, manage risk, automate strategies and monitor every position through a cinematic command center.",
    accent: "from-neonPurple via-neonPink to-neonOrange",
    primaryCta: "Start Trading",
    secondaryCta: "Watch execution",
    cards: [
      { title: "Order routing", text: "Smart execution chooses the best available path for speed and fill quality.", metric: "8ms" },
      { title: "Advanced orders", text: "OCO, trailing stop, bracket orders and one-click position reversal.", metric: "12+" },
      { title: "Risk cockpit", text: "Margin, liquidation and portfolio stress signals before risk gets loud.", metric: "24/7" },
      { title: "Automation", text: "Deploy bots, alerts and AI signal rules with clean controls.", metric: "AI" }
    ],
    highlights: ["One-click trading panels", "Position heat and liquidation zones", "Smart stop-loss assistant", "Performance journal and analytics"]
  },
  platforms: {
    variant: "platforms",
    eyebrow: "Cross-Device Platforms",
    title: "MT4, MT5, WebTrader, mobile and AI platforms.",
    description: "Trade from desktop, browser or mobile with synchronized layouts, alerts, analytics and portfolio state.",
    accent: "from-neonCyan via-neonBlue to-neonPurple",
    primaryCta: "Download Apps",
    secondaryCta: "Compare platforms",
    cards: [
      { title: "MT4", text: "Classic forex trading with EAs, indicators and familiar pro workflows.", metric: "FX" },
      { title: "MT5", text: "Multi-asset execution, depth, calendar and advanced order types.", metric: "Pro" },
      { title: "WebTrader", text: "Browser trading with no install, streaming charts and fast order entry.", metric: "Web" },
      { title: "Mobile + AI", text: "Biometric access, push signals, mobile charting and Exness AI briefs.", metric: "iOS" }
    ],
    highlights: ["Cloud-synced workspaces", "Native mobile notifications", "TradingView-style charting", "Platform downloads and onboarding"]
  },
  accounts: {
    variant: "accounts",
    eyebrow: "Account Architecture",
    title: "Account tiers built for every trading ambition.",
    description: "Start small or operate at institutional scale with transparent requirements, premium support and tiered trading benefits.",
    accent: "from-neonGreen via-neonCyan to-neonBlue",
    primaryCta: "Open Account",
    secondaryCta: "Compare tiers",
    cards: [
      { title: "Starter", text: "Low deposit access, standard spreads and a complete demo workspace.", metric: "$50" },
      { title: "Pro", text: "Tighter spreads, priority support and deeper analytics for active traders.", metric: "$1K" },
      { title: "Elite", text: "Dedicated support, advanced leverage and premium platform tools.", metric: "$10K" },
      { title: "VIP", text: "Private desk service, custom conditions and tailored liquidity access.", metric: "$100K" }
    ],
    highlights: ["Fast KYC flow", "Demo and live modes", "Tiered spreads and support", "Secure deposits and withdrawals"]
  },
  pricing: {
    variant: "pricing",
    eyebrow: "Transparent Pricing",
    title: "Premium trading costs without hidden surprises.",
    description: "Compare spreads, commissions, leverage and support levels before opening your account.",
    accent: "from-neonGold via-neonOrange to-neonPink",
    primaryCta: "Choose Plan",
    secondaryCta: "See fee table",
    cards: [
      { title: "Starter spread", text: "Simple all-in spread model for new traders and demo testing.", metric: "1.4" },
      { title: "Pro spread", text: "Lower costs for frequent traders across FX, crypto and indices.", metric: "0.7" },
      { title: "Elite spread", text: "Near-institutional trading conditions and premium support.", metric: "0.2" },
      { title: "VIP raw pricing", text: "Custom fee structures for high-volume desks and teams.", metric: "Raw" }
    ],
    highlights: ["No hidden platform fees", "Clear withdrawal rules", "Volume-based upgrades", "Dedicated pricing support"]
  },
  about: {
    variant: "about",
    eyebrow: "Luxury Fintech Brand",
    title: "A futuristic trading company built around trust.",
    description: "Exness Global blends institutional infrastructure, cinematic product design and AI intelligence for the next era of trading.",
    accent: "from-neonPurple via-neonBlue to-neonGreen",
    primaryCta: "Meet Exness Global",
    secondaryCta: "Security model",
    cards: [
      { title: "Traders served", text: "A global design vision for active traders, investors and professional desks.", metric: "20M+" },
      { title: "Countries", text: "Localized experiences, multi-language support and region-aware compliance.", metric: "180+" },
      { title: "Daily volume", text: "High-capacity trading architecture designed for serious scale.", metric: "$15B" },
      { title: "Uptime target", text: "Always-on market access with resilient infrastructure patterns.", metric: "99.99%" }
    ],
    highlights: ["Security-first product thinking", "AI analytics roadmap", "Global support desk", "Clear risk and legal communication"]
  },
  contact: {
    variant: "contact",
    eyebrow: "Contact Trading Desk",
    title: "Talk to support, sales or the onboarding team.",
    description: "Reach Exness Global for account setup, platform demos, pricing, support or institutional partnership conversations.",
    accent: "from-neonPink via-neonOrange to-neonGold",
    primaryCta: "Book Demo",
    secondaryCta: "Contact Support",
    cards: [
      { title: "Live chat", text: "Get fast help from the Exness AI desk and human support specialists.", metric: "24/7" },
      { title: "Email desk", text: "Send onboarding, pricing, support and compliance questions.", metric: "15m" },
      { title: "Phone support", text: "Priority voice support for Pro, Elite and VIP clients.", metric: "VIP" },
      { title: "Offices", text: "Global-ready contact surfaces for a premium fintech brand.", metric: "Global" }
    ],
    highlights: ["support@exnessglobal.example", "+1 888 EXNESS", "Demo onboarding sessions", "Institutional liquidity conversations"]
  }
};
