import type { AuthTokenResult } from '@cbt-bo/api-schema/bo-fm/models';

import { appStore } from '~/store/app-store';
import { appTabsStore } from '~/store/app-tabs-store';
import { userSessionStore } from '~/store/user-session-store';

/**
 * Stores the token and user from a login or validate response and marks the
 * app as ready. Returns the role code for the follow-up permission load.
 */
export const applyAuthResult = ({ token = '', data }: AuthTokenResult): string => {
  const { name = '', role = '' } = data ?? {};

  if (token) userSessionStore.actions.setToken(token);
  appStore.actions.setUser({ name, token, role });
  appStore.actions.setIsReady(true);

  return role;
};

export const clearSession = (): void => {
  appStore.actions.setUser(undefined);
  appStore.actions.clearCurrentRolePermissions();
  userSessionStore.actions.setToken('');
  appTabsStore.actions.clearTabs();
};
