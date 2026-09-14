import pluginRouter from '@tanstack/eslint-plugin-router';
import type { Linter } from 'eslint';

import { withPrefix } from '../utils';

/**
 * TanStack Router ESLint configuration.
 *
 * Applies the `@tanstack/eslint-plugin-router` recommended rules.
 */
export const routerConfig: Linter.Config[] = pluginRouter.configs['flat/recommended'].map(
  withPrefix('@cbt-bo/config/eslint/router')
);
