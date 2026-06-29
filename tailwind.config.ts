import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: "#0A0A0A",

        primary: "#D4AF37",
        secondary: "#FFD700",

        neonBlue: "#D4AF37",
        neonPurple: "#C9A227",
        neonPink: "#FFD700",
        neonCyan: "#F5D76E",
        neonOrange: "#B8860B",
        neonGold: "#FFD700",
        neonGreen: "#D4AF37"
      },

      boxShadow: {
        glow: "0 0 40px rgba(212,175,55,.40)",
        "pink-glow": "0 0 45px rgba(255,215,0,.35)",
        "green-glow": "0 0 42px rgba(212,175,55,.35)"
      },

      animation: {
        aurora: "aurora 18s ease-in-out infinite alternate",
        ticker: "ticker 28s linear infinite",
        grid: "grid 20s linear infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite"
      },

      keyframes: {
        aurora: {
          "0%": {
            transform: "translate3d(-8%, -6%, 0) scale(1)",
            filter: "hue-rotate(0deg)"
          },
          "50%": {
            transform: "translate3d(8%, 4%, 0) scale(1.08)",
            filter: "hue-rotate(15deg)"
          },
          "100%": {
            transform: "translate3d(2%, 9%, 0) scale(1.04)",
            filter: "hue-rotate(-10deg)"
          }
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
          "0%, 100%": {
            opacity: ".55",
            transform: "scale(1)"
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.04)"
          }
        }
      }
    }
  },
  plugins: []
};

export default config;