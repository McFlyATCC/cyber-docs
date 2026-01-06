import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mcflyatcc.github.io',
  base: '/cyber-docs/',  // ← Added trailing slash
  trailingSlash: 'always',
  integrations: [tailwind()],
});
