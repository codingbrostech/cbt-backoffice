import type { Linter } from 'eslint';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * React ESLint configuration.
 *
 * Applies the `eslint-plugin-react-hooks` recommended rules.
 */
export const reactConfig: Linter.Config[] = [
  { ...reactHooks.configs.flat.recommended, name: '@cbt-bo/config/eslint/react/hooks-recommended' }
];
