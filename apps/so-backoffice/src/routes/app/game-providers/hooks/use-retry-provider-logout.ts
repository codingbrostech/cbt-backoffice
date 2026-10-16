import { retryGameProviderLogoutMutationOptions } from '@cbt-bo/api/game-provider/queries';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface IUseRetryProviderLogoutResult {
  /**
   * Replays the provider's failed logout callbacks. Resolves `true` on
   * success and `false` once the error toast has been shown.
   */
  retryProviderLogout: (providerCode: string) => Promise<boolean>;
  isPending: boolean;
}

export const useRetryProviderLogout = (): IUseRetryProviderLogoutResult => {
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useMutation({
    ...retryGameProviderLogoutMutationOptions(),
    onSuccess: () => {
      toast.success(t('gameProviders.retryLogout.triggered'));
    }
  });

  const retryProviderLogout = useCallback(
    async (providerCode: string): Promise<boolean> => {
      try {
        await mutateAsync({ gameProviderCode: providerCode });
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { retryProviderLogout, isPending };
};
