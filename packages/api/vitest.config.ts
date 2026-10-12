import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: { '@cbt-bo/api-schema/bo': '@cbt-bo/api-schema/bo-fm' }
  },
  test: {
    name: 'api',
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    passWithNoTests: true
  }
});
