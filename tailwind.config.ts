import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Vibrant gradient colors
        'vibrant-purple': 'hsl(var(--gradient-purple))',
        'vibrant-cyan': 'hsl(var(--gradient-cyan))',
        'vibrant-pink': 'hsl(var(--gradient-pink))',
        'vibrant-blue': 'hsl(var(--gradient-blue))',
        'vibrant-orange': 'hsl(var(--gradient-orange))',
        'vibrant-green': 'hsl(var(--gradient-green))',
        'vibrant-yellow': 'hsl(var(--gradient-yellow))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "system-ui", "sans-serif"],
        heading: ["Outfit", "Inter", "system-ui", "sans-serif"],
        horizon: ["var(--font-horizon)", "sans-serif"],
      },
      animation: {
        // Existing
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "gradient-shift": "gradient-shift 3s ease-in-out infinite",

        // New production-ready animations
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "fade-in-down": "fadeInDown 0.6s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "scale-out": "scaleOut 0.3s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        "slide-out-right": "slideOutRight 0.4s ease-out",
        "slide-out-left": "slideOutLeft 0.4s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "bounce-in": "bounceIn 0.6s ease-out",
        "shake": "shake 0.5s ease-in-out",
        "rotate": "rotate360 1s linear infinite",
        "spin-slow": "spin 3s linear infinite",
        "ping": "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        // Existing
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--gradient-purple)), 0 0 40px hsl(var(--gradient-purple))" },
          "50%": { boxShadow: "0 0 30px hsl(var(--gradient-cyan)), 0 0 60px hsl(var(--gradient-cyan))" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },

        // New keyframes
        "fadeInUp": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fadeInDown": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scaleIn": {
          from: { opacity: "0", transform: "scale(0.9)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "scaleOut": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.9)" },
        },
        "slideInRight": {
          from: { opacity: "0", transform: "translateX(100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slideInLeft": {
          from: { opacity: "0", transform: "translateX(-100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slideOutRight": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(100%)" },
        },
        "slideOutLeft": {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(-100%)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "pulseGlow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--gradient-purple) / 0.3)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--gradient-purple) / 0.6)" },
        },
        "bounceIn": {
          "0%": { opacity: "0", transform: "scale(0.3)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
        "rotate360": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "ping": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        },
      },
      backgroundSize: {
        "200%": "200%",
        "300%": "300%",
        "400%": "400%",
      },
      transitionDuration: {
        "2000": "2000ms",
        "3000": "3000ms",
      },
      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "snappy": "cubic-bezier(0.4, 0, 0.6, 1)",
      },
      boxShadow: {
        "glow-sm": "0 0 10px hsl(var(--gradient-purple) / 0.3)",
        "glow": "0 0 20px hsl(var(--gradient-purple) / 0.4)",
        "glow-lg": "0 0 40px hsl(var(--gradient-purple) / 0.5)",
        "glow-cyan": "0 0 30px hsl(var(--gradient-cyan) / 0.4)",
        "glow-pink": "0 0 30px hsl(var(--gradient-pink) / 0.4)",
        "inner-glow": "inset 0 0 20px hsl(var(--gradient-purple) / 0.2)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
