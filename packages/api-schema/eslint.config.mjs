import cbtPlugin, { buildWorkspaceConfig } from '@cbt-bo/config/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const ignoreFiles = globalIgnores(['dist/**', 'node_modules/**', 'src/generated/**']);

const fetcherOverrides = {
  files: ['src/fetcher.ts'],
  rules: {
    '@typescript-eslint/no-unnecessary-type-parameters': 'off',
    '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'as' }]
  }
};

export default defineConfig([
  ...cbtPlugin.configs['flat/base'],
  ...cbtPlugin.configs['flat/filename-case'],
  ...buildWorkspaceConfig(import.meta.dirname),
  ignoreFiles,
  fetcherOverrides
]);
