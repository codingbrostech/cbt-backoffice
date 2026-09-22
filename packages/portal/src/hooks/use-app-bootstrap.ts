import { useLocation, useNavigate } from '@tanstack/react-router';
import { useSelector } from '@tanstack/react-store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { validateToken } from '~/actions/auth';
import { DEFAULT_PATHS, PATH_SLASH } from '~/constants/path';
import { useApp } from '~/hooks/use-app';
import { useDebouncedCallback } from '~/hooks/use-debounced-callback';
import { useNotification } from '~/hooks/use-notification';
import { UNAUTHORIZED_EVENT } from '~/services/mgt';
import { fetchCurrentRolePermissions } from '~/services/role-permissions';
import { applyAuthResult } from '~/services/session';
import { appStore } from '~/store/app-store';
import { userSessionStore } from '~/store/user-session-store';

const UNAUTHORIZED_DEBOUNCE_MS = 350;

const validateSession = async (): Promise<void> => {
  try {
    const result = await validateToken({});
    const role = applyAuthResult(result);

    await fetchCurrentRolePermissions(role, role);
  } catch {
    appStore.actions.setIsReady(true);
  }
};

/**
 * Validates the stored token on first load, keeps the route and the session
 * in agreement, and logs out on UNAUTHORIZED_EVENT. Mount once.
 */
export const useAppBootstrap = (): void => {
  const isHydrated = useSelector(userSessionStore, state => state.isHydrated);
  const pathname = useLocation({ select: location => location.pathname });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const { isReady, isAuth, isAuthRequired, userLogout } = useApp();

  const handleUnauthorized = useDebouncedCallback(() => {
    userLogout();
    showErrorNotification({ title: t('error.loginFail'), message: t('error.sessionExpired') });
  }, UNAUTHORIZED_DEBOUNCE_MS);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isReady) {
      if (isAuthRequired) {
        void validateSession();
      } else {
        appStore.actions.setIsReady(true);
      }
      return;
    }

    if (isAuthRequired && !isAuth) {
      userLogout();
    } else if (!isAuthRequired && isAuth) {
      void navigate({ to: DEFAULT_PATHS.authed });
    } else if (pathname === PATH_SLASH && isAuth) {
      void navigate({ to: DEFAULT_PATHS.authed, replace: true });
    }
  }, [isHydrated, isReady, isAuthRequired, isAuth, pathname, navigate, userLogout]);

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, [handleUnauthorized]);
};
