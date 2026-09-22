import cbtPlugin, { buildWorkspaceConfig } from '@cbt-bo/config/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const ignoreFiles = globalIgnores([
  'dist/**',
  'node_modules/**',
  'storybook-static/**',
  '.storybook/**',
  'src/components/ui/**'
]);

const typeBoundaryOverrides = {
  files: [
    'src/services/mgt.ts',
    'src/table/search-values.ts',
    'src/table/use-list-page.ts',
    'src/table/DataTableSearch.tsx'
  ],
  rules: {
    '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'as' }],
    '@typescript-eslint/no-unnecessary-type-parameters': 'off'
  }
};

export default defineConfig([
  ...cbtPlugin.configs['flat/base'],
  ...cbtPlugin.configs['flat/filename-case'],
  ...cbtPlugin.configs['flat/react'],
  ...cbtPlugin.configs['flat/router'],
  ...cbtPlugin.configs['flat/react-query'],
  ...cbtPlugin.configs['flat/tanstack'],
  ...buildWorkspaceConfig(import.meta.dirname),
  ignoreFiles,
  typeBoundaryOverrides
]);
