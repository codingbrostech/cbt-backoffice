import type { GameHomeTabItem } from '@cbt-bo/api-schema/bo-fm/models';
import { queryOptions } from '@tanstack/react-query';

import { getGameHomeTabList, listGameVectorRelationByVec } from '~/actions/game-categories';

export const GAME_HOME_TABS_QUERY_KEY = 'game-home-tabs';
export const GAME_VECTOR_RELATIONS_QUERY_KEY = 'game-vector-relations';

/**
 * The home tabs with the vector codes shown under each of them.
 */
export const gameHomeTabsQueryOptions = () =>
  queryOptions({
    queryKey: [GAME_HOME_TABS_QUERY_KEY],
    queryFn: async (): Promise<GameHomeTabItem[]> => {
      const { data = [] } = await getGameHomeTabList({});

      return data;
    }
  });

/**
 * The vector and its game relations for one home tab and vector code.
 */
export const gameVectorRelationsQueryOptions = (homeTab: string, code: string) =>
  queryOptions({
    queryKey: [GAME_VECTOR_RELATIONS_QUERY_KEY, homeTab, code],
    queryFn: () => listGameVectorRelationByVec({ homeTab, code }),
    enabled: Boolean(homeTab && code)
  });
