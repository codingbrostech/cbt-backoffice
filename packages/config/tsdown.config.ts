import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    'eslint/index': 'eslint/index.ts',
    'prettier/index': 'prettier/index.ts',
    'vitest/index': 'vitest/index.ts',
    'storybook/node': 'storybook/node.ts',
    'storybook/browser': 'storybook/browser.ts'
  },
  format: ['esm'],
  dts: { sourcemap: false },
  outExtensions() {
    return { js: '.js', dts: '.d.ts' };
  }
});
