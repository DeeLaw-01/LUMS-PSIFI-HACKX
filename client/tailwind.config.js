/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712'
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        }
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px'
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#60A5FA',
              '&:hover': {
                color: '#93C5FD'
              },
              textDecoration: 'none'
            },
            '[class~="lead"]': {
              color: 'inherit'
            },
            strong: {
              color: 'inherit'
            },
            'ol[type="A"]': {
              '--list-counter-style': 'upper-alpha'
            },
            'ol[type="a"]': {
              '--list-counter-style': 'lower-alpha'
            },
            'ol[type="A" s]': {
              '--list-counter-style': 'upper-alpha'
            },
            'ol[type="a" s]': {
              '--list-counter-style': 'lower-alpha'
            },
            'ol[type="I"]': {
              '--list-counter-style': 'upper-roman'
            },
            'ol[type="i"]': {
              '--list-counter-style': 'lower-roman'
            },
            'ol[type="I" s]': {
              '--list-counter-style': 'upper-roman'
            },
            'ol[type="i" s]': {
              '--list-counter-style': 'lower-roman'
            },
            'ol[type="1"]': {
              '--list-counter-style': 'decimal'
            },
            'ol > li': {
              position: 'relative'
            },
            'ol > li::before': {
              content:
                'counter(list-item, var(--list-counter-style, decimal)) "."',
              position: 'absolute',
              left: '0',
              marginLeft: '-1.5em',
              color: 'inherit'
            },
            'ul > li': {
              position: 'relative'
            },
            'ul > li::before': {
              content: '""',
              position: 'absolute',
              left: '-1.5em',
              top: 'calc(0.875em - 0.1875em)',
              height: '0.375em',
              width: '0.375em',
              borderRadius: '50%',
              backgroundColor: 'currentColor',
              opacity: 0.5
            },
            hr: {
              borderColor: 'currentColor',
              opacity: 0.1
            },
            blockquote: {
              borderLeftColor: 'currentColor',
              opacity: 0.8
            },
            h1: {
              color: 'inherit'
            },
            h2: {
              color: 'inherit'
            },
            h3: {
              color: 'inherit'
            },
            h4: {
              color: 'inherit'
            },
            'figure figcaption': {
              color: 'inherit',
              opacity: 0.7
            },
            code: {
              color: 'inherit',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '0.25rem',
              padding: '0.25rem',
              fontSize: '0.875em'
            },
            'code::before': {
              content: '""'
            },
            'code::after': {
              content: '""'
            },
            'a code': {
              color: 'inherit'
            },
            pre: {
              color: 'inherit',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '0.375rem',
              padding: '1rem',
              overflowX: 'auto'
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit'
            },
            'pre code::before': {
              content: 'none'
            },
            'pre code::after': {
              content: 'none'
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em'
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'currentColor',
              opacity: 0.3
            },
            'thead th': {
              color: 'inherit',
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'currentColor',
              opacity: 0.1
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0'
            },
            'tbody td': {
              verticalAlign: 'baseline',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em'
            }
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
        'gradient-to-tr':
          'linear-gradient(to top right, var(--tw-gradient-stops))',
        'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
        'gradient-to-br':
          'linear-gradient(to bottom right, var(--tw-gradient-stops))',
        'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
        'gradient-to-bl':
          'linear-gradient(to bottom left, var(--tw-gradient-stops))',
        'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
        'gradient-to-tl':
          'linear-gradient(to top left, var(--tw-gradient-stops))'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')
  ]
}
