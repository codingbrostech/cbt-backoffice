import cbtPlugin, { buildWorkspaceConfig } from '@cbt-bo/config/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const ignoreFiles = globalIgnores([
  '.output/**',
  'dist/**',
  'node_modules/**',
  'storybook-static/**',
  '.storybook/**'
]);

export default defineConfig([
  ...cbtPlugin.configs['flat/base'],
  ...cbtPlugin.configs['flat/filename-case'],
  ...cbtPlugin.configs['flat/react'],
  ...cbtPlugin.configs['flat/react-query'],
  ...buildWorkspaceConfig(import.meta.dirname),
  ignoreFiles
]);
