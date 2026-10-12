import type { Linter } from 'eslint';
import unicorn from 'eslint-plugin-unicorn';

/**
 * Enforces the repo file-naming standard.
 *
 * Files are kebab-case. `.tsx` files may also be PascalCase, which is
 * reserved for React component files by convention. Directory names are
 * checked through the `.tsx` config only, so a PascalCase component folder
 * can hold kebab-case `.ts` helpers such as its hooks and utils.
 *
 * A lint rule cannot tell whether a `.tsx` file exports a component, so
 * that half of the convention is enforced in review.
 */
export const filenameCaseConfig: Linter.Config[] = [
  {
    name: '@cbt-bo/config/eslint/filename-case/default',
    files: ['**/*.{ts,mts,cts,js,mjs,cjs}'],
    plugins: { unicorn },
    rules: {
      'unicorn/filename-case': ['error', { case: 'kebabCase', checkDirectories: false }]
    }
  },
  {
    name: '@cbt-bo/config/eslint/filename-case/tsx',
    files: ['**/*.tsx'],
    plugins: { unicorn },
    rules: {
      'unicorn/filename-case': ['error', { cases: { kebabCase: true, pascalCase: true } }]
    }
  }
];
