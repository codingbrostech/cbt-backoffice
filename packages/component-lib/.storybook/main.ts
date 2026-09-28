import { createStorybookConfig } from '@cbt-bo/config/storybook/node';

export default createStorybookConfig({
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['storybook-addon-pseudo-states'],
  framework: {
    name: '@storybook/react-vite',
    options: {
      builder: {
        viteConfigPath: './vite.storybook.config.ts'
      }
    }
  }
});
