import type { GameResult } from '@cbt-bo/api-schema/bo/models';
import { queryOptions } from '@tanstack/react-query';

import { ALL_ROWS_PAGE_SIZE } from '@cbt-bo/api/common/constants';
import { getGameTypes, getGames } from '@cbt-bo/api/game/actions';

export const GAME_QUERY_KEY = ['game'] as const;

export const gameTypeListQueryKey = () => [...GAME_QUERY_KEY, 'type-list'] as const;

export const openGameListQueryKey = () => [...GAME_QUERY_KEY, 'open-list'] as const;

const isOpenGame = ({ isOpen, state }: GameResult): boolean =>
  Boolean(isOpen && state === 'active');

const fetchGameTypes = async (): Promise<string[]> => {
  const { data: gameTypes = [] } = await getGameTypes({});

  return gameTypes;
};

const fetchOpenGames = async (): Promise<GameResult[]> => {
  const { data: games = [] } = await getGames({ page: 1, pageSize: ALL_ROWS_PAGE_SIZE });

  return games.filter(isOpenGame);
};

/**
 * Every allowed game type value, in the order the API returns them, for game
 * type pickers.
 *
 * @example
 * const { data: gameTypes = [] } = useQuery(gameTypeListQueryOptions());
 */
export const gameTypeListQueryOptions = () =>
  queryOptions({
    queryKey: gameTypeListQueryKey(),
    queryFn: fetchGameTypes,
    staleTime: Infinity
  });

/**
 * Every open, active game in one request through ALL_ROWS_PAGE_SIZE, for game
 * pickers.
 *
 * @example
 * const { data: games = [] } = useQuery(openGameListQueryOptions());
 */
export const openGameListQueryOptions = () =>
  queryOptions({
    queryKey: openGameListQueryKey(),
    queryFn: fetchOpenGames
  });
