"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Apple,
  BadgeDollarSign,
  Bot,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Download,
  Headphones,
  LockKeyhole,
  Menu,
  MessageCircle,
  Moon,
  Play,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Sun,
  X,
  Zap
} from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Markets", href: "/markets" },
  { label: "Trade", href: "/trade" },
  { label: "Platforms", href: "/platforms" },
  { label: "Accounts", href: "/accounts" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" }
];

const markets = [
  { symbol: "BTC/USD", price: 68420, move: 2.84 },
  { symbol: "ETH/USD", price: 3720, move: 1.72 },
  { symbol: "EUR/USD", price: 1.0874, move: -0.18 },
  { symbol: "NASDAQ", price: 18424, move: 0.96 },
  { symbol: "GOLD", price: 2366, move: 1.21 },
  { symbol: "TSLA", price: 182.7, move: -1.08 },
  { symbol: "AAPL", price: 196.4, move: 0.54 }
];

const features = [
  ["Ultra Fast Execution", "Sub-12ms order routing through institutional liquidity rails.", Zap, "from-blue-500 to-cyan-400"],
  ["AI Market Analysis", "Predictive signals, volatility alerts and sentiment models.", BrainCircuit, "from-purple-500 to-pink-500"],
  ["Zero Hidden Fees", "Transparent spreads, no dealing desk games and clean reports.", BadgeDollarSign, "from-amber-400 to-orange-500"],
  ["Advanced Security", "Cold storage, passkeys, anomaly detection and account vaults.", ShieldCheck, "from-emerald-400 to-cyan-400"],
  ["Smart Trading Bots", "Deploy grid, DCA and signal bots with risk-aware automation.", Bot, "from-fuchsia-500 to-blue-500"],
  ["24/7 Expert Support", "Human desk support for active traders across every market.", Headphones, "from-orange-500 to-pink-500"]
];

const platforms = ["MT4", "MT5", "WebTrader", "Mobile App", "AI Trading Platform"];
const platformDownloadUrl = "https://download.terminal.free/cdn/web/metaquotes.software.corp/mt5/metatrader5.apk?utm_source=mt5terminal&utm_campaign=install.metaquotes";
const stats = [
  ["20M+", "Traders"],
  ["180+", "Countries"],
  ["$15B", "Daily Volume"],
  ["99.99%", "Uptime"]
];

const plans = [
  ["Starter", "$50", "1.4 pips", "1:100", "Standard", false],
  ["Pro", "$1,000", "0.7 pips", "1:300", "Priority", true],
  ["Elite", "$10,000", "0.2 pips", "1:500", "Dedicated"],
  ["VIP", "$100,000", "Raw", "Custom", "Private desk"]
];

const testimonials = [
  ["Maya Chen", "Crypto strategist", "+$48.2K", "Execution quality feels institutional, but the product is beautifully simple."],
  ["Arjun Mehta", "FX portfolio lead", "+31.6%", "The AI alerts caught three major volatility shifts before my old stack reacted."],
  ["Sofia Alvarez", "Equity swing trader", "+$112K", "Mobile, web and desktop all feel like one premium command center."]
];

const faqs = [
  ["Is trading secure?", "Yes. Exness Global uses passkeys, encrypted vaults, cold storage architecture and real-time fraud monitoring."],
  ["Minimum deposit?", "Starter accounts begin at $50, with higher tiers unlocking tighter spreads, more analytics and priority support."],
  ["Withdrawal time?", "Most card and crypto withdrawals are processed within minutes after security checks. Bank transfers vary by region."],
  ["Regulation?", "The design includes a compliance-ready legal area, risk disclaimer, KYC flows and jurisdiction-aware account controls."],
  ["Demo account availability?", "Yes. Users can launch a funded demo workspace with simulated forex, crypto and stock liquidity."]
];

const news = [
  ["Market Pulse", "AI detects rising BTC volatility before Asia open", "2 min read"],
  ["Macro Desk", "Gold liquidity deepens as rate-cut odds reprice", "4 min read"],
  ["Platform", "New cross-margin controls roll out for Pro traders", "3 min read"]
];

