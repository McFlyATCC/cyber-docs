import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mcflyatcc.github.io',
  base: '/cyber-docs',
  integrations: [tailwind()],
});
