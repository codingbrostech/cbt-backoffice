import type { Linter } from 'eslint';
import path from 'node:path';

const ALLOW_DEFAULT_PROJECT = ['*.config.js', '*.config.mjs', '*.config.cjs', '.prettierrc.mjs'];

/**
 * Typed-lint settings for one workspace.
 *
 * Configures the TypeScript project service with the shared `allowDefaultProject` list.
 *
 * Points the import resolver at that workspace's `tsconfig.json`.
 *
 * Every workspace spreads this, so an editor running one ESLint process for the repo applies identical settings to all of them.
 *
 * @example
 * export default defineConfig([
 *   ...cbtPlugin.configs['flat/base'],
 *   ...buildWorkspaceConfig(import.meta.dirname)
 * ]);
 */
export const buildWorkspaceConfig = (tsconfigRootDir: string): Linter.Config[] => [
  {
    name: '@cbt-bo/config/eslint/workspace',
    languageOptions: {
      parserOptions: {
        projectService: { allowDefaultProject: ALLOW_DEFAULT_PROJECT },
        tsconfigRootDir
      }
    },
    settings: {
      'import-x/resolver': {
        typescript: { project: path.join(tsconfigRootDir, 'tsconfig.json') }
      }
    }
  }
];
