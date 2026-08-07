// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// Custom domain on GitHub Pages: set `site`, leave `base` unset (defaults to `/`).
export default defineConfig({
  site: 'https://ibnfazle.com',
  trailingSlash: 'never',
  output: 'static',
  redirects: {
    '/library': '/',
    '/page/1': '/',
  },
});
