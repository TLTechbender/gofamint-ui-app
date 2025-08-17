// packages/gofamintui-app/tailwind.config.ts

import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  // 1. Content: Essential for Tailwind JIT (Just-In-Time) mode to scan your files
  // and generate only the CSS you actually use.
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js', './app/**/*.{ts', './app/**/*.{jsx', './app/**/*.{tsx', './app/**/*.{mdx}',
    // If you have any other files that contain Tailwind classes (e.g., custom hooks, utility files
    // that might generate dynamic classes), add them here.
  ],
  // 2. Theme: This is where you customize Tailwind's default design system.
  theme: {
    // `extend` allows you to add to Tailwind's default theme without overwriting it.
    // For example, if you add 'primary' to `colors.extend`, you still have access
    // to Tailwind's default colors like `red-500`.
    extend: {
      // Colors: Define your brand colors here.
      // We'll use a primary blue, a light blue for backgrounds,
      // and a couple of complementary neutrals/accents.
      colors: {
        // --- Primary Blue Palette (Your Church Fellowship's Brand Blue) ---
        // I've chosen a vibrant, yet deep blue. The shades go from very light
        // (good for subtle backgrounds) to very dark (good for text or deep accents).
        // You can adjust the exact hex codes to perfectly match your brand if you have one.
        'primary-blue': {
          50: '#E0F2FE',  // Very Light Blue (almost white, good for subtle backgrounds/highlights)
          100: '#BAE6FD', // Light Blue
          200: '#7DD3FC', // Light Blue
          300: '#38BDF8', // Moderately Light Blue
          400: '#0EA5E9', // Standard Blue
          500: '#0072C6', // **Main Brand Blue** - A classic, strong blue (adjust this if you have a specific hex)
          600: '#0369A1', // Darker Blue
          700: '#075985', // Darker Blue
          800: '#0C4A6E', // Deeper Blue
          900: '#153655', // Very Dark Blue (approaching navy, good for deep text, headers, footers)
          950: '#0F263A', // Almost black-blue
        },
        // --- Complementary Colors ---
        // These are chosen to work well with your blue.
        // A neutral gray for text and secondary elements, and a subtle accent.
        'neutral-gray': {
          50: '#FAFAFA',   // Very Light Gray
          100: '#F5F5F5',  // Light Gray (good for section backgrounds)
          200: '#E5E5E5',  // Slightly darker gray
          300: '#D4D4D4',  // For borders, subtle separators
          400: '#A3A3A3',  // Subdued text, icons
          500: '#737373',  // Default text color for good readability
          600: '#525252',  // Darker text
          700: '#404040',  // Even darker text
          800: '#262626',  // Near black text
          900: '#171717',  // Deepest black-gray
        },
        // Accent color (optional, use sparingly for CTAs or highlights)
        // I've chosen a soft, inviting green that contrasts nicely with blue but isn't jarring.
        // A golden yellow or a soft orange could also work, depending on the desired feel.
        'accent-green': {
          DEFAULT: '#10B981', // A pleasant, accessible green
          light: '#34D399',
          dark: '#059669',
        },
        // Another potential accent, like a warm peach or gold, if needed.
        // 'accent-peach': '#FFBE9F', // Example
      },

      // Typography: Customize font families, sizes, etc.
      fontFamily: {
        // Use your preferred fonts. Google Fonts are easy to integrate.
        // I'm using `sans` as a fallback, but you'd define specific fonts here.
        // Example: If you use 'Inter' from Google Fonts:
        // 'sans': ['Inter', ...defaultTheme.fontFamily.sans],
        // You might define separate fonts for headings and body text for visual hierarchy.
        // `display` for headings (bolder, more character)
        // `body` for paragraphs (readable, clean)
        sans: ['Roboto', ...defaultTheme.fontFamily.sans], // Example: Roboto for body text
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif], // Example: Merriweather for some headings
        heading: ['Montserrat', ...defaultTheme.fontFamily.sans], // Example: Montserrat for main headings
      },

      // Spacing: Define a consistent spacing scale (e.g., based on an 8px grid).
      // Tailwind's default scale is pretty good, but you can extend it if needed.
      spacing: {
        '128': '32rem', // Example of extending default spacing
        '144': '36rem',
      },

      // Z-Index: Extend default Z-index for modals, navbars, tooltips, etc.
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100', // For critical elements like a sticky navbar or modal overlay
      },

      // Box Shadow: Add custom box shadows if needed.
      boxShadow: {
        'custom-light': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'custom-medium': '0 5px 15px rgba(0, 0, 0, 0.1)',
      },

      // Border Radius: Add custom border radii.
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Transitions: Customize transition properties (e.g., duration, timing functions).
      transitionDuration: {
        '2000': '2000ms', // Longer transition for specific animations
      },
      transitionTimingFunction: {
        'expo-in-out': 'cubic-bezier(0.86, 0, 0.07, 1)',
      },

      // Keyframes for custom animations (if not using Framer Motion exclusively)
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      // Animation utilities that use the keyframes
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideInUp: 'slideInUp 0.6s ease-out forwards',
      },
    },
  },
  // 3. Plugins: Add any Tailwind plugins here (e.g., @tailwindcss/typography)
  plugins: [
    // If you plan to use `prose` classes for blog content, include this:
    // require('@tailwindcss/typography'),
    // This allows you to easily style rich text from Sanity's Portable Text.
  ],
};

export default config;