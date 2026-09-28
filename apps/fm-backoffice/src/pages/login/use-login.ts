import {
  type ILoginInput,
  loginMutationOptions,
  sessionQueryOptions
} from '@cbt-bo/api/auth/queries';
import { clearSession } from '@cbt-bo/api/auth/session';
import { getApiErrorCode, getApiErrorMessage } from '@cbt-bo/api-schema/mgt';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearch } from '@tanstack/react-router';
import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { PATH, buildPostLoginHref } from '#/constants/path';

export interface IUseLoginResult {
  /**
   * Logs in and continues to the redirect target. Resolves `true` on success
   * and `false` once the error toast has been shown.
   */
  login: (input: ILoginInput) => Promise<boolean>;
  isPending: boolean;
}

const buildErrorTitle = (error: unknown, t: TFunction): string => {
  const code = getApiErrorCode(error);

  return code === undefined
    ? t('login.error.fail')
    : t([`login.error.code.${code}`, 'login.error.fail']);
};

export const useLogin = (): IUseLoginResult => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { redirect } = useSearch({ from: PATH.LOGIN });

  const { mutateAsync, isPending } = useMutation({
    ...loginMutationOptions(),
    onSuccess: user => {
      queryClient.setQueryData(sessionQueryOptions().queryKey, user);
      void navigate({ href: buildPostLoginHref(redirect), replace: true });
    },
    onError: error => {
      clearSession();
      toast.error(buildErrorTitle(error, t), {
        description: getApiErrorMessage(error, t('common.unknownError'))
      });
    }
  });

  const login = useCallback(
    async (input: ILoginInput): Promise<boolean> => {
      try {
        await mutateAsync(input);
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { login, isPending };
};
