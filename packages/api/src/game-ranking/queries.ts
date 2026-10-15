import type {
  GameRankingItemInput,
  GameRankingMutateInput,
  GameRankingResult,
  GameResult
} from '@cbt-bo/api-schema/bo/models';
import { mutationOptions, queryOptions } from '@tanstack/react-query';

import { getGameRanking, mutateGameRanking } from '@cbt-bo/api/game-ranking/actions';

/**
 * One ranked game as the ranking editor holds it. The rank is not stored,
 * since the position in the list is what `/mgt/v1/gameranking/mutate` reads.
 */
export interface IGameRankingEntry {
  gameId: string;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  /**
   * Game record the API returns alongside the entry, for preview only.
   */
  game?: GameResult;
}

export const GAME_RANKING_QUERY_KEY = ['game-ranking'] as const;

export const gameRankingListQueryKey = () => [...GAME_RANKING_QUERY_KEY, 'list'] as const;

export const mutateGameRankingMutationKey = () => [...GAME_RANKING_QUERY_KEY, 'mutate'] as const;

/**
 * Ranked entries in the order the API returned them. A row without a `gameId`
 * is left out, since it cannot be written back.
 */
export const buildGameRankingEntries = (rows: GameRankingResult[]): IGameRankingEntry[] =>
  rows.flatMap(({ gameId, titles = {}, descriptions = {}, game }) =>
    gameId ? [{ gameId, titles, descriptions, game }] : []
  );

const fetchGameRankingEntries = async (): Promise<IGameRankingEntry[]> => {
  const { data: rows = [] } = await getGameRanking({});

  return buildGameRankingEntries(rows);
};

/**
 * Mutate payload for the whole table. The order of `entries` becomes the
 * rank, and any entry left out is removed by the API.
 *
 * @example
 * buildGameRankingMutateItems([{ gameId: 'g1', titles: { en: 'Top' }, descriptions: {} }]);
 * // [{ gameId: 'g1', titles: { en: 'Top' }, descriptions: {} }]
 */
export const buildGameRankingMutateItems = (
  entries: readonly IGameRankingEntry[]
): GameRankingItemInput[] =>
  entries.map(({ gameId, titles, descriptions }) => ({ gameId, titles, descriptions }));

/**
 * The current ranking, ordered from the top rank down.
 *
 * @example
 * const { data } = useQuery(gameRankingListQueryOptions());
 */
export const gameRankingListQueryOptions = () =>
  queryOptions({
    queryKey: gameRankingListQueryKey(),
    queryFn: fetchGameRankingEntries
  });

/**
 * Overwrites the whole ranking through `/mgt/v1/gameranking/mutate`.
 */
export const mutateGameRankingMutationOptions = () =>
  mutationOptions({
    mutationKey: mutateGameRankingMutationKey(),
    mutationFn: (input: GameRankingMutateInput) => mutateGameRanking(input)
  });
