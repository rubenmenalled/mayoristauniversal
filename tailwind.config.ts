import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D47A1',
          light: '#1565C0',
          mid: '#0D47A1',
          dark: '#08306B',
        },
        gold: {
          DEFAULT: '#FF6A3D',
          light: '#FF8A63',
          dark: '#E0521F',
        },
        electric: '#00A8FF',
      },
      fontFamily: {
        display: ['var(--font-montserrat)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'spin-slow': 'spin 30s linear infinite',
        'spin-slow-reverse': 'spinReverse 20s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'scroll-left': 'scrollLeft 30s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 10px rgba(255,106,61,0.3), 0 0 20px rgba(255,106,61,0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(255,106,61,0.8), 0 0 60px rgba(255,106,61,0.4), 0 0 100px rgba(255,106,61,0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        scrollLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        spinReverse: {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FF6A3D 0%, #FF8A63 50%, #FF6A3D 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0D47A1 0%, #1565C0 50%, #0D47A1 100%)',
        'hero-radial': 'radial-gradient(ellipse at center, #1565C0 0%, #0D47A1 60%, #08306B 100%)',
      },
      dropShadow: {
        'gold': '0 0 20px rgba(255,106,61,0.6)',
      },
    },
  },
  plugins: [],
}

export default config
