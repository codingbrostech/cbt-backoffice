import { GAME_QUERY_KEY, updateGameFlagMutationOptions } from '@cbt-bo/api/game/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface IProviderStaffTestInput {
  providerCode: string;
  isStaffTestOnly: boolean;
}

export interface IUseUpdateProviderStaffTestResult {
  /**
   * Flags every game of the provider and refreshes the games list. Resolves
   * `true` on success and `false` once the error toast has been shown.
   */
  updateProviderStaffTest: (input: IProviderStaffTestInput) => Promise<boolean>;
  isPending: boolean;
}

export const useUpdateProviderStaffTest = (): IUseUpdateProviderStaffTestResult => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useMutation({
    ...updateGameFlagMutationOptions(),
    onSuccess: async ({ affected = '0' }) => {
      const affectedCount = Number(affected);

      if (affectedCount > 0) {
        toast.success(t('gameProviders.staffTestOnly.changed', { count: affectedCount }));
      } else {
        toast.info(t('gameProviders.staffTestOnly.noChange'));
      }

      await queryClient.invalidateQueries({ queryKey: GAME_QUERY_KEY });
    }
  });

  const updateProviderStaffTest = useCallback(
    async ({ providerCode, isStaffTestOnly }: IProviderStaffTestInput): Promise<boolean> => {
      try {
        await mutateAsync({ providerCode, staffTestOnly: isStaffTestOnly });
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { updateProviderStaffTest, isPending };
};
