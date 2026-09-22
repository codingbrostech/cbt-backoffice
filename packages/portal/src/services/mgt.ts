import { userSessionStore } from '~/store/user-session-store';
import { getEnv } from '~/utils/env';
import { buildExportExtension } from '~/utils/export-excel';

interface IMgtEnvelope<TResult> {
  data: TResult;
  status: number;
  headers: Headers;
}

type TMgtService<TInput, TResult> = (
  input: TInput,
  options?: RequestInit
) => Promise<IMgtEnvelope<TResult>>;

interface IMgtErrorBody {
  code?: number;
  message?: string;
  detail?: string;
}

export interface IMgtBlobResult {
  blob: Blob;
  headers: Headers;
  extension: string;
}

export interface IUnauthorizedEventDetail {
  apiUrl: string;
}

export const ERROR_GENERAL = 99999;
export const UNAUTHORIZED_API_CODE = 10001;
export const UNAUTHORIZED_EVENT = 'UserUnauthorized';
const UNKNOWN_ERROR_MESSAGE = 'unknown error';

export class ApiError extends Error {
  code: number;

  detail?: string;

  data: unknown;

  constructor(code: number, message: string, detail?: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.detail = detail;
    this.data = data ?? {};
  }
}

export const formatApiErrorMessage = (err: ApiError): string =>
  `${err.detail ?? err.message} (${err.code})`;

const isMgtErrorBody = (value: unknown): value is IMgtErrorBody =>
  typeof value === 'object' && value !== null;

const buildMgtHeaders = (): Record<string, string> => {
  const { token } = userSessionStore.state;
  const { mgtSiteId } = getEnv();

  return {
    ...(token && { Authorization: `Bearer ${token}` }),
    'X-Tgpx-Site': mgtSiteId
  };
};

const isSessionActive = (): boolean => Boolean(userSessionStore.state.token);

const notifyUnauthorized = (apiUrl: string): void => {
  if (typeof window === 'undefined') return;

  const detail: IUnauthorizedEventDetail = { apiUrl };
  window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT, { detail }));
};

const assertMgtSuccess = (
  status: number,
  body: unknown,
  apiUrl: string,
  isNotifyingUnauthorized: boolean
): void => {
  if (status < 400) return;

  const errorBody = isMgtErrorBody(body) ? body : {};
  const isUnauthorized = status === 401 || errorBody.code === UNAUTHORIZED_API_CODE;

  if (isUnauthorized) {
    if (isNotifyingUnauthorized) notifyUnauthorized(apiUrl);
    throw new ApiError(status, 'Unauthorized', undefined, body);
  }

  throw new ApiError(
    errorBody.code ?? ERROR_GENERAL,
    errorBody.message ?? UNKNOWN_ERROR_MESSAGE,
    errorBody.detail,
    body
  );
};

const postMgt = (path: string, body: object): Promise<Response> =>
  fetch(`${getEnv().mgtBaseUrl}${path}`, {
    method: 'POST',
    headers: { ...buildMgtHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

/**
 * Wraps a generated `@cbt-bo/api-schema` service function as a portal action.
 * Adds the session headers, resolves with the response data and throws an
 * `ApiError` for every non-2xx status. A 401, or a body carrying
 * UNAUTHORIZED_API_CODE, also dispatches UNAUTHORIZED_EVENT on `window` when
 * a session token was sent.
 *
 * @example
 * export const getAdmins = createMgtAction(mgtServiceAdminList);
 */
export const createMgtAction =
  <TInput, TResult>(service: TMgtService<TInput, TResult>) =>
  async (input: TInput): Promise<TResult> => {
    const isNotifyingUnauthorized = isSessionActive();
    const envelope = await service(input, { headers: buildMgtHeaders() });

    assertMgtSuccess(
      envelope.status,
      envelope.data,
      service.name || 'mgt',
      isNotifyingUnauthorized
    );

    return envelope.data;
  };

/**
 * JSON POST action for MGT endpoints outside the OpenAPI spec. Same header
 * and error handling as `createMgtAction`.
 */
export const createMgtPostAction =
  <TResult>(path: string) =>
  async (body: object): Promise<TResult> => {
    const isNotifyingUnauthorized = isSessionActive();
    const res = await postMgt(path, body);
    const data: unknown = await res.json().catch(() => ({}));

    assertMgtSuccess(res.status, data, path, isNotifyingUnauthorized);

    return data as TResult;
  };

/**
 * POST action for MGT export endpoints that answer with a file body.
 */
export const createMgtBlobAction =
  (path: string) =>
  async (body: object): Promise<IMgtBlobResult> => {
    const isNotifyingUnauthorized = isSessionActive();
    const res = await postMgt(path, body);

    if (!res.ok) {
      const data: unknown = await res.json().catch(() => ({}));
      assertMgtSuccess(res.status, data, path, isNotifyingUnauthorized);
    }

    const blob = await res.blob();
    const extension = buildExportExtension(res.headers);

    return { blob, headers: res.headers, extension };
  };
