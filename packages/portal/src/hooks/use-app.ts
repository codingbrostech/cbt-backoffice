import { useLocation, useNavigate } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { login } from '~/actions/auth';
import { DEFAULT_PATHS, PATH } from '~/constants/path';
import { useNotification } from '~/hooks/use-notification';
import { fetchCurrentRolePermissions } from '~/services/role-permissions';
import { applyAuthResult, clearSession } from '~/services/session';
import { appStore } from '~/store/app-store';

export interface ILoginInput {
  username: string;
  password: string;
}

export const isAuthRequiredFor = (pathname: string): boolean => pathname !== PATH.PATH_LOGIN;

const buildErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

/**
 * Session state and the login and logout actions. Effects that bootstrap the
 * session live in `useAppBootstrap`, mounted once by `AppLayout`.
 */
export const useApp = () => {
  const user = useSelector(appStore, state => state.user);
  const isReady = useSelector(appStore, state => state.isReady);
  const currentRolePermissions = useSelector(appStore, state => state.currentRolePermissions);
  const pathname = useLocation({ select: location => location.pathname });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const isAuth = Boolean(user);
  const isAuthRequired = isAuthRequiredFor(pathname);

  const userLogout = useCallback(() => {
    clearSession();
    void navigate({ to: PATH.PATH_LOGIN, replace: true });
  }, [navigate]);

  const userLogin = useCallback(
    async ({ username, password }: ILoginInput) => {
      try {
        const result = await login({ code: username, secret: password });
        const role = applyAuthResult(result);

        await fetchCurrentRolePermissions(role, role);
        await navigate({ to: DEFAULT_PATHS.authed });
      } catch (err) {
        showErrorNotification({ title: t('error.loginFail'), message: buildErrorMessage(err) });
      }
    },
    [navigate, showErrorNotification, t]
  );

  return { user, isReady, isAuth, isAuthRequired, currentRolePermissions, userLogin, userLogout };
};
