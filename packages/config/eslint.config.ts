import { defineConfig, globalIgnores } from 'eslint/config';

import cbtPlugin, { buildWorkspaceConfig } from './eslint';

const ignoreFiles = globalIgnores(['dist/**', 'node_modules/**']);

export default defineConfig([
  ...cbtPlugin.configs['flat/base'],
  ...cbtPlugin.configs['flat/filename-case'],
  ...buildWorkspaceConfig(import.meta.dirname),
  ignoreFiles
]);
