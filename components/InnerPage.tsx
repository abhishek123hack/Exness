"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Download,
  Globe2,
  Headphones,
  LineChart,
  LockKeyhole,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap
} from "lucide-react";
import type { PageData } from "@/lib/pageData";
import { SiteFooter } from "@/components/SiteFooter";

const platformDownloadUrl = "https://download.terminal.free/cdn/web/metaquotes.software.corp/mt5/metatrader5.apk?utm_source=mt5terminal&utm_campaign=install.metaquotes";

const navItems = [
  ["Home", "/"],
  ["Markets", "/markets"],
  ["Trade", "/trade"],
  ["Platforms", "/platforms"],
  ["Accounts", "/accounts"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

const iconMap = [TrendingUp, Zap, ShieldCheck, Bot, Globe2, Wallet, BarChart3, Headphones];

function TopNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3">
        <a href="/" className="flex items-center gap-3">
          <img src="/exness-global-logo.svg" alt="Exness Global" className="h-12 w-auto" />
        </a>
        <div className="hidden items-center gap-6 xl:flex">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="group relative text-sm font-semibold text-white/72 transition hover:text-white">
              {label}
              <span className="absolute -bottom-2 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-cyan-300 to-pink-400 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>
        <a href="/auth/signup" className="rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-5 py-2 text-sm font-black text-white shadow-pink-glow">
          Start
        </a>
      </nav>
    </header>
  );
}

function Button({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "ghost" }) {
  return (
    <motion.a
      href="/contact"
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={
        variant === "primary"
          ? "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-6 py-3 text-sm font-black text-white shadow-pink-glow"
          : "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-black text-white/90 backdrop-blur-xl hover:border-cyan-300/50"
      }
    >
      {children}
    </motion.a>
  );
}

