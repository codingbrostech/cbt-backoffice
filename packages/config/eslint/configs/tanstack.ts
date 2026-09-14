import { tanstackConfig as upstreamConfig } from '@tanstack/eslint-config';
import type { Linter } from 'eslint';
import importX from 'eslint-plugin-import-x';
import { omit } from 'radash';
import tseslint from 'typescript-eslint';

import { withPrefix } from '../utils';

const VUE_CONFIG_NAME = 'tanstack/vue';

const CONFLICTING_RULES = [
  'import/order',
  'import/consistent-type-specifier-style',
  'sort-imports',
  '@typescript-eslint/array-type',
  '@typescript-eslint/consistent-type-imports',
  '@typescript-eslint/naming-convention'
];

const isVueConfig = (config: Linter.Config): boolean => config.name === VUE_CONFIG_NAME;

const stripLanguageOptions = (config: Linter.Config): Linter.Config =>
  omit(config, ['languageOptions']);

const stripConflictingRules = (config: Linter.Config): Linter.Config => ({
  ...config,
  ...(config.rules && { rules: omit(config.rules, CONFLICTING_RULES) })
});

const sharePluginInstances = (config: Linter.Config): Linter.Config => ({
  ...config,
  ...(config.plugins && {
    plugins: { ...config.plugins, import: importX, '@typescript-eslint': tseslint.plugin }
  })
});

/**
 * TanStack toolchain ESLint configuration.
 *
 * Wraps `@tanstack/eslint-config` so it can run next to the base config:
 * - drops the Vue entry
 * - drops `languageOptions`, since the workspace config supplies `projectService`
 * - drops the rules that conflict with the base config
 * - reuses this package's `import-x` and `typescript-eslint` plugin instances
 */
export const tanstackConfig: Linter.Config[] = upstreamConfig
  .filter(config => !isVueConfig(config))
  .map(stripLanguageOptions)
  .map(stripConflictingRules)
  .map(sharePluginInstances)
  .map(withPrefix('@cbt-bo/config/eslint/tanstack'));
