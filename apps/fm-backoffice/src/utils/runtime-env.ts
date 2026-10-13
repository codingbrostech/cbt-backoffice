import type { IRuntimeEnv } from '@cbt-bo/api/client';

/**
 * Reads the MGT API settings Vite inlined at build time. Throws when
 * `VITE_MGT_BASE_URL` or `VITE_MGT_SITE_ID` is missing.
 */
export const loadRuntimeEnv = (): IRuntimeEnv => {
  const { VITE_MGT_BASE_URL: mgtBaseUrl, VITE_MGT_SITE_ID: mgtSiteId } = import.meta.env;

  if (!mgtBaseUrl || !mgtSiteId) {
    throw new Error(
      'VITE_MGT_BASE_URL and VITE_MGT_SITE_ID must be set, copy .env.example to .env'
    );
  }

  return { mgtBaseUrl, mgtSiteId };
};
