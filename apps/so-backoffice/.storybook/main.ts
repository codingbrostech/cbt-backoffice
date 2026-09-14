import { createStorybookConfig } from '@cbt-bo/config/storybook/node';

export default createStorybookConfig({
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  framework: {
    name: '@storybook/tanstack-react',
    options: {}
  }
});
