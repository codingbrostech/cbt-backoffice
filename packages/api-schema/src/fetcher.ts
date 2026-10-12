let apiBaseUrl = '';

const parseResponseBody = (body: string | null, input: string, status: number): unknown => {
  if (!body) return {};

  try {
    return JSON.parse(body);
  } catch {
    throw new SyntaxError(
      `[api-schema] Response from ${input} is not valid JSON (status ${status})`
    );
  }
};

/**
 * Sets the origin prefixed to every generated request path. Defaults to an
 * empty string, which makes requests relative to the current origin.
 *
 * @example
 * setApiBaseUrl('https://adminapi-fm.int.cbtdev.com');
 */
export const setApiBaseUrl = (baseUrl: string): void => {
  apiBaseUrl = baseUrl;
};

/**
 * Origin currently prefixed to generated request paths.
 */
export const getApiBaseUrl = (): string => apiBaseUrl;

/**
 * Mutator for every generated client. Prefixes the base URL set through
 * setApiBaseUrl and returns the parsed body with the status and headers.
 */
export const customFetch = async <T>(input: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(`${apiBaseUrl}${input}`, init);
  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data = parseResponseBody(body, input, res.status);
  return { data, status: res.status, headers: res.headers } as T;
};
