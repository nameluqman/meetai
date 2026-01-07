/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '360px',    // Small mobile
      'sm': '480px',    // Mobile
      'md': '768px',    // Tablet
      'lg': '1024px',   // Laptop
      'xl': '1280px',   // Desktop
      '2xl': '1536px',  // Large Desktop
    },
    extend: {
      fontSize: {
        'xs': '0.75rem',     // 12px
        'sm': '0.8125rem',   // 13px
        'base': '0.9375rem', // 15px
        'lg': '1.0625rem',   // 17px
        'xl': '1.1875rem',   // 19px
        '2xl': '1.375rem',   // 22px
        '3xl': '1.5rem',     // 24px
        '4xl': '1.75rem',    // 28px
        '5xl': '2rem',       // 32px
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
