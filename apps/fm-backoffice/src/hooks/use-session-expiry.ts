import { resetSessionQuery } from '@cbt-bo/api/auth/queries';
import { clearSession } from '@cbt-bo/api/auth/session';
import { useSessionStore } from '@cbt-bo/api/auth/store';
import { SESSION_EXPIRED_EVENT } from '@cbt-bo/api/client';
import { usePageTabsStore } from '@cbt-bo/api/page-tabs/store';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { PATH } from '#/constants/path';

/**
 * Signs the user out and returns to the login page when the API reports an
 * expired session. Mount once.
 */
export const useSessionExpiry = (): void => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const handleSessionExpired = useCallback(() => {
    if (!useSessionStore.getState().token) return;

    clearSession();
    resetSessionQuery(queryClient);
    toast.error(t('login.error.fail'), { description: t('login.error.sessionExpired') });
    void navigate({ to: PATH.LOGIN, replace: true }).then(() => {
      queryClient.clear();
      usePageTabsStore.getState().clearPaths();
    });
  }, [navigate, queryClient, t]);

  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [handleSessionExpired]);
};
