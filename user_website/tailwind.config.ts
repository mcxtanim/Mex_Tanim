import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5722',
          orangeHover: '#E64A19',
          dark: '#111827',
          card: '#1F2937',
          gray: '#F3F4F6',
          lightBg: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
};

export default config;
