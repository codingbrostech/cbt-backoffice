import type { AuthTokenResult } from '@cbt-bo/api-schema/bo/models';
import { resetSessionExpiredFlag } from '@cbt-bo/api-schema/mgt';

import { type IUser, useSessionStore } from '@cbt-bo/api/auth/store';

/**
 * Stores the token and user from a login or validate response and arms the
 * session-expired report again. Returns the signed-in user.
 */
export const applyAuthResult = ({ token, data }: AuthTokenResult): IUser => {
  const { name = '', role = '' } = data ?? {};
  const { setToken, setUser } = useSessionStore.getState();

  const user: IUser = { name, role };

  if (token) setToken(token);
  setUser(user);
  resetSessionExpiredFlag();

  return user;
};

export const clearSession = (): void => {
  const { setToken, setUser, setCurrentRolePermissions } = useSessionStore.getState();

  setUser(undefined);
  setCurrentRolePermissions([]);
  setToken(undefined);
};
