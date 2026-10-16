import { PLAYER_QUERY_KEY } from '@cbt-bo/api/player/queries';
import { updatePlayerKycStatusMutationOptions } from '@cbt-bo/api/player-kyc/queries';
import type { PlayerKycStatusUpdateInput } from '@cbt-bo/api-schema/bo/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface IUseUpdatePlayerKycStateResult {
  updatePlayerKycState: (input: PlayerKycStatusUpdateInput) => Promise<boolean>;
  isPending: boolean;
}

export const useUpdatePlayerKycState = (): IUseUpdatePlayerKycStateResult => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useMutation({
    ...updatePlayerKycStatusMutationOptions(),
    onSuccess: async () => {
      toast.success(t('players.kycStateUpdated'));
      await queryClient.invalidateQueries({ queryKey: PLAYER_QUERY_KEY });
    }
  });

  const updatePlayerKycState = useCallback(
    async (input: PlayerKycStatusUpdateInput): Promise<boolean> => {
      try {
        await mutateAsync(input);
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { updatePlayerKycState, isPending };
};
