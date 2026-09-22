import cbtPlugin, { buildWorkspaceConfig } from '@cbt-bo/config/eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const ignoreFiles = globalIgnores([
  '.output/**',
  'dist/**',
  'node_modules/**',
  'src/routeTree.gen.ts'
]);

const routeFileRules = {
  files: ['src/routes/**'],
  rules: {
    'unicorn/filename-case': 'off',
    '@typescript-eslint/only-throw-error': ['error', { allow: [{ from: 'lib', name: 'Response' }] }]
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
  routeFileRules
]);
