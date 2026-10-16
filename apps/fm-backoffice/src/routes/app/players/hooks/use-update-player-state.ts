import { PLAYER_QUERY_KEY, updatePlayerMutationOptions } from '@cbt-bo/api/player/queries';
import type { PlayerUpdateInput } from '@cbt-bo/api-schema/bo/models';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface IUseUpdatePlayerStateResult {
  updatePlayerState: (input: PlayerUpdateInput) => Promise<boolean>;
  isPending: boolean;
}

export const useUpdatePlayerState = (): IUseUpdatePlayerStateResult => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useMutation({
    ...updatePlayerMutationOptions(),
    onSuccess: async () => {
      toast.success(t('players.stateUpdated'));
      await queryClient.invalidateQueries({ queryKey: PLAYER_QUERY_KEY });
    }
  });

  const updatePlayerState = useCallback(
    async (input: PlayerUpdateInput): Promise<boolean> => {
      try {
        await mutateAsync(input);
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { updatePlayerState, isPending };
};
