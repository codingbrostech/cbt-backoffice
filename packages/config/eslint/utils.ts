/**
 * Returns a mapper function that prefixes config names.
 *
 * @example configs.map(withPrefix('@cbt-bo/config/eslint/base'))
 */
export const withPrefix =
  (prefix: string) =>
  <T extends { name?: string }>(config: T) => ({
    ...config,
    name: `${prefix}/${config.name ?? 'unknown'}`
  });
