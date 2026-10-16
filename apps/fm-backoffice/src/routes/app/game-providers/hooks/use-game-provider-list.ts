import {
  DEFAULT_GAME_PROVIDER_LIST_FILTER,
  type TGameProviderListFilter,
  buildGameProviderListParams,
  gameProviderListPageQueryOptions
} from '@cbt-bo/api/game-provider/queries';
import type { GameProviderResult } from '@cbt-bo/api-schema/bo/models';
import { DEFAULT_PAGE_SIZE, type IListParams } from '@cbt-bo/component-lib/components/table';
import { useQuery } from '@tanstack/react-query';
import { isEqual } from 'radash';
import { useCallback, useState } from 'react';

export interface IUseGameProviderListResult {
  filter: TGameProviderListFilter;
  pageParams: IListParams;
  rows: GameProviderResult[];
  total: number;
  isFetching: boolean;
  isError: boolean;
  /**
   * Applies `filter` and returns to the first page. Refetches the list when
   * the filter and page are already applied.
   */
  search: (filter: TGameProviderListFilter) => void;
  setPageParams: (params: IListParams) => void;
}

export const useGameProviderList = (): IUseGameProviderListResult => {
  const [filter, setFilter] = useState<TGameProviderListFilter>(DEFAULT_GAME_PROVIDER_LIST_FILTER);
  const [pageParams, setPageParams] = useState<IListParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  const {
    data: list,
    isFetching,
    isError,
    refetch
  } = useQuery(gameProviderListPageQueryOptions(buildGameProviderListParams(pageParams, filter)));

  const { rows = [], total = 0 } = list ?? {};

  const search = useCallback(
    (next: TGameProviderListFilter) => {
      const isSameSearch = pageParams.page === 1 && isEqual(next, filter);

      if (isSameSearch) {
        void refetch();
        return;
      }

      setFilter(next);
      setPageParams(prev => ({ ...prev, page: 1 }));
    },
    [filter, pageParams.page, refetch]
  );

  return { filter, pageParams, rows, total, isFetching, isError, search, setPageParams };
};
