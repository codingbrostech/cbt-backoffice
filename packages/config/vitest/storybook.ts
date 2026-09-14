import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import type { TestProjectConfiguration } from 'vitest/config';
import type { BrowserInstanceOption } from 'vitest/node';

const STORYBOOK_DIR = '.storybook';

type TBrowserOptions = Partial<Pick<BrowserInstanceOption, 'browser'>>;

/**
 * Options for createStorybookProject.
 */
export interface IStorybookProjectOptions extends TBrowserOptions {
  /** Directory of the vitest config file (use `import.meta.dirname`) */
  dirname: string;
}

/**
 * Create a Storybook test project configuration for Vitest.
 *
 * @example
 * const dirname = import.meta.dirname;
 *
 * export default defineConfig({
 *   test: {
 *     projects: [createStorybookProject({ dirname })],
 *   },
 * });
 *
 */
export function createStorybookProject(
  options: IStorybookProjectOptions
): TestProjectConfiguration {
  const { dirname, browser = 'chromium' } = options;

  return {
    extends: true,
    plugins: [storybookTest({ configDir: path.join(dirname, STORYBOOK_DIR) })],
    test: {
      name: 'storybook',
      setupFiles: [`${STORYBOOK_DIR}/vitest.setup.ts`],
      browser: {
        enabled: true,
        headless: true,
        provider: playwright(),
        instances: [{ browser }]
      }
    }
  } satisfies TestProjectConfiguration;
}
