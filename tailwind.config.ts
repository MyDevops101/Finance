import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#E4E4E7",
        card: "#0A0C0F",
        primary: "#FF8A00",
        success: "#2ED47A",
        danger: "#FF433D",
        accent: "#3B9EFF",
        amber: "#FF8A00",
        border: "rgba(255, 255, 255, 0.12)",
        muted: "#8A8F98",
        "fn-red": "#E5493A",
        "fn-green": "#37B24D",
        "fn-blue": "#2F72E5"
      },
      fontFamily: {
        sans: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"]
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "1px",
        md: "2px",
        lg: "2px",
        xl: "3px",
        "2xl": "4px"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255, 138, 0, 0.16), 0 18px 60px rgba(0, 0, 0, 0.55)"
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.15" }
        }
      },
      animation: {
        ticker: "ticker 34s linear infinite",
        pulseLine: "pulseLine 2.4s ease-in-out infinite",
        blink: "blink 1.4s step-end infinite"
      }
    }
  },
  plugins: [animate]
};

export default config;
