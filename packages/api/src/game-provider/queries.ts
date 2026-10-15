import type { GameProviderResult } from '@cbt-bo/api-schema/bo/models';
import { queryOptions } from '@tanstack/react-query';
import { objectify } from 'radash';

import { ALL_ROWS_PAGE_SIZE } from '@cbt-bo/api/common/constants';
import { getGameProviders } from '@cbt-bo/api/game-provider/actions';

export const GAME_PROVIDER_QUERY_KEY = ['game-provider'] as const;

export const gameProviderListQueryKey = () => [...GAME_PROVIDER_QUERY_KEY, 'list'] as const;

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
