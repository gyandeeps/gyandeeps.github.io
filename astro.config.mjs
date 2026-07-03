import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://gyandeeps.com',

  build: {
    format: 'directory' // Ensures routes resolve as `/route/` rather than `/route.html`
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});