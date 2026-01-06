/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        sentinel: {
          blue: '#0078D4',
          'blue-light': '#50A5F5',
          dark: '#1B1B1F',
          darker: '#141418',
          surface: '#252529',
        }
      },
    },
  },
  plugins: [],
}
