import type { StorybookConfig } from 'storybook/internal/types';

import { createViteFinal } from './vite';

/** Storybook configuration with Vite support (used by @storybook/react-vite, @storybook/tanstack-react, etc.) */
export interface IStorybookViteConfig extends StorybookConfig {
  viteFinal?: ReturnType<typeof createViteFinal>;
}

/** Base addons included in all Storybook instances */
const baseAddons = [
  '@storybook/addon-docs',
  '@storybook/addon-links',
  '@storybook/addon-a11y',
  '@storybook/addon-vitest'
] as const;

/**
 * Options for createStorybookConfig.
 * Extends all Storybook config properties with `stories` and `framework` required.
 */
export interface IStorybookConfigOptions extends Partial<
  Omit<IStorybookViteConfig, 'stories' | 'framework'>
> {
  /** Story file patterns relative to .storybook directory */
  stories: StorybookConfig['stories'];
  /** Storybook framework configuration */
  framework: StorybookConfig['framework'];
}

/**
 * Creates a Storybook configuration with standard addons, CSS modules, and settings.
 *
 * Includes:
 * - Standard addons (links, a11y, vitest)
 * - CSS modules with camelCase convention (via viteFinal)
 */
export function createStorybookConfig(options: IStorybookConfigOptions): IStorybookViteConfig {
  const { stories, framework, viteFinal = createViteFinal(), addons = [], ...rest } = options;
  return {
    stories,
    addons: [...baseAddons, ...addons],
    framework,
    viteFinal,
    ...rest
  };
}
