import type { Config } from 'prettier';

/**
 * Creates a Prettier configuration with standard CBT settings.
 * Accepts any property from Prettier's Config type.
 */
export function createPrettierConfig(options: Partial<Config> = {}): Config {
  return {
    arrowParens: 'avoid',
    bracketSpacing: true,
    endOfLine: 'auto',
    printWidth: 100,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'none',
    useTabs: false,
    ...options
  };
}
