import cbtPlugin, { buildWorkspaceConfig } from '@cbt-bo/config/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const ignoreFiles = globalIgnores(['dist/**', 'node_modules/**', 'coverage/**']);

export default defineConfig([
  ...cbtPlugin.configs['flat/base'],
  ...cbtPlugin.configs['flat/filename-case'],
  ...cbtPlugin.configs['flat/react-query'],
  ...cbtPlugin.configs['flat/tanstack'],
  ...buildWorkspaceConfig(import.meta.dirname),
  ignoreFiles
]);
