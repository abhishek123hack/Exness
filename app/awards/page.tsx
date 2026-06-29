import { Award, BadgeCheck, Crown, Gem, HelpCircle, Medal, ShieldCheck, Sparkles, Star, Trophy } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata = {
  title: "Awards | Exness Global",
  description: "Exness Global awards, industry recognition, product excellence and global broker achievements."
};

const latestAwards = [
  {
    title: "5 Star Trading App",
    body: "Investors Chronicle & Financial Times Awards",
    icon: Star,
    gradient: "from-neonBlue to-neonCyan"
  },
  {
    title: "Best Multi-Asset Platform",
    body: "Global Fintech Experience Awards",
    icon: Trophy,
    gradient: "from-neonPurple to-neonPink"
  },
  {
    title: "Best AI Trading Tools",
    body: "Digital Markets Innovation Awards",
    icon: Sparkles,
    gradient: "from-neonGold to-neonOrange"
  }
];

const stats = [
  ["140+", "Awards Won"],
  ["35+", "Unique Awarding Bodies"],
  ["78+", "Different Types of Awards"]
];

const categories = [
  ["Platform Excellence", "Recognition for WebTrader, mobile app usability, execution tools and premium dashboard design.", Gem],
  ["Client Experience", "Awards focused on support quality, onboarding, education and transparent trader journeys.", BadgeCheck],
  ["Trading Conditions", "Recognition for spreads, execution quality, liquidity access and account tier innovation.", ShieldCheck],
  ["Brand Leadership", "Global fintech accolades for product vision, trust, speed and professional market access.", Crown]
];

export default function AwardsPage() {
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
            <a href="/about" className="hover:text-cyan-200">Company</a>
            <a href="/about/licences" className="hover:text-cyan-200">Licences</a>
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
          <span className="text-white">Awards</span>
        </div>
      </section>

      <section className="relative px-4 pb-20 pt-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_.9fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100">
              <Medal className="h-4 w-4" />
              Celebrating excellence
            </div>
            <h1 className="max-w-5xl bg-gradient-to-r from-white via-cyan-200 to-pink-300 bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-5xl md:text-6xl xl:text-7xl">
              Our Journey to Becoming a World-Class Broker
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-8 text-white/66">
              Industry recognition for product innovation, trading conditions, platform design, education, support and premium client experience.
            </p>
          </div>

          <div className="gradient-border glass relative min-h-[460px] overflow-hidden rounded-[2rem] p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/15 via-pink-500/12 to-cyan-400/15" />
            <div className="relative grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto mb-6 grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-pink-500 shadow-pink-glow">
                  <Trophy className="h-16 w-16" />
                </div>
                <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-100">Latest Award</p>
                <h2 className="mt-4 text-4xl font-black">5 Star App</h2>
                <p className="mt-3 text-white/58">Investors Chronicle & Financial Times Awards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {latestAwards.map((award) => {
            const Icon = award.icon;
            return (
              <article key={award.title} className="gradient-border glass rounded-[2rem] p-6">
                <div className={`mb-6 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br ${award.gradient} shadow-glow`}>
                  <Icon className="h-10 w-10" />
                </div>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Latest Award</p>
                <h3 className="text-2xl font-black">{award.title}</h3>
                <p className="mt-3 leading-7 text-white/58">{award.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_.85fr]">
          <div>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">
              At Exness Global, we are not just participating in the world of trading. We are leading it.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/62">
              With over 140 sample industry awards represented in this design, our commitment to premium trading experiences is reflected through platform quality, speed, education and trust-first product thinking.
            </p>
          </div>
          <div className="grid gap-4">
            {stats.map(([value, label]) => (
              <div key={label} className="glass flex items-center justify-between rounded-3xl p-6">
                <span className="text-white/60">{label}</span>
                <strong className="bg-gradient-to-r from-cyan-200 to-pink-300 bg-clip-text text-5xl font-black text-transparent">{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map(([title, text, Icon]) => (
            <article key={title as string} className="glass rounded-[2rem] p-6">
              <Icon className="mb-6 h-10 w-10 text-amber-300" />
              <h3 className="text-xl font-black">{title as string}</h3>
              <p className="mt-3 leading-7 text-white/58">{text as string}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative px-4 py-16">
        <div className="gradient-border glass mx-auto max-w-7xl overflow-hidden rounded-[2rem] p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_.55fr]">
            <div>
              <Award className="mb-6 h-12 w-12 text-amber-300" />
              <p className="text-xl leading-9 text-white/75">
                We are immensely proud of every accolade represented here. Each recognition is a reminder to keep innovating, improving trader workflows and building with integrity.
              </p>
              <p className="mt-6 font-black text-cyan-200">Exness Global Team</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/8 p-6">
              <HelpCircle className="mb-5 h-10 w-10 text-cyan-200" />
              <h3 className="text-2xl font-black">Need Help?</h3>
              <p className="mt-3 text-white/58">Visit our support section or speak to the onboarding desk.</p>
              <a href="/contact" className="mt-6 inline-flex rounded-full bg-gradient-to-r from-neonBlue to-neonPink px-6 py-3 text-sm font-black text-white">
                Help Section
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-4 py-12">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm leading-7 text-white/52">
          <strong className="text-white">Important:</strong> This awards page is a design prototype inspired by public broker awards-page structures. Exness Global is a fictional brand here, and awards should be replaced with verified company achievements before production use.
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
