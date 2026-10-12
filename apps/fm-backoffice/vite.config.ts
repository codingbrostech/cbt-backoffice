import { createTanstackStartTestConfig } from '@cbt-bo/config/vitest';
import tailwindcss from '@tailwindcss/vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { nitro } from 'nitro/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const isTest = mode === 'test';

  Object.assign(process.env, loadEnv(mode, import.meta.dirname, ''));

  const appPlugins = isTest
    ? []
    : [devtools(), nitro({ rollupConfig: { external: [/^@sentry\//] } }), tanstackStart()];

  return {
    resolve: {
      tsconfigPaths: true,
      alias: { '@cbt-bo/api-schema/bo': '@cbt-bo/api-schema/bo-fm' }
    },
    plugins: [...appPlugins, tailwindcss(), viteReact()],
    test: createTanstackStartTestConfig({
      dirname: import.meta.dirname,
      name: 'fm-backoffice',
      isStorybookEnabled: true
    })
  };
});
