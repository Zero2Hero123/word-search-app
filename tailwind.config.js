/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        goBlue: 'goBlue .3s ease-in-out forwards',
      },
      keyframes: {
        goBlue: {
          '0%': { scale: '1' },
          '50%': { scale: '1.1' },
          '100%': {scale: '1', backgroundColor: 'blue'}
        }
      }
    },
  },
  plugins: [],
}
