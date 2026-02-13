/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'legal-black': '#0A0A0A',   // Sidebar Background
        'legal-dark': '#111111',    // Dark Accents
        'legal-paper': '#F9FAFB',   // NEW: Main Background (Soft White)
        'judicial-gold': '#C6A15B', // Primary Accent
        'judicial-gold-dim': '#8E7035',
        'text-main': '#1A1A1A',     // NEW: Black text for white pages
        'text-muted': '#6B7280',    // NEW: Gray text for white pages
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'legal': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'legal-hover': '0 10px 15px -3px rgba(198, 161, 91, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}