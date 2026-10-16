import type {
  GameProviderListInput,
  GameProviderResult,
  GameProviderRetryLogoutInput
} from '@cbt-bo/api-schema/bo/models';
import { keepPreviousData, mutationOptions, queryOptions } from '@tanstack/react-query';
import { objectify, shake } from 'radash';

import { ALL_ROWS_PAGE_SIZE } from '@cbt-bo/api/common/constants';
import { withIsLike } from '@cbt-bo/api/filter/with-is-like';
import { getGameProviders, retryGameProviderLogout } from '@cbt-bo/api/game-provider/actions';

/**
 * Page and filters of `/mgt/v1/gameprovider/list`.
 */
export interface IGameProviderListParams extends Omit<GameProviderListInput, 'page' | 'pageSize'> {
  page: number;
  pageSize: number;
}

/**
 * Filter fields of the game providers list as form values. An empty string
 * means the field is not applied.
 */
export type TGameProviderListFilter = Required<Omit<GameProviderListInput, 'page' | 'pageSize'>>;

export interface IGameProviderListPage {
  rows: GameProviderResult[];
  total: number;
}

export const GAME_PROVIDER_QUERY_KEY = ['game-provider'] as const;

/**
 * Filter fields sent as a fuzzy `like:<value>` match instead of an exact one.
 */
export const GAME_PROVIDER_LIKE_FIELDS = [
  'code',
  'name'
] as const satisfies readonly (keyof TGameProviderListFilter)[];

export const DEFAULT_GAME_PROVIDER_LIST_FILTER = {
  code: '',
  name: '',
  state: ''
} as const satisfies TGameProviderListFilter;

export const gameProviderListQueryKey = () => [...GAME_PROVIDER_QUERY_KEY, 'list'] as const;

export const gameProviderListPageQueryKey = (params: IGameProviderListParams) =>
  [...GAME_PROVIDER_QUERY_KEY, 'list-page', params] as const;

export const retryGameProviderLogoutMutationKey = () =>
  [...GAME_PROVIDER_QUERY_KEY, 'retry-logout'] as const;

const isBlank = (value: unknown): boolean => !value;

const fetchGameProviderListPage = async (
  params: IGameProviderListParams
): Promise<IGameProviderListPage> => {
  const { data: rows = [], total = 0 } = await getGameProviders(params);

  return { rows, total };
};

const fetchGameProviders = async (): Promise<GameProviderResult[]> => {
  const { data: providers = [] } = await getGameProviders({ pageSize: ALL_ROWS_PAGE_SIZE });

  return providers;
};

/**
 * Provider display name by provider code. A provider without a code or a name
 * is left out, so a lookup miss means the code should be shown as is.
 *
 * @example
 * buildProviderNameByCode([{ code: 'bti', name: 'BTI' }]); // { bti: 'BTI' }
 */
export const buildProviderNameByCode = (
  providers: readonly GameProviderResult[]
): Readonly<Record<string, string>> => {
  const namedProviders = providers.flatMap(({ code, name }) =>
    code && name ? [{ code, name }] : []
  );

  return objectify(
    namedProviders,
    ({ code }) => code,
    ({ name }) => name
  );
};

/**
 * Every game provider in one request through ALL_ROWS_PAGE_SIZE, for provider
 * pickers.
 *
 * @example
 * const { data: providers = [] } = useQuery(gameProviderListQueryOptions());
 */
export const gameProviderListQueryOptions = () =>
  queryOptions({
    queryKey: gameProviderListQueryKey(),
    queryFn: fetchGameProviders
  });

/**
 * Query params of the game providers list for a page and a filter. Blank
 * filter fields are left out so the API does not match on them, and the
 * fields in GAME_PROVIDER_LIKE_FIELDS are sent as fuzzy matches.
 *
 * @example
 * buildGameProviderListParams({ page: 1, pageSize: 10 }, { code: 'jl', name: '', state: '' });
 * // { page: 1, pageSize: 10, code: 'like:jl' }
 */
export const buildGameProviderListParams = (
  page: Pick<IGameProviderListParams, 'page' | 'pageSize'>,
  filter: TGameProviderListFilter
): IGameProviderListParams => {
  const filled = shake(filter, isBlank);
  const filledLikeFields = GAME_PROVIDER_LIKE_FIELDS.filter(field => filter[field]);
  const likeFilter = objectify(
    filledLikeFields,
    field => field,
    field => withIsLike(filter[field])
  );

  return { ...page, ...filled, ...likeFilter };
};

/**
 * One page of game providers for `params`. Keeps the previous page as
 * placeholder data while the next one loads.
 *
 * @example
 * const { data } = useQuery(gameProviderListPageQueryOptions({ page: 1, pageSize: 10 }));
 */
export const gameProviderListPageQueryOptions = (params: IGameProviderListParams) =>
  queryOptions({
    queryKey: gameProviderListPageQueryKey(params),
    queryFn: () => fetchGameProviderListPage(params),
    placeholderData: keepPreviousData
  });

/**
 * Replays the provider's failed logout callbacks through
 * `/mgt/v1/gameprovider/retrylogout`. The endpoint takes the provider code
 * alone and covers every affected player.
 */
export const retryGameProviderLogoutMutationOptions = () =>
  mutationOptions({
    mutationKey: retryGameProviderLogoutMutationKey(),
    mutationFn: (input: GameProviderRetryLogoutInput) => retryGameProviderLogout(input)
  });
