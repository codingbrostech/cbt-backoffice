import type { TestProjectConfiguration, TestUserConfig } from 'vitest/config';

import { createBaseTestConfig } from './base';
import { createCoverageConfig } from './coverage';
import { createStorybookProject } from './storybook';

export interface IReactAppTestOptions {
  /** Directory of the vite config file (use `import.meta.dirname`) */
  dirname: string;
  /** Project name for test reporting (e.g., "fm-backoffice") */
  name: string;
  /** Additional patterns to exclude from the unit test project */
  exclude?: string[];
  /** Additional patterns to exclude from coverage */
  coverageExclude?: string[];
  /** Adds the Storybook browser test project */
  isStorybookEnabled?: boolean;
}

const VENDORED_FILES = ['src/components/ui/**'];

function createUnitTestProject(name: string, exclude: string[]): TestProjectConfiguration {
  return {
    extends: true,
    test: {
      name,
      css: false,
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: ['node_modules', 'dist', '**/*.stories.{ts,tsx}', ...exclude],
      setupFiles: ['./vitest.setup.ts']
    }
  };
}

/**
 * Creates the `test` section of a Vite React app's `vite.config.ts`.
 *
 * Features:
 * - Sets up a unit test project with src/** patterns
 * - Excludes the dist build directory and the vendored shadcn components
 * - Adds a Storybook browser testing project when `isStorybookEnabled` is set
 *
 * @example
 * export default defineConfig({
 *   plugins: [viteReact()],
 *   test: createReactAppTestConfig({ dirname: import.meta.dirname, name: 'fm-backoffice' })
 * });
 */
export function createReactAppTestConfig(options: IReactAppTestOptions): TestUserConfig {
  const { dirname, name, exclude = [], coverageExclude = [], isStorybookEnabled = false } = options;

  const projects = [createUnitTestProject(name, exclude)];

  if (isStorybookEnabled) {
    projects.push(createStorybookProject({ dirname }));
  }

  return {
    ...createBaseTestConfig(),
    coverage: createCoverageConfig({
      include: ['src/**/*.{ts,tsx}'],
      exclude: [...VENDORED_FILES, ...coverageExclude]
    }),
    projects
  };
}
