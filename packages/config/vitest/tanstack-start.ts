import type { TestProjectConfiguration, TestUserConfig } from 'vitest/config';

import { createBaseTestConfig } from './base';
import { createCoverageConfig } from './coverage';
import { createStorybookProject } from './storybook';

export interface ITanstackStartTestOptions {
  /** Directory of the vite config file (use `import.meta.dirname`) */
  dirname: string;
  /** Project name for test reporting (e.g., "so-backoffice") */
  name: string;
  /** Additional patterns to exclude from coverage */
  coverageExclude?: string[];
  /** Adds the Storybook browser test project */
  isStorybookEnabled?: boolean;
}

const GENERATED_FILES = ['src/routeTree.gen.ts', 'src/router.tsx', 'src/components/ui/**'];

function createUnitTestProject(name: string): TestProjectConfiguration {
  return {
    extends: true,
    test: {
      name,
      css: false,
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: ['node_modules', '.output', 'dist', '**/*.stories.{ts,tsx}', '**/routeTree.gen.ts'],
      setupFiles: ['./vitest.setup.ts']
    }
  };
}

/**
 * Creates the `test` section of a TanStack Start app's `vite.config.ts`.
 *
 * Features:
 * - Sets up a unit test project with src/** patterns
 * - Excludes the .output build directory and generated route files
 * - Adds a Storybook browser testing project when `isStorybookEnabled` is set
 *
 * @example
 * export default defineConfig({
 *   plugins: [tanstackStart(), viteReact()],
 *   test: createTanstackStartTestConfig({ dirname: import.meta.dirname, name: 'so-backoffice' })
 * });
 */
export function createTanstackStartTestConfig(options: ITanstackStartTestOptions): TestUserConfig {
  const { dirname, name, coverageExclude = [], isStorybookEnabled = false } = options;

  const projects = [createUnitTestProject(name)];

  if (isStorybookEnabled) {
    projects.push(createStorybookProject({ dirname }));
  }

  return {
    ...createBaseTestConfig(),
    coverage: createCoverageConfig({
      include: ['src/**/*.{ts,tsx}'],
      exclude: [...GENERATED_FILES, ...coverageExclude]
    }),
    projects
  };
}