function Button({ children, variant = "primary", onClick }: { children: React.ReactNode; variant?: "primary" | "ghost"; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={
        variant === "primary"
          ? "rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-6 py-3 text-sm font-bold text-white shadow-pink-glow"
          : "rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-bold text-white/90 backdrop-blur-xl hover:border-cyan-300/50 hover:shadow-glow"
      }
    >
      {children}
    </motion.button>
  );
}

function useLivePrices() {
  const [prices, setPrices] = useState(markets);
  useEffect(() => {
    const id = setInterval(() => {
      setPrices((current) =>
        current.map((item) => {
          const delta = (Math.random() - 0.46) * (item.price > 1000 ? 38 : item.price > 100 ? 0.9 : 0.005);
          return { ...item, price: Math.max(item.price + delta, 0.01), move: item.move + (Math.random() - 0.5) * 0.08 };
        })
      );
    }, 1700);
    return () => clearInterval(id);
  }, []);
  return prices;
}

function Navbar({ onAuth }: { onAuth: () => void }) {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 py-4">
      <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-4 py-3">
        <a href="#" className="flex items-center gap-3">
          <img src="/exness-global-logo.svg" alt="Exness Global" className="h-12 w-auto" />
        </a>
        <div className="hidden items-center gap-6 xl:flex">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="group relative text-sm font-semibold text-white/72 transition hover:text-white">
              {item.label}
              <span className="absolute -bottom-2 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-cyan-300 to-pink-400 transition-all group-hover:w-full" />
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 xl:flex">
          <button aria-label="Switch theme" onClick={() => setLight((v) => !v)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/8">
            {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button className="rounded-full px-5 py-2 text-sm font-bold text-white/80 hover:text-white" onClick={onAuth}>
            Login
          </button>
          <a href="/auth/signup" className="rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-6 py-3 text-sm font-bold text-white shadow-pink-glow">
            Sign Up
          </a>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-white/15 xl:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-navy/90 p-4 backdrop-blur-xl lg:hidden">
            <div className="glass rounded-3xl p-5">
              <div className="mb-6 flex items-center justify-between">
                <img src="/exness-global-logo.svg" alt="Exness Global" className="h-12 w-auto" />
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X />
                </button>
              </div>
              <div className="grid gap-4">
                {navItems.map((item) => (
                  <a onClick={() => setOpen(false)} key={item.label} href={item.href} className="rounded-2xl border border-white/10 p-4 font-semibold">
                    {item.label}
                  </a>
                ))}
              <a href="/auth/signup" className="rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-6 py-3 text-center text-sm font-bold text-white shadow-pink-glow">Open Account</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function HeroDashboard() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-220, 220], [9, -9]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-220, 220], [-9, 9]), { stiffness: 120, damping: 20 });
  const candles = [40, 76, 55, 92, 64, 120, 82, 145, 110, 168, 124, 188, 150, 210];

  return (
    <motion.div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative mx-auto max-w-xl"
    >
      <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }} className="gradient-border glass relative rounded-[2rem] p-4 shadow-glow">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-cyan-200/80">Portfolio equity</p>
              <h3 className="text-3xl font-black">$482,910.44</h3>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-300">+18.42%</span>
          </div>
          <div className="relative h-56 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-4">
            <svg viewBox="0 0 520 220" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="profit" x1="0" x2="1">
                  <stop stopColor="#06B6D4" />
                  <stop offset=".5" stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#10B981" />
                </linearGradient>
              </defs>
              <path d="M0 174 C70 130 105 158 155 100 S260 42 318 84 430 142 520 38" fill="none" stroke="url(#profit)" strokeWidth="5" strokeLinecap="round" />
              <path d="M0 174 C70 130 105 158 155 100 S260 42 318 84 430 142 520 38 L520 220 L0 220Z" fill="url(#profit)" opacity=".13" />
            </svg>
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-2">
              {candles.map((height, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 20 }}
                  whileInView={{ height }}
                  transition={{ delay: i * 0.04, type: "spring" }}
                  className={`w-4 rounded-full ${i % 3 === 0 ? "bg-pink-400" : "bg-emerald-400"} shadow-green-glow`}
                />
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["BTC Long", "EUR/USD", "AI Signal"].map((item, i) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/8 p-3">
                <p className="text-xs text-white/50">{item}</p>
                <p className={`font-black ${i === 1 ? "text-pink-300" : "text-emerald-300"}`}>{i === 1 ? "-0.18%" : "+2.8%"}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.div animate={{ y: [0, 18, 0], x: [0, 8, 0] }} transition={{ duration: 6, repeat: Infinity }} className="glass absolute -left-6 top-20 hidden rounded-2xl p-4 shadow-pink-glow sm:block">
        <CircleDollarSign className="mb-2 h-6 w-6 text-amber-300" />
        <p className="text-xs text-white/55">Daily PnL</p>
        <p className="text-xl font-black text-emerald-300">+$12,480</p>
      </motion.div>
      <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 7, repeat: Infinity }} className="glass absolute -right-4 bottom-16 hidden rounded-2xl p-4 sm:block">
        <p className="text-xs text-white/55">Smart risk</p>
        <p className="font-black text-cyan-200">Low exposure</p>
      </motion.div>
    </motion.div>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
      <h2 className="bg-gradient-to-r from-white via-cyan-100 to-pink-200 bg-clip-text text-4xl font-black text-transparent md:text-6xl">{title}</h2>
      {text && <p className="mt-5 text-lg text-white/62">{text}</p>}
    </div>
  );
}

