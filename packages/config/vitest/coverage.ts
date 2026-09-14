import type { CoverageOptions } from 'vitest/node';

type TCoverageV8Options = CoverageOptions;

/**
 * Options for createCoverageConfig.
 * - `include` is required
 * - `exclude` is optional (merged with default exclusions)
 */
export type TCoverageConfigOptions = Pick<TCoverageV8Options, 'include'> &
  Partial<Pick<TCoverageV8Options, 'exclude'>>;

/**
 * Default exclusion patterns for coverage.
 * - Test/spec/story files (*.{test,spec,stories}.{ts,tsx})
 * - Type declaration files (*.d.ts)
 */
const DEFAULT_EXCLUDE = ['**/*.{test,spec,stories}.{ts,tsx}', '**/*.d.ts'] as const;

/**
 * Create a coverage configuration for Vitest with v8 provider.
 *
 * @param options - Coverage configuration options
 *
 * @example
 * ```ts
 * export default defineConfig({
 *   test: {
 *     coverage: createCoverageConfig({
 *       include: ['src/*.{ts,tsx}'],
 *       exclude: ['index.ts'],
 *     }),
 *   },
 * });
 * ```
 */
export function createCoverageConfig(options: TCoverageConfigOptions): TCoverageV8Options {
  const { include, exclude = [] } = options;

  return {
    provider: 'v8',
    reporter: ['text', 'lcov', 'html'],
    include,
    exclude: [...DEFAULT_EXCLUDE, ...exclude]
  };
}
