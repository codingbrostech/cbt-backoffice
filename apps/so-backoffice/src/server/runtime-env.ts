import type { IRuntimeEnv } from '@cbt-bo/api/client';
import { createServerFn } from '@tanstack/react-start';

let runtimeEnvRequest: Promise<IRuntimeEnv> | undefined;

/**
 * Reads the MGT API settings from the server environment at request time.
 * Throws when `MGT_BASE_URL` or `MGT_SITE_ID` is missing.
 */
export const getRuntimeEnv = createServerFn({ method: 'GET' }).handler((): IRuntimeEnv => {
  const { MGT_BASE_URL: mgtBaseUrl, MGT_SITE_ID: mgtSiteId } = process.env;

  if (!mgtBaseUrl || !mgtSiteId) {
    throw new Error('MGT_BASE_URL and MGT_SITE_ID must be set, copy .env.example to .env');
  }

  return { mgtBaseUrl, mgtSiteId };
});

/**
 * Reads the runtime env through the server function and caches the result
 * for the lifetime of the process.
 */
export const loadRuntimeEnv = (): Promise<IRuntimeEnv> => {
  runtimeEnvRequest ??= getRuntimeEnv().catch((error: unknown) => {
    runtimeEnvRequest = undefined;
    throw error;
  });

  return runtimeEnvRequest;
};
