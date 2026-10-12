import { formatApiErrorMessage, isApiError } from '@cbt-bo/api-schema/mgt';

/**
 * Message for any thrown value. An ApiError keeps its detail and code,
 * another Error its message, and anything else its string form.
 */
export const buildErrorMessage = (error: unknown): string => {
  if (isApiError(error)) return formatApiErrorMessage(error);
  if (error instanceof Error) return error.message;

  return String(error);
};
