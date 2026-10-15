import type { GameProviderResult } from '@cbt-bo/api-schema/bo/models';
import { queryOptions } from '@tanstack/react-query';

import { ALL_ROWS_PAGE_SIZE } from '@cbt-bo/api/common/constants';
import { getGameProviders } from '@cbt-bo/api/game-provider/actions';

export const GAME_PROVIDER_QUERY_KEY = ['game-provider'] as const;

export const gameProviderListQueryKey = () => [...GAME_PROVIDER_QUERY_KEY, 'list'] as const;

const fetchGameProviders = async (): Promise<GameProviderResult[]> => {
  const { data: providers = [] } = await getGameProviders({ pageSize: ALL_ROWS_PAGE_SIZE });

  return providers;
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
