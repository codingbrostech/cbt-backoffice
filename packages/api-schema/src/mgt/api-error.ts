export const ERROR_GENERAL = 99999;
export const UNAUTHORIZED_API_CODE = 10001;

/**
 * Body the MGT API returns with a non-2xx status.
 */
export interface IMgtErrorBody {
  code?: number | string;
  message?: string;
  detail?: string;
}

const CODE_PREFIX_PATTERN = /^(\d+)\s*:/;
const DIGITS_PATTERN = /^\d+$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

/**
 * Numeric code that some MGT messages carry as a prefix, for example
 * `10009: 驗證碼不正確`. Absent when the message has no such prefix.
 */
export const parseErrorCode = (message?: string): number | undefined => {
  const [, digits] = CODE_PREFIX_PATTERN.exec(message ?? '') ?? [];

  return digits ? Number(digits) : undefined;
};

const parseBodyCode = (code: IMgtErrorBody['code']): number | undefined => {
  if (typeof code === 'number') return code;
  if (typeof code === 'string' && DIGITS_PATTERN.test(code)) return Number(code);

  return undefined;
};

/**
 * Picks the known error fields out of an unknown response body.
 */
export const buildMgtErrorBody = (body: unknown): IMgtErrorBody => {
  if (!isRecord(body)) return {};

  const { code, message, detail } = body;
  const isCodeKnown = typeof code === 'number' || typeof code === 'string';

  return {
    ...(isCodeKnown && { code }),
    ...(typeof message === 'string' && { message }),
    ...(typeof detail === 'string' && { detail })
  };
};

/**
 * Thrown for every non-2xx MGT response. `code` is the numeric MGT error
 * code, read from the body `code` field, else parsed from the message
 * prefix, else ERROR_GENERAL.
 */
export class ApiError extends Error {
  readonly status: number;

  readonly code: number;

  readonly detail?: string;

  readonly body: unknown;

  constructor(status: number, body: unknown) {
    const { code, message, detail } = buildMgtErrorBody(body);

    super(message ?? `HTTP ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = parseBodyCode(code) ?? parseErrorCode(message) ?? ERROR_GENERAL;
    this.detail = detail;
    this.body = body;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

export const isUnauthorizedError = (error: unknown): boolean =>
  isApiError(error) && (error.status === 401 || error.code === UNAUTHORIZED_API_CODE);

/**
 * Numeric MGT error code of a thrown value. Absent when it is not an ApiError.
 */
export const getApiErrorCode = (error: unknown): number | undefined =>
  isApiError(error) ? error.code : undefined;

/**
 * Human readable message of a thrown value. An ApiError yields its detail or
 * message, another Error its message, and anything else `fallback`.
 */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (isApiError(error)) return error.detail ?? error.message;
  if (error instanceof Error && error.message) return error.message;

  return fallback;
};

/**
 * Message followed by the code in parentheses, for toasts and logs.
 *
 * @example
 * formatApiErrorMessage(new ApiError(400, { code: 10009, message: 'bad otp' })); // 'bad otp (10009)'
 */
export const formatApiErrorMessage = ({ code, detail, message }: ApiError): string =>
  `${detail ?? message} (${code})`;
