import type { ESLint, Linter } from 'eslint';

import { baseConfig } from './configs/base';
import { filenameCaseConfig } from './configs/filename-case';
import { reactConfig } from './configs/react';
import { reactQueryConfig } from './configs/react-query';
import { routerConfig } from './configs/router';
import { tanstackConfig } from './configs/tanstack';

export { buildWorkspaceConfig } from './configs/workspace';

type TPlugin = ESLint.Plugin & {
  configs: {
    'flat/base': Linter.Config[];
    'flat/filename-case': Linter.Config[];
    'flat/react': Linter.Config[];
    'flat/react-query': Linter.Config[];
    'flat/router': Linter.Config[];
    'flat/tanstack': Linter.Config[];
  };
};

/**
 * Shared ESLint configs.
 *
 * @example
 * ```js
 * // eslint.config.mjs
 * import cbtPlugin from '@cbt-bo/config/eslint';
 *
 * export default [
 *   ...cbtPlugin.configs['flat/base'],
 * ];
 * ```
 */
const plugin: TPlugin = {
  configs: {
    'flat/base': baseConfig,
    'flat/filename-case': filenameCaseConfig,
    'flat/react': reactConfig,
    'flat/react-query': reactQueryConfig,
    'flat/router': routerConfig,
    'flat/tanstack': tanstackConfig
  }
};

export default plugin;
