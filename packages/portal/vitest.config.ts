import { createReactLibTestConfig } from '@cbt-bo/config/vitest';
import tailwindcss from '@tailwindcss/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), viteReact()],
  ...createReactLibTestConfig({
    name: 'portal',
    coverageExclude: ['src/components/ui/**'],
    storybook: { dirname: import.meta.dirname }
  })
});
