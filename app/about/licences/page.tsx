import { Award, BadgeCheck, Banknote, Building2, CheckCircle2, FileCheck2, Landmark, LockKeyhole, Scale, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Licenses & Regulation | Exness Global",
  description: "Exness Global licenses, regulation, professional memberships, fund protection and governance standards."
};

const regulators = [
  {
    name: "Financial Conduct Authority (FCA)",
    entity: "Exness Global UK Limited",
    detail: "Authorised and regulated for investment services under a UK compliance framework.",
    number: "Registration no. 509956",
    icon: Landmark,
    color: "from-neonBlue to-neonCyan"
  },
  {
    name: "Securities Commission of The Bahamas (SCB)",
    entity: "Exness Global Global Markets Limited",
    detail: "Regulated as a securities dealer for international market access and client servicing.",
    number: "Licence no. SIA-F184",
    icon: Scale,
    color: "from-neonPurple to-neonPink"
  },
  {
    name: "Financial Services Authority of Seychelles (FSA)",
    entity: "Exness Global International Ltd",
    detail: "Authorised as an investment dealer under an offshore financial services framework.",
    number: "Licence no. SD120",
    icon: Building2,
    color: "from-neonGreen to-neonCyan"
  }
];

const protections = [
  {
    title: "Mitigating Counterparty Risks",
    text: "Client exposure is monitored through internal limits, banking diversification and counterparty review processes.",
    icon: ShieldCheck
  },
  {
    title: "Balance Protection",
    text: "Eligible client accounts are designed with negative balance protection controls where required by policy and jurisdiction.",
    icon: BadgeCheck
  },
  {
    title: "Segregation of Funds",
    text: "Client funds are held separately from company operating funds and reconciled through controlled treasury procedures.",
    icon: Banknote
  },
  {
    title: "Investor Protection",
    text: "Applicable investor compensation and dispute frameworks depend on client classification and registered entity.",
    icon: LockKeyhole
  }
];

export default function LicencesPage() {
  return (
    <main className="site-light relative min-h-screen overflow-hidden bg-white text-slate-950">
      <div className="aurora pointer-events-none fixed inset-0 animate-aurora opacity-70 blur-3xl" />
      <div className="grid-bg pointer-events-none fixed inset-0 animate-grid opacity-20" />

      <header className="relative border-b border-white/10 bg-black/20 px-4 py-5 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <a href="/" className="bg-gradient-to-r from-cyan-200 via-white to-pink-300 bg-clip-text text-2xl font-black text-transparent">
            Exness Global
          </a>
          <div className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            <a href="/about" className="hover:text-cyan-200">About</a>
            <a href="/markets" className="hover:text-cyan-200">Markets</a>
            <a href="/auth/signup" className="rounded-full bg-gradient-to-r from-neonBlue to-neonPink px-5 py-2 font-black text-white">Register</a>
          </div>
        </nav>
      </header>

      <section className="relative px-4 py-8">
        <div className="mx-auto max-w-7xl text-sm text-white/55">
          <a href="/" className="hover:text-cyan-200">Home</a>
          <span className="mx-3">/</span>
          <a href="/about" className="hover:text-cyan-200">About Exness Global</a>
          <span className="mx-3">/</span>
          <span className="text-white">Licenses & Regulation</span>
        </div>
      </section>

      <section className="relative px-4 pb-16 pt-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_.8fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
              <CheckCircle2 className="h-4 w-4" />
              Governance, protection and professional memberships
            </div>
            <h1 className="max-w-5xl bg-gradient-to-r from-white via-cyan-200 to-pink-300 bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-5xl md:text-6xl xl:text-7xl">
              Licences, Regulation and Professional Memberships
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-white/66">
              A globally focused trading brand built around compliance controls, transparent governance, client-fund safeguards and professional operating standards.
            </p>
          </div>
          <div className="gradient-border glass rounded-[2rem] p-6">
            <div className="grid gap-4">
              {["Regulated entities", "Client fund controls", "Counterparty monitoring", "Security governance"].map((item, index) => (
                <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/8 p-4">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-pink-500">
                    <FileCheck2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-black">{item}</p>
                    <p className="text-sm text-white/48">Compliance layer 0{index + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-4xl font-black">Regulatory Oversight</h2>
          <div className="grid gap-5 lg:grid-cols-3">
            {regulators.map((regulator) => {
              const Icon = regulator.icon;
              return (
                <article key={regulator.name} className="gradient-border glass rounded-[2rem] p-6">
                  <div className={`mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${regulator.color} shadow-glow`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black">{regulator.name}</h3>
                  <p className="mt-4 font-bold text-cyan-100">{regulator.entity}</p>
                  <p className="mt-3 leading-7 text-white/60">{regulator.detail}</p>
                  <p className="mt-5 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-black text-white/80">{regulator.number}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-cyan-300">Protecting Client Funds</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">Controls designed around trust.</h2>
            <p className="mt-5 leading-7 text-white/58">
              As a regulated-style trading platform concept, Exness Global presents client protection, treasury separation and risk governance as visible parts of the product experience.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {protections.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="glass rounded-3xl p-6">
                  <Icon className="mb-5 h-9 w-9 text-cyan-200" />
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="mt-3 leading-7 text-white/58">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="gradient-border glass mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_.9fr]">
            <div>
              <Award className="mb-6 h-12 w-12 text-amber-300" />
              <h2 className="text-4xl font-black leading-tight md:text-6xl">Reliable, secure and fast trading platforms.</h2>
              <p className="mt-5 text-lg leading-8 text-white/62">
                Exness Global combines premium trading interfaces with a client-centric operating model focused on fair execution, transparency and professional conditions.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <a href="/accounts" className="rounded-full bg-gradient-to-r from-neonBlue via-neonPurple to-neonPink px-7 py-4 text-sm font-black text-white shadow-pink-glow">Start Trading Now</a>
              <a href="/trade" className="rounded-full border border-white/15 bg-white/8 px-7 py-4 text-sm font-black text-white/90">Try Demo Account</a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm leading-7 text-white/52">
          <strong className="text-white">Important:</strong> This page is a website design prototype inspired by common broker licence-page layouts. Exness Global is a fictional brand here, and the displayed licence numbers are sample content unless replaced with verified company records.
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
