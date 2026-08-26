/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hiero: {
          green: '#06c006',
          'green-dim': '#05a605',
          'green-glow': 'rgba(6, 192, 6, 0.18)',
          'green-subtle': 'rgba(6, 192, 6, 0.08)',
          dark: '#0A0A0F',
          'dark-2': '#0F0F16',
          'dark-3': '#15151F',
          card: '#1A1A2E',
          'card-hover': '#1F1F35',
          border: '#2A2A3E',
          'border-light': '#3A3A50',
          muted: '#8B8BA3',
        },
      },
      boxShadow: {
        'hiero-glow': '0 0 20px rgba(6, 192, 6, 0.18)',
        'hiero-glow-sm': '0 0 10px rgba(6, 192, 6, 0.12)',
        'hiero-glow-lg': '0 0 40px rgba(6, 192, 6, 0.25), 0 0 80px rgba(6, 192, 6, 0.12)',
        'hiero-card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'logo-pulse': 'logoPulse 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmerText 3s ease-in-out infinite',
        'hero-reveal': 'heroReveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'hero-bg': 'heroBg 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gradient-flow': 'gradientFlow 4s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 255, 102, 0.2)' },
          '50%': { boxShadow: '0 0 20px 5px rgba(0, 255, 102, 0.1)' },
        },
        logoPulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(0, 255, 102, 0.3)) drop-shadow(0 0 40px rgba(0, 255, 102, 0.1))' },
          '50%': { filter: 'drop-shadow(0 0 30px rgba(0, 255, 102, 0.5)) drop-shadow(0 0 60px rgba(0, 255, 102, 0.2))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmerText: {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '200% center' },
        },
        heroReveal: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)', filter: 'blur(0)' },
        },
        heroBg: {
          '0%': { opacity: '0.3', transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradientFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