function Ticker({ prices }: { prices: typeof markets }) {
  const loop = [...prices, ...prices];
  return (
    <section id="markets" className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-5">
      <div className="flex w-max animate-ticker gap-4">
        {loop.map((item, index) => (
          <div key={`${item.symbol}-${index}`} className="glass flex min-w-56 items-center justify-between rounded-2xl px-5 py-3">
            <div>
              <p className="font-black">{item.symbol}</p>
              <p className="text-sm text-white/55">{item.price > 10 ? item.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : item.price.toFixed(4)}</p>
            </div>
            <span className={item.move >= 0 ? "font-black text-emerald-300" : "font-black text-pink-300"}>
              {item.move >= 0 ? "+" : ""}
              {item.move.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.button whileHover={{ scale: 1.06 }} onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 shadow-pink-glow" aria-label="Open AI chatbot">
        <MessageCircle />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.aside initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="glass fixed bottom-24 right-5 z-40 w-[calc(100vw-2.5rem)] max-w-sm rounded-3xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-black">Exness AI Desk</p>
                <p className="text-xs text-emerald-300">Online</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chatbot">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <p className="rounded-2xl bg-white/10 p-3">Ask me for spread comparisons, platform guidance, or a demo trading plan.</p>
              <p className="ml-8 rounded-2xl bg-gradient-to-r from-blue-500/45 to-pink-500/45 p-3">Show strongest crypto momentum today.</p>
              <p className="rounded-2xl bg-white/10 p-3">BTC and ETH are leading. Consider alerts near breakout liquidity zones.</p>
            </div>
            <div className="mt-4 flex rounded-full border border-white/10 bg-black/20 p-2">
              <input aria-label="Chat message" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Ask Exness AI..." />
              <button className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-black text-navy">Send</button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-lg">
          <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }} className="gradient-border glass w-full max-w-md rounded-3xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black">Access Exness Global</h2>
                <p className="text-sm text-white/55">Login or register in seconds.</p>
              </div>
              <button onClick={onClose} aria-label="Close auth modal">
                <X />
              </button>
            </div>
            <div className="grid gap-3">
              <input className="rounded-2xl border border-white/10 bg-white/8 p-4 outline-none focus:border-cyan-300" placeholder="Email address" />
              <input className="rounded-2xl border border-white/10 bg-white/8 p-4 outline-none focus:border-pink-300" placeholder="Password" type="password" />
              <Button>Continue Securely</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Home() {
  const prices = useLivePrices();
  const [authOpen, setAuthOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(0);
  const [loading, setLoading] = useState(true);
  const languages = useMemo(() => ["EN", "ES", "AR", "HI"], []);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="site-light relative min-h-screen overflow-hidden bg-white text-slate-950">
      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-navy" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <motion.div animate={{ scale: [1, 1.12, 1], rotate: [0, 4, -4, 0] }} transition={{ repeat: Infinity, duration: 1.4 }} className="text-center">
              <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-pink-glow">
                <Sparkles className="h-9 w-9" />
              </div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-200">Loading markets</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="aurora pointer-events-none fixed inset-0 animate-aurora opacity-80 blur-3xl" />
      <div className="grid-bg pointer-events-none fixed inset-0 animate-grid opacity-20" />
      <Navbar onAuth={() => { window.location.href = "/auth/login"; }} />

      <section id="home" className="relative min-h-screen overflow-hidden px-4 pb-20 pt-36 md:pt-44">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_.9fr]">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-green-glow" />
              AI-powered global trading infrastructure
            </div>
            <h1 className="max-w-5xl bg-gradient-to-r from-white via-cyan-200 via-45% to-pink-300 bg-clip-text text-5xl font-black leading-tight text-transparent sm:text-6xl md:text-7xl xl:text-8xl">
              Trade The Future of Finance
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-8 text-white/68">
              Professional forex, crypto, and stock trading with lightning-fast execution and AI-powered analytics.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="/auth/signup" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-6 py-3 text-sm font-bold text-white shadow-pink-glow">
                <Rocket className="h-4 w-4" /> Start Trading
              </a>
              <Button variant="ghost">
                <span className="inline-flex items-center gap-2">
                  <Play className="h-4 w-4" /> Watch Demo
                </span>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {languages.map((lang) => (
                <button key={lang} className="rounded-full border border-white/10 bg-white/7 px-4 py-2 text-xs font-black text-white/70 hover:border-cyan-300/50">
                  {lang}
                </button>
              ))}
            </div>
          </motion.div>
          <HeroDashboard />
        </div>
      </section>

      <Ticker prices={prices} />

      <section id="trade" className="relative px-4 py-24">
        <SectionTitle eyebrow="Professional Edge" title="Everything serious traders expect" text="Execution, intelligence, security and support wrapped in a cinematic command center." />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map(([title, text, Icon, gradient], index) => (
            <motion.article key={title as string} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} whileHover={{ y: -8 }} className="gradient-border glass rounded-3xl p-6">
              <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3 + index * 0.2, repeat: Infinity }} className={`mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${gradient as string} shadow-glow`}>
                <Icon className="h-7 w-7" />
              </motion.div>
              <h3 className="text-2xl font-black">{title as string}</h3>
              <p className="mt-3 leading-7 text-white/60">{text as string}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="platforms" className="relative overflow-hidden px-4 py-24">
        <div className="aurora absolute inset-0 opacity-25 blur-3xl" />
        <div className="grid-bg absolute inset-0 opacity-20" />
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.45em] text-blue-600">Platforms</p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-slate-950 md:text-6xl">One ecosystem. Every trading style.</h2>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mx-auto mt-14 min-h-[420px] max-w-5xl">
            <div className="absolute left-1/2 top-0 w-[62%] -translate-x-1/2 rounded-t-[1.4rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
              <div className="h-7 rounded-t-xl bg-slate-100">
                <div className="mx-auto h-4 w-28 rounded-b-xl bg-slate-900" />
              </div>
              <div className="h-[310px] border border-slate-700 bg-black p-4">
                <div className="grid h-full grid-cols-[86px_1fr] gap-3">
                  <div className="space-y-1 overflow-hidden rounded bg-slate-950 p-2 text-[8px]">
                    {["EURUSD", "GBPUSD", "USDJPY", "XAUUSD", "BTCUSD", "US30", "NAS100", "USOIL", "ETHUSD", "AUDUSD"].map((pair, i) => (
                      <div key={pair} className="flex justify-between gap-2"><span className="text-slate-300">{pair}</span><span className={i % 3 ? "text-emerald-400" : "text-red-400"}>{(1.102 + i / 100).toFixed(4)}</span></div>
                    ))}
                  </div>
                  <div className="relative overflow-hidden rounded border border-slate-700 bg-[linear-gradient(#1f2937_1px,transparent_1px),linear-gradient(90deg,#1f2937_1px,transparent_1px)] bg-[length:24px_24px] p-4">
                    <svg viewBox="0 0 520 250" className="absolute inset-0 h-full w-full">
                      <path d="M18 206 C80 148 108 178 160 112 S244 66 306 105 410 156 500 52" fill="none" stroke="#22c55e" strokeWidth="4" />
                      {Array.from({ length: 22 }).map((_, i) => {
                        const x = 28 + i * 22;
                        const y = 60 + ((i * 37) % 120);
                        const up = i % 3 !== 0;
                        return <g key={i}><line x1={x + 5} y1={y - 18} x2={x + 5} y2={y + 34} stroke={up ? "#22c55e" : "#ef4444"} strokeWidth="2" /><rect x={x} y={up ? y : y - 5} width="10" height={up ? 32 : 24} rx="2" fill={up ? "#22c55e" : "#ef4444"} /></g>;
                      })}
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mx-auto h-5 w-[82%] rounded-b-2xl bg-gradient-to-b from-slate-400 to-slate-700" />
            </div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-8 left-[21%] w-[190px] rounded-[2rem] border-[8px] border-slate-950 bg-slate-950 shadow-2xl">
              <div className="mx-auto h-5 w-20 rounded-b-xl bg-black" />
              <div className="h-[270px] rounded-[1.4rem] bg-[#101318] p-3 text-white">
                <div className="mb-3 flex items-center justify-between text-[10px]"><span>GOLD</span><span className="text-red-400">-0.24%</span></div>
                <div className="relative h-44 rounded border border-white/10 bg-black/40">
                  <svg viewBox="0 0 180 170" className="h-full w-full">
                    <path d="M18 35 L44 72 L70 62 L96 118 L124 96 L158 135" fill="none" stroke="#2563eb" strokeWidth="3" />
                    <path d="M18 28 L44 58 L70 52 L96 100 L124 86 L158 112" fill="none" stroke="#ef4444" strokeWidth="3" />
                    {Array.from({ length: 18 }).map((_, i) => <rect key={i} x={10 + i * 9} y={130 - ((i * 13) % 35)} width="5" height={25 + ((i * 7) % 34)} fill={i % 2 ? "#ef4444" : "#2563eb"} opacity=".75" />)}
                  </svg>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-bold"><span className="rounded bg-red-500 py-2">Sell 1920.40</span><span className="rounded bg-blue-500 py-2">Buy 1920.48</span></div>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute bottom-10 right-[13%] w-[245px] rounded-[1.5rem] border-[8px] border-slate-900 bg-white shadow-2xl">
              <div className="flex h-8 items-center justify-between border-b border-slate-200 px-3 text-[10px] font-bold"><span>XTSLA</span><span className="text-slate-400">Save</span></div>
              <div className="h-[245px] p-3">
                <svg viewBox="0 0 230 230" className="h-full w-full">
                  <path d="M16 190 C54 152 70 176 96 104 S150 54 206 28" fill="none" stroke="#14b8a6" strokeWidth="4" />
                  {Array.from({ length: 14 }).map((_, i) => {
                    const x = 20 + i * 14;
                    const h = 34 + ((i * 21) % 88);
                    const up = i % 2 === 0;
                    return <g key={i}><rect x={x} y={148 - h} width="10" height={h} rx="2" fill={up ? "#10b981" : "#ef4444"} /><rect x={x} y={182 - ((i * 9) % 40)} width="10" height={18 + ((i * 11) % 34)} fill={up ? "#99f6e4" : "#fecaca"} /></g>;
                  })}
                  <text x="18" y="176" fontSize="10" fontWeight="800" fill="#111827">TradingView</text>
                </svg>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative mx-auto mt-10 grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["EG", "Exness Trading Platform", "Level up with our products", "bg-red-600 text-white"],
              ["TV", "TradingView", "Industry's most popular", "bg-slate-200 text-black"],
              ["4", "MetaTrader 4", "The popular, classic solution", "bg-gradient-to-br from-yellow-300 via-blue-500 to-green-500 text-white"],
              ["5", "MetaTrader 5", "A step-up in trading functions", "bg-gradient-to-br from-yellow-300 via-blue-500 to-green-500 text-white"],
              ["c", "cTrader", "A seamless experience", "bg-red-500 text-white"]
            ].map(([mark, name, text, style]) => (
              <a key={name} href={platformDownloadUrl} target="_blank" rel="noreferrer" className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur transition hover:border-cyan-300/50 hover:bg-white/10">
                <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-xl font-black shadow-lg ${style}`}>{mark}</span>
                <span>
                  <span className="block text-lg font-black leading-tight">{name}</span>
                  <span className="mt-1 block text-sm text-white/55">{text}</span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">
          {stats.map(([value, label], index) => (
            <motion.div key={label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="glass rounded-3xl p-8 text-center">
              <p className="bg-gradient-to-r from-cyan-200 to-pink-300 bg-clip-text text-5xl font-black text-transparent">{value}</p>
              <p className="mt-2 font-bold text-white/60">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative px-4 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-white/10 bg-[url('https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center shadow-glow">
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
            {["BTC", "ETH", "XAU"].map((coin, i) => (
              <motion.div key={coin} animate={{ y: [0, -22, 0], x: [0, i * 8, 0] }} transition={{ duration: 4 + i, repeat: Infinity }} className="glass absolute rounded-full px-5 py-3 font-black" style={{ left: `${14 + i * 25}%`, top: `${18 + i * 16}%` }}>
                {coin}
              </motion.div>
            ))}
          </div>
          <div>
            <SectionTitle eyebrow="Why Choose Us" title="Built for speed, trust and serious scale" />
            <div className="grid gap-4">
              {["Security badges and institutional custody", "Deep liquidity across forex, crypto and equities", "AI tools with real-time analytics", "Fast withdrawals with smart risk checks"].map((item) => (
                <motion.div key={item} whileHover={{ x: 6 }} className="glass flex items-center gap-4 rounded-2xl p-4">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <Check className="h-5 w-5" />
                  </span>
                  <strong>{item}</strong>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="relative px-4 py-24">
        <SectionTitle eyebrow="Accounts" title="Premium pricing for every ambition" />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {plans.map(([name, deposit, spread, leverage, support, popular]) => (
            <motion.article key={name as string} whileHover={{ y: -12 }} className={`gradient-border glass relative rounded-3xl p-6 ${popular ? "shadow-pink-glow" : ""}`}>
              {popular && <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-amber-300 to-pink-400 px-3 py-1 text-xs font-black text-navy">Most Popular</span>}
              <h3 className="text-2xl font-black">{name as string}</h3>
              <p className="mt-5 text-sm text-white/55">Deposit</p>
              <p className="text-4xl font-black">{deposit as string}</p>
              <div className="mt-6 space-y-3 text-sm text-white/70">
                <p>Spread: <strong className="text-white">{spread as string}</strong></p>
                <p>Leverage: <strong className="text-white">{leverage as string}</strong></p>
                <p>Support: <strong className="text-white">{support as string}</strong></p>
              </div>
              <button className="mt-7 w-full rounded-full bg-white px-5 py-3 font-black text-navy">Choose Plan</button>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden px-4 py-24">
        <div className="aurora absolute inset-0 animate-aurora opacity-60 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-300">Mobile App</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">Trade anywhere with cinematic speed.</h2>
            <p className="mt-5 text-lg text-white/62">iOS and Android apps with alerts, biometric login, live positions and AI trade briefs.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="ghost"><Apple className="mr-2 inline h-4 w-4" /> App Store</Button>
              <Button variant="ghost"><Smartphone className="mr-2 inline h-4 w-4" /> Google Play</Button>
            </div>
          </div>
          <div className="relative h-[560px]">
            {[0, 1].map((i) => (
              <motion.div key={i} animate={{ y: [0, i ? 18 : -18, 0] }} transition={{ duration: 5 + i, repeat: Infinity }} className="glass absolute top-8 h-[500px] w-64 rounded-[2.5rem] border-8 border-black/60 p-4 shadow-glow" style={{ left: i ? "45%" : "14%", rotate: i ? 8 : -7 }}>
                <div className="mx-auto mb-5 h-5 w-24 rounded-full bg-black/50" />
                <div className="rounded-3xl bg-gradient-to-br from-cyan-400/35 to-pink-500/25 p-4">
                  <p className="text-xs text-white/60">Equity</p>
                  <p className="text-3xl font-black">$91,240</p>
                </div>
                <div className="mt-4 space-y-3">
                  {prices.slice(0, 4).map((p) => (
                    <div key={p.symbol} className="flex items-center justify-between rounded-2xl bg-white/8 p-3 text-sm">
                      <span>{p.symbol}</span>
                      <span className={p.move > 0 ? "text-emerald-300" : "text-pink-300"}>{p.move.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24">
        <SectionTitle eyebrow="TradingView + Calendar + News" title="Market intelligence built in" />
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1.4fr_.8fr]">
          <div className="glass min-h-[460px] overflow-hidden rounded-3xl">
            <iframe title="TradingView chart" src="https://s.tradingview.com/widgetembed/?symbol=BINANCE:BTCUSDT&interval=60&theme=dark&style=1&hideideas=1" className="h-[460px] w-full border-0" />
          </div>
          <div className="grid gap-5">
            <div className="glass rounded-3xl p-6">
              <div className="mb-4 flex items-center gap-3">
                <CalendarDays className="text-amber-300" />
                <h3 className="text-xl font-black">Economic Calendar</h3>
              </div>
              {["US CPI", "ECB Rate Decision", "NFP Jobs Report"].map((event, i) => (
                <div key={event} className="flex justify-between border-t border-white/10 py-4">
                  <span>{event}</span>
                  <strong className="text-cyan-200">{i === 0 ? "High" : "Medium"}</strong>
                </div>
              ))}
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="mb-4 text-xl font-black">Blog & News</h3>
              {news.map(([tag, title, read]) => (
                <article key={title} className="border-t border-white/10 py-4">
                  <p className="text-xs font-black uppercase tracking-widest text-pink-300">{tag}</p>
                  <h4 className="font-bold">{title}</h4>
                  <p className="text-sm text-white/50">{read}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-24">
        <SectionTitle eyebrow="Testimonials" title="Loved by high-performance traders" />
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          {testimonials.map(([name, role, profit, quote], i) => (
            <motion.article key={name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass rounded-3xl p-6">
              <img className="mb-5 h-16 w-16 rounded-full object-cover" alt={name} src={`https://images.unsplash.com/photo-${["1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d", "1534528741775-53994a69daeb"][i]}?auto=format&fit=crop&w=160&q=80`} />
              <div className="mb-3 flex text-amber-300">{Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}</div>
              <p className="text-white/70">"{quote}"</p>
              <div className="mt-5 flex items-end justify-between">
                <div><strong>{name}</strong><p className="text-sm text-white/50">{role}</p></div>
                <span className="text-xl font-black text-emerald-300">{profit}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative px-4 py-24">
        <SectionTitle eyebrow="FAQ" title="Clear answers before you trade" />
        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map(([q, a], i) => (
            <div key={q} className="glass rounded-3xl">
              <button onClick={() => setFaqOpen(faqOpen === i ? -1 : i)} className="flex w-full items-center justify-between p-6 text-left font-black">
                {q}
                <ChevronDown className={`transition ${faqOpen === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {faqOpen === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden px-6 pb-6 text-white/62">{a}</motion.p>}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="relative px-4 py-24">
        <div className="gradient-border glass mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-10 text-center md:p-16">
          <div className="aurora absolute inset-0 animate-aurora opacity-60 blur-3xl" />
          <div className="relative">
            <h2 className="mx-auto max-w-4xl text-4xl font-black leading-tight md:text-6xl">Start Your Trading Journey Today</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/65">Open a live account or test every premium tool in a zero-risk demo workspace.</p>
            <div className="mt-9 flex justify-center gap-4">
              <a href="/auth/signup" className="rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-6 py-3 text-sm font-bold text-white shadow-pink-glow">Open Account</a>
              <a href="/auth/signup" className="rounded-full border border-white/15 bg-white/8 px-6 py-3 text-sm font-bold text-white/90 backdrop-blur-xl">Try Demo</a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />

      <Chatbot />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
}
