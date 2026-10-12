import type { AuthTokenResult } from '@cbt-bo/api-schema/bo/models';
import { type QueryClient, mutationOptions, queryOptions } from '@tanstack/react-query';

import { loadCurrentRolePermissions } from '@cbt-bo/api/admin-role/queries';
import { login, logout, validateToken } from '@cbt-bo/api/auth/actions';
import { applyAuthResult, clearSession } from '@cbt-bo/api/auth/session';
import { type IUser, useSessionStore } from '@cbt-bo/api/auth/store';

export interface ILoginInput {
  username: string;
  password: string;
}

export const AUTH_QUERY_KEY = ['auth'] as const;

export const sessionQueryKey = () => [...AUTH_QUERY_KEY, 'session'] as const;

export const loginMutationKey = () => [...AUTH_QUERY_KEY, 'login'] as const;

const establishSession = async (result: AuthTokenResult): Promise<IUser> => {
  const user = applyAuthResult(result);

  await loadCurrentRolePermissions(user.role);

  return user;
};

const fetchSession = async (): Promise<IUser | null> => {
  const { token } = useSessionStore.getState();

  if (!token) return null;

  try {
    const result = await validateToken({});

    return await establishSession(result);
  } catch {
    clearSession();

    return null;
  }
};

const loginUser = async ({ username, password }: ILoginInput): Promise<IUser> => {
  const result = await login({ code: username, secret: password });

  return establishSession(result);
};

/**
 * Signs out on the API when a token is present and clears the local session
 * either way. Never rejects.
 */
export const signOut = async (): Promise<void> => {
  const { token } = useSessionStore.getState();
  const request = token ? logout({}) : undefined;

  clearSession();
  await request?.catch(() => undefined);
};

/**
 * Signed-in user derived from the persisted token, or `null` when there is
 * none or the API rejects it. Static, so it is fetched once and kept until
 * the query client is cleared.
 */
export const sessionQueryOptions = () =>
  queryOptions({
    queryKey: sessionQueryKey(),
    queryFn: fetchSession,
    staleTime: 'static',
    gcTime: Infinity,
    meta: { isGlobalErrorSuppressed: true }
  });

/**
 * Resolves the cached session, fetching it on first use.
 *
 * @example
 * const user = await ensureSession(queryClient);
 */
export const ensureSession = (queryClient: QueryClient): Promise<IUser | null> =>
  queryClient.query(sessionQueryOptions());

/**
 * Removes the cached session so `ensureSession` fetches it again on next use.
 */
export const resetSessionQuery = (queryClient: QueryClient): void => {
  queryClient.removeQueries({ queryKey: sessionQueryKey() });
};

/**
 * Logs in with the admin code and secret, then loads the role permissions.
 * Resolves with the signed-in user.
 */
export const loginMutationOptions = () =>
  mutationOptions({
    mutationKey: loginMutationKey(),
    mutationFn: loginUser,
    meta: { isGlobalErrorSuppressed: true }
  });
