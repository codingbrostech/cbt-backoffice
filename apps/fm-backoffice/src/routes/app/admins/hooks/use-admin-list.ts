import {
  DEFAULT_ADMIN_LIST_FILTER,
  type TAdminListFilter,
  adminListQueryOptions,
  buildAdminListParams
} from '@cbt-bo/api/admin/queries';
import type { AdminResult } from '@cbt-bo/api-schema/bo/models';
import { DEFAULT_PAGE_SIZE, type IListParams } from '@cbt-bo/component-lib/components/table';
import { useQuery } from '@tanstack/react-query';
import { isEqual } from 'radash';
import { useCallback, useState } from 'react';

export interface IUseAdminListResult {
  filter: TAdminListFilter;
  pageParams: IListParams;
  rows: AdminResult[];
  total: number;
  isFetching: boolean;
  isError: boolean;
  search: (filter: TAdminListFilter) => void;
  setPageParams: (params: IListParams) => void;
}

export const useAdminList = (): IUseAdminListResult => {
  const [filter, setFilter] = useState<TAdminListFilter>(DEFAULT_ADMIN_LIST_FILTER);
  const [pageParams, setPageParams] = useState<IListParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  const {
    data: list,
    isFetching,
    isError,
    refetch
  } = useQuery(adminListQueryOptions(buildAdminListParams(pageParams, filter)));

  const { rows = [], total = 0 } = list ?? {};

  const search = useCallback(
    (next: TAdminListFilter) => {
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
