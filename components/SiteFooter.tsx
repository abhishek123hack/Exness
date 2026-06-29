"use client";

import { ChevronRight, Facebook, Instagram, Linkedin, Send, Twitter, Youtube } from "lucide-react";

const quickLinks = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Markets", "/markets"],
  ["Pricing", "/pricing"],
  ["Contact Us", "/contact"],
  ["Awards", "/awards"],
  ["Licenses & Regulation", "/about/licences"]
];

const moreLinks = [
  ["Open trading account", "/accounts"],
  ["Pricing model", "/pricing"],
  ["Funding & Withdrawals", "/accounts"],
  ["Trading platforms", "/platforms"],
  ["Platform comparison", "/platforms"],
  ["Exness Global Mobile App", "/platforms"],
  ["WebTrader", "/platforms"],
  ["TradingView", "/platforms"],
  ["MetaTrader 5", "/platforms"],
  ["MetaTrader 4", "/platforms"],
  ["Trading advantages", "/trade"]
];

const socialIcons = [Facebook, Twitter, Linkedin, Instagram, Youtube, Send];

function FooterTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <h3 className="text-2xl font-black text-white">{children}</h3>
      <div className="mt-3 flex items-center">
        <span className="h-0.5 w-24 bg-gradient-to-r from-cyan-300 to-neonGreen" />
        <span className="h-2.5 w-2.5 rounded-full border-2 border-neonGreen bg-navy" />
      </div>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="group flex items-start gap-3 text-white/62 transition hover:text-cyan-200">
      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 transition group-hover:translate-x-1" />
      <span>{children}</span>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-light-footer relative z-10 overflow-hidden border-t border-slate-200 bg-white text-slate-950">
      <div className="aurora absolute inset-0 opacity-30 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 xl:grid-cols-[1.15fr_.85fr_1.15fr_1fr]">
        <div>
          <a href="/" className="inline-flex items-center">
            <img src="/exness-global-logo.svg" alt="Exness Global" className="h-16 w-auto" />
          </a>
          <p className="mt-7 max-w-sm text-lg leading-8 text-white/58">
            We provide premium trading technology, market access, platform tools and support for modern global traders.
          </p>
          <p className="mt-4 font-black text-white/86"></p>
          <p className="mt-1 font-black text-white/86">Reg. Ref. - EXNESS-GLOBAL</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {socialIcons.map((Icon, index) => (
              <a key={index} href="#" aria-label="Social link" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white/60 transition hover:border-cyan-300 hover:text-cyan-200">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <FooterTitle>Quick Links</FooterTitle>
          <div className="grid gap-4">
            {quickLinks.map(([label, href]) => (
              <FooterLink key={label} href={href}>{label}</FooterLink>
            ))}
          </div>
        </div>

        <div>
          <FooterTitle>More Links</FooterTitle>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            {moreLinks.map(([label, href]) => (
              <FooterLink key={label} href={href}>{label}</FooterLink>
            ))}
          </div>
        </div>

        <div>
          <FooterTitle>Contact Us</FooterTitle>
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase text-white/45">Whatsapp Support</p>
              <a href="tel:9109108975" className="mt-1 block font-black text-white">9109108975</a>
            </div>
            <div>
              <p className="text-sm uppercase text-white/45">Email Address</p>
              <a href="mailto:support@exnessglobal.com" className="mt-1 block font-black text-white">support@exnessglobal.com</a>
            </div>
            <div>
              <p className="text-sm uppercase text-white/45">Office Location 1</p>
              <p className="mt-1 font-black leading-7 text-white">80 Coleman Street, EC2R 5BJ London, UK</p>
              <p className="mt-4 text-sm uppercase text-white/45">Office Location 2</p>
              <p className="mt-2 font-black leading-7 text-white">206 Udhog Bhawan, Vijaynagar, Bengaluru, Karnataka, India</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/20 px-4 py-5">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Exness Global. All rights reserved.</p>
          <p>Country • IN India</p>
        </div>
      </div>
    </footer>
  );
}
