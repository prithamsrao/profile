/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: "#0B0E14",       // deep charcoal-navy, not pure black
          surface: "#12161F",  // card/panel surface
          surface2: "#171C27", // raised surface (modals, inputs)
          border: "#232936",
        },
        ink: {
          primary: "#E6E8EC",
          secondary: "#8B93A7",
          muted: "#5B6577",
        },
        cyan: {
          DEFAULT: "#2DE2E6",
          soft: "rgba(45, 226, 230, 0.12)",
        },
        violet: {
          DEFAULT: "#A855F7",
          soft: "rgba(168, 85, 247, 0.12)",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      boxShadow: {
        "glow-cyan": "0 0 24px rgba(45, 226, 230, 0.25)",
        "glow-violet": "0 0 24px rgba(168, 85, 247, 0.25)",
      },
      keyframes: {
        "scan-in": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "scan-in": "scan-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-up": "fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};
