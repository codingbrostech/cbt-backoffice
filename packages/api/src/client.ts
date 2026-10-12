import { setApiBaseUrl } from '@cbt-bo/api-schema/fetcher';
import { configureMgtClient } from '@cbt-bo/api-schema/mgt';

import { useSessionStore } from '@cbt-bo/api/auth/store';

/**
 * MGT API settings read from the server environment at request time and
 * handed to the client through the root route context.
 */
export interface IRuntimeEnv {
  mgtBaseUrl: string;
  mgtSiteId: string;
}

export const SESSION_EXPIRED_EVENT = 'session-expired';

let runtimeEnv: IRuntimeEnv | undefined;

const notifySessionExpired = (): void => {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
};

export const getEnv = (): IRuntimeEnv => {
  if (!runtimeEnv) {
    throw new Error('[api] initMgtClient must be called before the API is used');
  }

  return runtimeEnv;
};

/**
 * Stores the runtime env, points the generated client at `mgtBaseUrl` and
 * registers the session headers. A rejected session dispatches
 * SESSION_EXPIRED_EVENT on `window`. Safe to call repeatedly.
 */
export const initMgtClient = (env: IRuntimeEnv): void => {
  runtimeEnv = env;
  setApiBaseUrl(env.mgtBaseUrl);
  configureMgtClient({
    getAuthToken: () => useSessionStore.getState().token,
    getSiteId: () => getEnv().mgtSiteId,
    onUnauthorized: notifySessionExpired
  });
};
