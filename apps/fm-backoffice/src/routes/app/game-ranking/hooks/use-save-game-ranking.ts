import {
  GAME_RANKING_QUERY_KEY,
  type IGameRankingEntry,
  buildGameRankingMutateItems,
  mutateGameRankingMutationOptions
} from '@cbt-bo/api/game-ranking/queries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export interface IUseSaveGameRankingResult {
  saveRanking: (entries: readonly IGameRankingEntry[]) => Promise<boolean>;
  isPending: boolean;
}

export const useSaveGameRanking = (): IUseSaveGameRankingResult => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { mutateAsync, isPending } = useMutation({
    ...mutateGameRankingMutationOptions(),
    onSuccess: async () => {
      toast.success(t('gameRanking.saved'));
      await queryClient.invalidateQueries({ queryKey: GAME_RANKING_QUERY_KEY });
    }
  });

  const saveRanking = useCallback(
    async (entries: readonly IGameRankingEntry[]): Promise<boolean> => {
      const items = buildGameRankingMutateItems(entries);

      try {
        await mutateAsync({ items });
        return true;
      } catch {
        return false;
      }
    },
    [mutateAsync]
  );

  return { saveRanking, isPending };
};
