import { svelte } from '@sveltejs/vite-plugin-svelte';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [svelte()],
  build: {
    outDir: '../../dist/apps/frontend',
    emptyOutDir: true,
  },
  server: {
    port: 8080,
  },
};

export default config;
