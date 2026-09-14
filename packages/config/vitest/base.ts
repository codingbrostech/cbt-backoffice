import type { TestUserConfig } from 'vitest/config';

/**
 * Creates base test configuration shared across all projects.
 */
export function createBaseTestConfig(options: TestUserConfig = {}): TestUserConfig {
  return {
    globals: true,
    environment: 'jsdom',
    reporters: ['verbose'],
    silent: 'passed-only',
    passWithNoTests: true,
    ...options
  };
}
