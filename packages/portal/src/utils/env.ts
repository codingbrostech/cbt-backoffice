import { setApiBaseUrl } from '@cbt-bo/api-schema/fetcher';

import { type TBrand, configurePortal } from '~/config';

export { isBrandSo } from '~/config';

/**
 * Values read from the server environment at request time and handed to the
 * portal by the hosting app.
 */
export interface IRuntimeEnv {
  brand: TBrand;
  mgtBaseUrl: string;
  mgtSiteId: string;
  clientSiteLocales: string;
}

let runtimeEnv: IRuntimeEnv | undefined;

/**
 * Stores the runtime env, registers its brand and points the generated API
 * client at `mgtBaseUrl`. Safe to call repeatedly with the same values.
 */
export const setEnv = (env: IRuntimeEnv): void => {
  runtimeEnv = env;
  configurePortal({ brand: env.brand });
  setApiBaseUrl(env.mgtBaseUrl);
};

export const getEnv = (): IRuntimeEnv => {
  if (!runtimeEnv) {
    throw new Error('[portal] setEnv must be called before the portal is used');
  }

  return runtimeEnv;
};
