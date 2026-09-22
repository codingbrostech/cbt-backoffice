import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    projects: ['apps/backoffice', 'packages/api-schema', 'packages/portal']
  }
});
