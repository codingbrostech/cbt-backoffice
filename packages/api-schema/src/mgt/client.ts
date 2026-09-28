import { ApiError, isUnauthorizedError } from './api-error';

/**
 * Shape every generated request function resolves with.
 */
export interface IMgtEnvelope<TResult> {
  data: TResult;
  status: number;
  headers: Headers;
}

export type TMgtService<TInput, TResult> = (
  input: TInput,
  options?: RequestInit
) => Promise<IMgtEnvelope<TResult>>;

export interface IUnauthorizedDetail {
  apiUrl: string;
  status: number;
}

export interface IMgtClientConfig {
  /**
   * Bearer token sent as `Authorization`. The header is omitted when it
   * resolves to nothing.
   */
  getAuthToken: () => string | undefined;
  /**
   * Value of the SITE_HEADER header.
   */
  getSiteId: () => string;
  /**
   * Called once when a request that carried a token is rejected as
   * unauthorized. `resetSessionExpiredFlag` arms it again.
   */
  onUnauthorized?: (detail: IUnauthorizedDetail) => void;
}

export const SITE_HEADER = 'X-Tgpx-Site';
const AUTHORIZATION_HEADER = 'Authorization';
const UNKNOWN_API_URL = 'mgt';

let clientConfig: IMgtClientConfig | undefined;
let isSessionExpiredFired = false;

/**
 * Registers how the session headers are built. Call once at app boot, before
 * any action created with `createMgtAction` runs.
 *
 * @example
 * configureMgtClient({ getAuthToken: () => store.getState().token, getSiteId: () => 'tgpxloc' });
 */
export const configureMgtClient = (config: IMgtClientConfig): void => {
  clientConfig = config;
};

/**
 * Lets `onUnauthorized` fire again, for example after a fresh login.
 */
export const resetSessionExpiredFlag = (): void => {
  isSessionExpiredFired = false;
};

const getClientConfig = (): IMgtClientConfig => {
  if (!clientConfig) {
    throw new Error('[api-schema] configureMgtClient must be called before the MGT API is used');
  }

  return clientConfig;
};

/**
 * Session headers for one request: the bearer token when present and the
 * site id.
 */
export const buildMgtHeaders = (): Record<string, string> => {
  const { getAuthToken, getSiteId } = getClientConfig();
  const token = getAuthToken();

  return {
    ...(token && { [AUTHORIZATION_HEADER]: `Bearer ${token}` }),
    [SITE_HEADER]: getSiteId()
  };
};

const notifySessionExpired = (detail: IUnauthorizedDetail): void => {
  if (isSessionExpiredFired) return;

  isSessionExpiredFired = true;
  getClientConfig().onUnauthorized?.(detail);
};

/**
 * Resolves with the envelope data for a 2xx status and throws an ApiError
 * for anything else. An unauthorized response to a request that carried a
 * token also reports the expired session once.
 */
export const assertMgtSuccess = <TResult>(
  envelope: IMgtEnvelope<TResult>,
  apiUrl: string,
  isSessionSent: boolean
): TResult => {
  const { status, data } = envelope;

  if (status >= 200 && status < 300) return data;

  const error = new ApiError(status, data);

  if (isSessionSent && isUnauthorizedError(error)) notifySessionExpired({ apiUrl, status });

  throw error;
};

/**
 * Wraps a generated request function as an action. Adds the session headers,
 * resolves with the response data and throws an ApiError for every non-2xx
 * status.
 *
 * @example
 * export const login = createMgtAction(mgtServiceAuthLogin);
 * const result = await login({ code: 'admin', secret: 'secret' });
 */
export const createMgtAction =
  <TInput, TResult>(service: TMgtService<TInput, TResult>) =>
  async (input: TInput): Promise<TResult> => {
    const headers = buildMgtHeaders();
    const isSessionSent = AUTHORIZATION_HEADER in headers;

    const envelope = await service(input, { headers });

    return assertMgtSuccess(envelope, service.name || UNKNOWN_API_URL, isSessionSent);
  };
