import { mergeConfig, type UserConfig as ViteUserConfig } from 'vite';

/**
 * Base Vite configuration
 */
const baseViteConfig: ViteUserConfig = {
  resolve: { tsconfigPaths: true }
};

/**
 * Creates a `viteFinal` function that merges custom Vite configuration
 * with the base config.
 *
 * @param customConfig - Optional additional Vite configuration to merge
 */
export function createViteFinal(
  customConfig?: ViteUserConfig
): (config: ViteUserConfig) => ViteUserConfig {
  return config =>
    mergeConfig(config, customConfig ? mergeConfig(baseViteConfig, customConfig) : baseViteConfig);
}
