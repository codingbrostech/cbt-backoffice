import type { GameFlagInput, GameListInput, GameResult } from '@cbt-bo/api-schema/bo/models';
import { keepPreviousData, mutationOptions, queryOptions } from '@tanstack/react-query';
import { objectify, shake } from 'radash';

import { ALL_ROWS_PAGE_SIZE } from '@cbt-bo/api/common/constants';
import { withIsLike } from '@cbt-bo/api/filter/with-is-like';
import { getGameTypes, getGames, updateGameFlag } from '@cbt-bo/api/game/actions';

/**
 * Page and filters of `/mgt/v1/game/list`.
 */
export interface IGameListParams extends Omit<GameListInput, 'page' | 'pageSize'> {
  page: number;
  pageSize: number;
}

/**
 * Filter fields of the games list as form values. An empty string means the
 * field is not applied.
 */
export type TGameListFilter = Required<Omit<GameListInput, 'page' | 'pageSize'>>;

export interface IGameListPage {
  rows: GameResult[];
  total: number;
}

export const GAME_QUERY_KEY = ['game'] as const;

/**
 * Filter fields sent as a fuzzy `like:<value>` match instead of an exact one.
 */
export const GAME_LIKE_FIELDS = ['name'] as const satisfies readonly (keyof TGameListFilter)[];

export const DEFAULT_GAME_LIST_FILTER = {
  name: '',
  state: '',
  providerCode: '',
  gameType: ''
} as const satisfies TGameListFilter;

export const gameTypeListQueryKey = () => [...GAME_QUERY_KEY, 'type-list'] as const;

export const openGameListQueryKey = () => [...GAME_QUERY_KEY, 'open-list'] as const;

export const gameListQueryKey = (params: IGameListParams) =>
  [...GAME_QUERY_KEY, 'list', params] as const;

export const updateGameFlagMutationKey = () => [...GAME_QUERY_KEY, 'flag'] as const;

const isBlank = (value: unknown): boolean => !value;

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

const fetchGameList = async (params: IGameListParams): Promise<IGameListPage> => {
  const { data: rows = [], total = 0 } = await getGames(params);

  return { rows, total };
};

/**
 * Query params of the games list for a page and a filter. Blank filter fields
 * are left out so the API does not match on them, and the fields in
 * GAME_LIKE_FIELDS are sent as fuzzy matches.
 *
 * @example
 * buildGameListParams({ page: 1, pageSize: 10 }, { name: 'bac', state: '', providerCode: '', gameType: '' });
 * // { page: 1, pageSize: 10, name: 'like:bac' }
 */
export const buildGameListParams = (
  page: Pick<IGameListParams, 'page' | 'pageSize'>,
  filter: TGameListFilter
): IGameListParams => {
  const filled = shake(filter, isBlank);
  const filledLikeFields = GAME_LIKE_FIELDS.filter(field => filter[field]);
  const likeFilter = objectify(
    filledLikeFields,
    field => field,
    field => withIsLike(filter[field])
  );

  return { ...page, ...filled, ...likeFilter };
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

/**
 * One page of games for `params`. Keeps the previous page as placeholder data
 * while the next one loads.
 *
 * @example
 * const { data } = useQuery(gameListQueryOptions({ page: 1, pageSize: 10 }));
 */
export const gameListQueryOptions = (params: IGameListParams) =>
  queryOptions({
    queryKey: gameListQueryKey(params),
    queryFn: () => fetchGameList(params),
    placeholderData: keepPreviousData
  });

/**
 * Sets `staffTestOnly` through `/mgt/v1/game/flag`. The input targets either
 * one game through `gameId` or every game of a provider through
 * `providerCode`, and the result reports how many games changed.
 */
export const updateGameFlagMutationOptions = () =>
  mutationOptions({
    mutationKey: updateGameFlagMutationKey(),
    mutationFn: (input: GameFlagInput) => updateGameFlag(input)
  });
