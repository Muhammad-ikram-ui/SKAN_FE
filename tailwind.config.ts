import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0f172a", // slate-900
          foreground: "#f8fafc",
        },
        secondary: {
          DEFAULT: "#0ea5e9", // sky-500
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#f1f5f9", // slate-100
          foreground: "#64748b",
        },
        accent: {
          DEFAULT: "#e2e8f0", // slate-200
          foreground: "#0f172a",
        },
        destructive: {
          DEFAULT: "#e11d48", // rose-600
          foreground: "#ffffff",
        },
        priority: {
          DEFAULT: "#f59e0b", // amber-500
          light: "#fef3c7", // amber-100
          foreground: "#78350f",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a",
        },
        status: {
          baru: "#f59e0b",
          diproses: "#f59e0b",
          siap: "#059669", // emerald-600
          selesai: "#64748b", // slate-500
          batal: "#f43f5e", // rose-500
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 2px 10px 0 rgba(15, 23, 42, 0.06)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15,23,42,0.06)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
