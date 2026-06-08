import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: "#050816",
        neonBlue: "#3B82F6",
        neonPurple: "#8B5CF6",
        neonPink: "#EC4899",
        neonCyan: "#06B6D4",
        neonOrange: "#F97316",
        neonGold: "#F59E0B",
        neonGreen: "#10B981"
      },
      boxShadow: {
        glow: "0 0 40px rgba(59,130,246,.35)",
        "pink-glow": "0 0 45px rgba(236,72,153,.32)",
        "green-glow": "0 0 42px rgba(16,185,129,.28)"
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite alternate",
        ticker: "ticker 28s linear infinite",
        grid: "grid 20s linear infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite"
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translate3d(-8%, -6%, 0) scale(1)", filter: "hue-rotate(0deg)" },
          "50%": { transform: "translate3d(8%, 4%, 0) scale(1.08)", filter: "hue-rotate(35deg)" },
          "100%": { transform: "translate3d(2%, 9%, 0) scale(1.04)", filter: "hue-rotate(-20deg)" }
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        grid: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "80px 80px" }
        },
        pulseGlow: {
          "0%, 100%": { opacity: ".55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.04)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
