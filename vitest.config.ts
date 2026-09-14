import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    passWithNoTests: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    projects: ['apps/so-backoffice', 'apps/fm-backoffice']
  }
});
