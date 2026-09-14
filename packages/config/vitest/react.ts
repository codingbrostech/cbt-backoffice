import type { TestProjectConfiguration, ViteUserConfig } from 'vitest/config';

import { createBaseTestConfig } from './base';
import { createCoverageConfig } from './coverage';
import { createStorybookProject, type IStorybookProjectOptions } from './storybook';

export interface IReactLibTestOptions {
  /** Project name for test reporting (e.g., "ui-lib") */
  name: string;
  /** Additional patterns to exclude from coverage */
  coverageExclude?: string[];
  /** Storybook browser test project, omit for libraries without Storybook */
  storybook?: IStorybookProjectOptions;
}

function createUnitTestProject(name: string): TestProjectConfiguration {
  return {
    extends: true,
    test: {
      name,
      include: ['src/**/*.test.{ts,tsx}'],
      exclude: ['node_modules', 'dist', '**/*.stories.{ts,tsx}'],
      setupFiles: ['./vitest.setup.ts'],
      css: {
        modules: {
          classNameStrategy: 'non-scoped'
        }
      }
    }
  };
}

/**
 * Creates a Vitest configuration for React libraries.
 *
 * Features:
 * - Sets up unit test project with src/** patterns
 * - Excludes dist build directory
 * - Configures CSS modules with non-scoped class names for testing
 * - Adds a Storybook browser testing project when `storybook` is passed
 *
 * Note: Consumer should add vite-tsconfig-paths plugin for path aliases.
 */
export function createReactLibTestConfig(
  options: IReactLibTestOptions
): Pick<ViteUserConfig, 'test'> {
  const { name, coverageExclude = [], storybook } = options;

  const projects = [createUnitTestProject(name)];

  if (storybook) {
    projects.push(createStorybookProject(storybook));
  }

  return {
    test: {
      ...createBaseTestConfig(),
      coverage: createCoverageConfig({
        include: ['src/**/*.{ts,tsx}'],
        exclude: coverageExclude
      }),
      projects
    }
  };
}
