import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Exness Global | Premium Forex, Crypto and Stock Trading",
  description:
    "Trade forex, crypto and stocks with lightning-fast execution, AI-powered analytics, advanced security and professional trading platforms.",
  keywords: ["fintech", "crypto trading", "forex trading", "AI trading", "stocks", "MT5", "WebTrader"],
  metadataBase: new URL("https://exnessglobal.example"),
  openGraph: {
    title: "Exness Global | Trade The Future of Finance",
    description:
      "A cinematic, premium trading platform for forex, crypto and stock markets with AI analytics and deep liquidity.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Exness Global trading dashboard" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Exness Global",
    description: "Professional trading with AI analytics, ultra-fast execution and neon fintech design."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
