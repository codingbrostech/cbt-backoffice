import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { flatConfigs as importXConfigs } from 'eslint-plugin-import-x';
import jsdoc from 'eslint-plugin-jsdoc';
import tseslint from 'typescript-eslint';

import { withPrefix } from '../utils';

type TConfig = Linter.Config & Record<string, unknown>;

const importRuleOverrides = {
  name: '@cbt-bo/config/eslint/import-overrides',
  rules: {
    'import-x/no-named-as-default': 'off',
    'import-x/no-named-as-default-member': 'off',
    'import-x/namespace': 'off',
    'import-x/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'internal', 'parent', ['sibling', 'index']],
        'newlines-between': 'always',
        pathGroupsExcludedImportTypes: ['builtin'],
        alphabetize: { order: 'asc' }
      }
    ]
  },
  settings: {
    'import-x/resolver': {
      typescript: true
    }
  }
} as const satisfies TConfig;

const jsdocEslint = {
  name: '@cbt-bo/config/eslint/jsdoc',
  plugins: { jsdoc },
  rules: {
    'jsdoc/no-undefined-types': 'error'
  }
} as const satisfies TConfig;

const overrideRules = {
  name: '@cbt-bo/config/eslint/overrides',
  rules: {
    'arrow-body-style': ['error', 'as-needed'],
    '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'never' }],
    '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
    '@typescript-eslint/no-misused-spread': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'typeAlias', format: ['PascalCase'], prefix: ['T'] },
      { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
      { selector: 'enum', format: ['PascalCase'], prefix: ['E'] },
      { selector: 'enumMember', format: ['UPPER_CASE'] },
      {
        selector: 'typeParameter',
        format: ['PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
        custom: { regex: '^(T|T[A-Z][A-Za-z]+)$', match: true }
      }
    ]
  }
} as const satisfies TConfig;

const prettierConfig = {
  ...eslintConfigPrettier,
  name: '@cbt-bo/config/eslint/base/prettier'
} as const satisfies TConfig;

/**
 * Base ESLint configuration for TypeScript projects.
 *
 * Combines:
 * - ESLint recommended rules
 * - typescript-eslint strict and stylistic rule sets
 * - import ordering
 * - JSDoc checks
 * - Prettier compatibility
 * - naming conventions (T/I/E prefixes)
 */
export const baseConfig: Linter.Config[] = [
  { name: '@cbt-bo/config/eslint/base/eslint-recommended', ...eslint.configs.recommended },
  ...tseslint.configs.strictTypeChecked.map(withPrefix('@cbt-bo/config/eslint/base')),
  ...tseslint.configs.stylisticTypeChecked.map(withPrefix('@cbt-bo/config/eslint/base')),
  { ...importXConfigs.recommended, name: '@cbt-bo/config/eslint/base/import-recommended' },
  { ...importXConfigs.typescript, name: '@cbt-bo/config/eslint/base/import-typescript' },
  importRuleOverrides,
  jsdocEslint,
  prettierConfig,
  overrideRules
];
