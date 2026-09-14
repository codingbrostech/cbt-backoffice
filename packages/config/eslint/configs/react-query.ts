import pluginQuery from '@tanstack/eslint-plugin-query';
import type { Linter } from 'eslint';

import { withPrefix } from '../utils';

/**
 * TanStack Query ESLint configuration.
 *
 * Applies the `@tanstack/eslint-plugin-query` recommended rules.
 */
export const reactQueryConfig: Linter.Config[] = pluginQuery.configs['flat/recommended'].map(
  withPrefix('@cbt-bo/config/eslint/react-query')
);
