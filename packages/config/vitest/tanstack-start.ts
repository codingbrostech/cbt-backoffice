import type { TestUserConfig } from 'vitest/config';

import { createReactAppTestConfig } from './react-app';

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

const BUILD_DIRS = ['.output'];
const GENERATED_FILES = ['src/routeTree.gen.ts', 'src/router.tsx'];

/**
 * Creates the `test` section of a TanStack Start app's `vite.config.ts`.
 *
 * Extends `createReactAppTestConfig` by excluding the .output build directory
 * and the generated route files.
 *
 * @example
 * export default defineConfig({
 *   plugins: [tanstackStart(), viteReact()],
 *   test: createTanstackStartTestConfig({ dirname: import.meta.dirname, name: 'so-backoffice' })
 * });
 */
export function createTanstackStartTestConfig(options: ITanstackStartTestOptions): TestUserConfig {
  const { coverageExclude = [], ...rest } = options;

  return createReactAppTestConfig({
    ...rest,
    exclude: [...BUILD_DIRS, '**/routeTree.gen.ts'],
    coverageExclude: [...GENERATED_FILES, ...coverageExclude]
  });
}
