import { createReactAppTestConfig } from '@cbt-bo/config/vitest';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: { '@cbt-bo/api-schema/bo': '@cbt-bo/api-schema/bo-so' }
  },
  plugins: [tailwindcss(), viteReact()],
  test: createReactAppTestConfig({
    dirname: import.meta.dirname,
    name: 'so-backoffice',
    isStorybookEnabled: true
  })
});