function MarketVisual({ accent, variant }: { accent: string; variant: PageData["variant"] }) {
  if (variant === "platforms") {
    return (
      <div className="relative min-h-[480px]">
        {[0, 1, 2].map((item) => (
          <motion.div
            key={item}
            animate={{ y: [0, item % 2 ? 18 : -18, 0] }}
            transition={{ duration: 5 + item, repeat: Infinity }}
            className={`glass absolute rounded-[2rem] border border-white/10 p-4 shadow-glow ${item === 0 ? "left-0 top-16 h-72 w-56" : item === 1 ? "left-[34%] top-0 h-96 w-64" : "right-0 top-24 h-80 w-56"}`}
          >
            <div className={`h-full rounded-[1.5rem] bg-gradient-to-br ${accent} p-4 opacity-90`}>
              <div className="mb-5 h-3 w-20 rounded-full bg-white/50" />
              <div className="grid h-44 grid-cols-6 items-end gap-2">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span key={i} className="rounded-full bg-white/70" style={{ height: `${22 + ((i * 23 + item * 13) % 78)}%` }} />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (variant === "pricing" || variant === "accounts") {
    return (
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="gradient-border glass rounded-[2rem] p-5 shadow-pink-glow">
        <div className="grid gap-4">
          {["Starter", "Pro", "Elite", "VIP"].map((plan, index) => (
            <div key={plan} className={`rounded-3xl border border-white/10 p-5 ${index === 1 ? "bg-gradient-to-r from-pink-500/25 to-cyan-500/20" : "bg-white/8"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-black">{plan}</p>
                  <p className="text-sm text-white/50">{["$100 deposit", "$1K deposit", "$10K deposit", "$100K deposit"][index]}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-navy">{["1.4", "0.7", "0.2", "Raw"][index]} spread</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (variant === "about" || variant === "contact") {
    return (
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="gradient-border glass relative min-h-[430px] overflow-hidden rounded-[2rem] p-6 shadow-glow">
        <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-20`} />
        <div className="relative grid h-full place-items-center text-center">
          <div>
            <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-cyan-300 via-purple-500 to-pink-500 shadow-pink-glow">
              {variant === "contact" ? <MessageCircle className="h-11 w-11" /> : <Building2 className="h-11 w-11" />}
            </div>
            <h2 className="text-5xl font-black">{variant === "contact" ? "24/7 Desk" : "20M+ Traders"}</h2>
            <p className="mx-auto mt-4 max-w-sm text-white/62">{variant === "contact" ? "Support, sales, demos and institutional conversations." : "A global luxury fintech concept built for trust and speed."}</p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {["Secure", "Global", "AI"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/8 p-3 font-black">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="gradient-border glass relative min-h-[420px] overflow-hidden rounded-[2rem] p-5 shadow-glow">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-20`} />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Live command</p>
          <h2 className="mt-2 text-3xl font-black">$8.42B</h2>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-black text-emerald-300">+14.8%</span>
      </div>
      <div className="relative mt-10 h-56 rounded-3xl border border-white/10 bg-black/20 p-5">
        <svg viewBox="0 0 560 220" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="pageLine" x1="0" x2="1">
              <stop stopColor="#06B6D4" />
              <stop offset=".5" stopColor="#EC4899" />
              <stop offset="1" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <path d="M0 165 C65 118 102 148 152 88 S260 34 330 82 430 134 560 42" fill="none" stroke="url(#pageLine)" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-2">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className={i % 4 === 0 ? "w-3 rounded-full bg-pink-400" : "w-3 rounded-full bg-emerald-400"} style={{ height: `${30 + ((i * 19) % 120)}px` }} />
          ))}
        </div>
      </div>
      <div className="relative mt-5 grid grid-cols-3 gap-3">
        {["Spread", "Latency", "Liquidity"].map((label, i) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/8 p-3">
            <p className="text-xs text-white/50">{label}</p>
            <p className="font-black">{["0.1", "8ms", "Tier 1"][i]}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function VariantShowcase({ data }: { data: PageData }) {
  if (data.variant === "markets") {
    return (
      <section className="relative px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="glass rounded-[2rem] p-6">
            <p className="mb-4 text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Market Heatmap</p>
            <div className="grid grid-cols-4 gap-3">
              {["BTC", "ETH", "EUR", "XAU", "NQ", "AAPL", "SOL", "OIL", "TSLA", "JPY", "DAX", "GBP"].map((asset, i) => (
                <motion.div key={asset} whileHover={{ scale: 1.04 }} className={`rounded-2xl p-4 ${i % 5 === 0 ? "bg-pink-500/25" : "bg-emerald-400/18"}`}>
                  <p className="font-black">{asset}</p>
                  <p className={i % 5 === 0 ? "text-pink-300" : "text-emerald-300"}>{i % 5 === 0 ? "-0.8%" : "+2.1%"}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="gradient-border glass rounded-[2rem] p-6">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-pink-200">Top liquidity</p>
            {["BTC/USD", "EUR/USD", "NASDAQ", "GOLD"].map((item, index) => (
              <div key={item} className="mt-5 flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-black">{item}</span>
                <span className="text-cyan-200">{["$2.8B", "$1.9B", "$890M", "$620M"][index]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (data.variant === "trade") {
    return (
      <section className="relative px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {["Order Book", "Risk Console", "Bot Studio"].map((title, index) => (
            <div key={title} className="gradient-border glass rounded-[2rem] p-6">
              <p className="text-2xl font-black">{title}</p>
              <div className="mt-6 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-2xl bg-white/8 p-3">
                    <span>{index === 0 ? "Limit" : index === 1 ? "Margin" : "Signal"} {i + 1}</span>
                    <span className={i % 2 ? "text-pink-300" : "text-emerald-300"}>{i % 2 ? "Sell" : "Buy"}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (data.variant === "platforms") {
    return (
      <section className="relative px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-5">
          {["MT4", "MT5", "WebTrader", "Mobile", "AI Platform"].map((platform) => (
            <motion.div key={platform} whileHover={{ y: -8 }} className="glass rounded-[2rem] p-5 text-center">
              <div className={`mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${data.accent}`}>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-lg font-black text-blue-700">
                  {platform === "Mobile" ? "ðŸ“±" : platform === "AI Platform" ? "AI" : platform.replace("WebTrader", "W").replace("MT", "M")}
                </span>
              </div>
              <p className="text-xl font-black">{platform}</p>
              <p className="mt-2 text-sm text-white/55">Download-ready trading workspace.</p>
              <a href={platformDownloadUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold hover:border-cyan-300/60">
                <Download className="h-4 w-4" /> Download
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  if (data.variant === "accounts" || data.variant === "pricing") {
    return (
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10">
          {["Starter", "Pro", "Elite", "VIP"].map((tier, index) => (
            <div key={tier} className={`grid gap-4 border-b border-white/10 p-5 md:grid-cols-4 ${index === 1 ? "bg-gradient-to-r from-cyan-500/12 to-pink-500/14" : "bg-white/[0.03]"}`}>
              <strong>{tier}</strong>
              <span className="text-white/60">Deposit {["$100", "$1,000", "$10,000", "$100,000"][index]}</span>
              <span className="text-white/60">Spread {["1.4", "0.7", "0.2", "Raw"][index]}</span>
              <span className="font-black text-cyan-200">{index === 1 ? "Most Popular" : "Available"}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (data.variant === "about") {
    return (
      <section className="relative px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {["Security-first infrastructure", "AI-powered trader intelligence", "Global premium support"].map((title, index) => (
            <div key={title} className="glass rounded-[2rem] p-6">
              <p className="mb-5 text-6xl font-black text-white/10">0{index + 1}</p>
              <h3 className="text-2xl font-black">{title}</h3>
              <p className="mt-3 text-white/58">A luxury fintech experience designed for confidence, speed and serious market focus.</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-4 py-20">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        {[
          ["Email", "support@exnessglobal.example", Mail],
          ["Phone", "+1 888 EXNESS", Phone],
          ["Office", "Global trading desk", MapPin]
        ].map(([label, value, Icon]) => (
          <div key={label as string} className="gradient-border glass rounded-[2rem] p-6">
            <Icon className="mb-6 h-9 w-9 text-cyan-200" />
            <p className="text-xl font-black">{label as string}</p>
            <p className="mt-2 text-white/58">{value as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InnerPage({ data }: { data: PageData }) {
  return (
    <main className="site-light relative min-h-screen overflow-hidden bg-white text-slate-950">
      <div className="aurora pointer-events-none fixed inset-0 animate-aurora opacity-80 blur-3xl" />
      <div className="grid-bg pointer-events-none fixed inset-0 animate-grid opacity-20" />
      <TopNav />

      <section className="relative px-4 pb-20 pt-36 md:pt-44">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.9fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-green-glow" />
              {data.eyebrow}
            </div>
            <h1 className="max-w-4xl bg-gradient-to-r from-white via-cyan-200 to-pink-300 bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-5xl md:text-6xl xl:text-7xl">
              {data.title}
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-white/68">{data.description}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button>
                <Rocket className="h-4 w-4" /> {data.primaryCta}
              </Button>
              <Button variant="ghost">
                {data.secondaryCta} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
          <MarketVisual accent={data.accent} variant={data.variant} />
        </div>
      </section>

      <VariantShowcase data={data} />

      <section className="relative px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {data.cards.map((card, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="gradient-border glass rounded-3xl p-6"
              >
                <div className={`mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${data.accent} shadow-glow`}>
                  <Icon className="h-7 w-7" />
                </div>
                <p className="text-3xl font-black text-cyan-100">{card.metric}</p>
                <h3 className="mt-4 text-xl font-black">{card.title}</h3>
                <p className="mt-3 leading-7 text-white/60">{card.text}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="relative px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-300">Platform Depth</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">Designed for professional momentum.</h2>
          </div>
          <div className="grid gap-4">
            {data.highlights.map((item, index) => (
              <motion.div key={item} whileHover={{ x: 6 }} className="glass flex items-center gap-4 rounded-2xl p-4">
                <span className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${data.accent}`}>
                  <Check className="h-5 w-5" />
                </span>
                <strong>{item}</strong>
                <ChevronRight className="ml-auto h-5 w-5 text-white/35" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24">
        <div className="gradient-border glass mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-10 md:p-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_.8fr]">
            <div>
              <h2 className="text-4xl font-black leading-tight md:text-6xl">Build your trading edge with Exness Global.</h2>
              <p className="mt-5 text-lg text-white/62">Open an account, book a platform walkthrough, or launch a demo workspace today.</p>
            </div>
            <div className="flex flex-wrap justify-start gap-4 lg:justify-end">
              <a href="/auth/signup" className="rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-6 py-3 text-sm font-black text-white shadow-pink-glow">Open Account</a>
              <a href="/auth/signup" className="rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-black text-white/90">Try Demo</a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

export const contactIcons = { Mail, Phone, MapPin, MessageCircle, Building2, LockKeyhole, Clock3, LineChart, CircleDollarSign, Smartphone, Download };
