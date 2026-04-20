/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          container: "rgb(var(--primary-container) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          container: "rgb(var(--secondary-container) / <alpha-value>)",
          fixed: "rgb(var(--secondary-fixed-dim) / <alpha-value>)",
        },
        tertiary: {
          container: "rgb(var(--tertiary-container) / <alpha-value>)",
        },
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          bright: "rgb(var(--surface-bright) / <alpha-value>)",
          variant: "rgb(var(--surface-variant) / <alpha-value>)",
          container: {
            lowest: "rgb(var(--surface-container-lowest) / <alpha-value>)",
            low: "rgb(var(--surface-container-low) / <alpha-value>)",
            high: "rgb(var(--surface-container-high) / <alpha-value>)",
            highest: "rgb(var(--surface-container-highest) / <alpha-value>)",
          },
        },
        outline: {
          variant: "rgb(var(--outline-variant) / <alpha-value>)",
        },
        on: {
          background: "rgb(var(--on-background) / <alpha-value>)",
          surface: "rgb(var(--on-surface) / <alpha-value>)",
          "surface-variant": "rgb(var(--on-surface-variant) / <alpha-value>)",
          primary: "rgb(var(--on-primary) / <alpha-value>)",
          secondary: "rgb(var(--on-secondary) / <alpha-value>)",
          "secondary-container":
            "rgb(var(--on-secondary-container) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: [
          '"Plus Jakarta Sans"',
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "1.5rem",
        "2xl": "2rem",
        "3xl": "2.5rem",
      },
      boxShadow: {
        "ambient-sm": "0 8px 24px rgba(26, 28, 24, 0.06)",
        "ambient-lg": "0 16px 40px rgba(26, 28, 24, 0.06)",
        "button-primary":
          "inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 14px 32px rgba(26, 28, 24, 0.08)",
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, rgb(var(--primary)), rgb(var(--primary-container)))",
      },
    },
  },
  plugins: [],
}
