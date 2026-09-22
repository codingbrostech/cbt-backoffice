import { type IRuntimeEnv, isKnownBrand } from '@cbt-bo/portal/app';
import { createServerFn } from '@tanstack/react-start';

/**
 * Reads the brand and the MGT API settings from the server environment at
 * request time. Throws when `BRAND` is not one of the known brands.
 */
export const getRuntimeEnv = createServerFn({ method: 'GET' }).handler((): IRuntimeEnv => {
  const brand = process.env.BRAND;

  if (!isKnownBrand(brand)) {
    throw new Error(`BRAND must be SO or FM, received "${brand ?? ''}"`);
  }

  return {
    brand,
    mgtBaseUrl: process.env.MGT_BASE_URL ?? '',
    mgtSiteId: process.env.MGT_SITE_ID ?? '',
    clientSiteLocales: process.env.CLIENT_SITE_LOCALES ?? ''
  };
});
