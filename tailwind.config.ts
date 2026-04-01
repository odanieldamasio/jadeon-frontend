import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'sans-serif']
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        primary: 'hsl(var(--primary))',
        'primary-hover': 'hsl(var(--primary-hover))',
        'primary-neon': 'hsl(var(--primary-neon))',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        'secondary-foreground': 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        success: 'hsl(var(--success))',
        danger: 'hsl(var(--danger))'
      },
      borderRadius: {
        lg: '1.25rem',
        md: '1rem',
        sm: '0.875rem'
      },
      boxShadow: {
        soft: '0 0 0 1px rgba(38,42,51,0.72), 0 32px 64px -40px rgba(0,0,0,0.95), 0 18px 32px -28px rgba(34,197,94,0.28)',
        'soft-xl':
          '0 0 0 1px rgba(38,42,51,0.82), 0 42px 80px -42px rgba(0,0,0,0.98), 0 26px 56px -32px rgba(34,197,94,0.32)',
        'green-glow': '0 18px 46px -24px rgba(34,197,94,0.55), 0 0 60px -36px rgba(34,197,94,0.34)'
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: []
};

export default config;
