import { type QueryKey, keepPreviousData, useQuery } from '@tanstack/react-query';
import type { RowData } from '@tanstack/react-table';
import { pick } from 'radash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useListSearch } from '~/hooks/use-list-search';
import { useNotification } from '~/hooks/use-notification';
import { buildErrorMessage } from '~/hooks/use-save-mutation';
import type { TColumnDef } from '~/table/build-column-defs';
import type { TPortalTable } from '~/table/features';
import {
  type TListSearch,
  type TSearchValues,
  buildInitialSearchValues,
  buildListParams,
  buildListSearchSchema,
  normalizeSearchValues,
  pickSearchFieldValues
} from '~/table/search-values';
import { DEFAULT_PAGE_SIZE, type IListParams, type IListResult } from '~/table/types';
import { type IListSelection, useListTable } from '~/table/use-list-table';
import type { ISearchField } from '~/types/data-table';

export interface IUseListPageOptions<
  TRow extends RowData,
  TParams extends object,
  TResult extends IListResult<TRow> = IListResult<TRow>
> {
  /**
   * Search field configuration, also the source of the route search schema.
   */
  fields: ISearchField[];
  queryKey: QueryKey;
  fetchList: (params: TParams) => Promise<TResult>;
  columns: TColumnDef<TRow>[];
  /**
   * Field values used when the route carries none, for example a required
   * select. Reset returns to them.
   */
  defaultSearch?: TSearchValues;
  isEnabled?: boolean;
  /**
   * Enables the checkbox column with the given controlled selection.
   */
  selection?: IListSelection<TRow>;
  /**
   * Keeps the search in the route search params. Defaults to true. Set
   * false for lists embedded in another page, which keep it in memory.
   */
  isRouteBound?: boolean;
}

export interface IUseListPageResult<
  TRow extends RowData,
  TParams extends object,
  TResult extends IListResult<TRow> = IListResult<TRow>
> {
  search: TListSearch;
  params: TParams;
  searchValues: TSearchValues;
  /**
   * Search field values after a reset: the page defaults with the default
   * time window applied.
   */
  defaultSearchValues: TSearchValues;
  /**
   * Last successful response. Absent until the first load completes.
   */
  list?: TResult;
  rows: TRow[];
  total: number;
  isFetching: boolean;
  /**
   * The last fetch failed. `rows` keep the previous result when the failed
   * fetch had the same params, and are empty otherwise.
   */
  isError: boolean;
  refetch: () => void;
  table: TPortalTable<TRow>;
  submitSearch: (values: TSearchValues) => void;
  resetSearch: () => void;
}

const CLEARED_STRING = '';
const CLEARED_ARRAY: string[] = [];

/**
 * Search values with every cleared field that has a page default written as
 * an explicit empty value. The route drops `undefined` keys, so without the
 * marker the default would come back on the next parse.
 */
export const buildSearchWithClearedDefaults = (
  search: TListSearch,
  defaultSearch: TSearchValues = {}
): TListSearch => {
  const marked = { ...search };

  for (const [name, defaultValue] of Object.entries(defaultSearch)) {
    if (marked[name] !== undefined) continue;

    marked[name] = Array.isArray(defaultValue) ? CLEARED_ARRAY : CLEARED_STRING;
  }

  return marked;
};

/**
 * Server-paginated list driven by the route search params. Search values and
 * pagination live in the URL, data in TanStack Query.
 *
 * @example
 * const page = useListPage({ fields, queryKey: ['admins'], fetchList, columns });
 */
export const useListPage = <
  TRow extends RowData,
  TParams extends object,
  TResult extends IListResult<TRow> = IListResult<TRow>
>({
  fields,
  queryKey,
  fetchList,
  columns,
  defaultSearch,
  isEnabled = true,
  selection,
  isRouteBound = true
}: IUseListPageOptions<TRow, TParams, TResult>): IUseListPageResult<TRow, TParams, TResult> => {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const schema = useMemo(() => buildListSearchSchema(fields), [fields]);
  const { search: routeSearch, setSearch: setRouteSearch } = useListSearch(schema);
  const [localSearch, setLocalSearch] = useState<TListSearch>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const rawSearch = isRouteBound ? routeSearch : localSearch;
  const setSearch = isRouteBound ? setRouteSearch : setLocalSearch;

  const search = useMemo(
    () =>
      buildInitialSearchValues(fields, {
        ...defaultSearch,
        ...(rawSearch as TListSearch)
      }),
    [fields, defaultSearch, rawSearch]
  );
  const params = useMemo(() => buildListParams<TParams>(fields, search), [fields, search]);
  const searchValues = useMemo(() => pickSearchFieldValues(fields, search), [fields, search]);
  const defaultSearchValues = useMemo(
    () =>
      pickSearchFieldValues(
        fields,
        buildInitialSearchValues(fields, {
          ...defaultSearch,
          page: 1,
          pageSize: DEFAULT_PAGE_SIZE
        })
      ),
    [fields, defaultSearch]
  );

  const {
    data: list,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: [...queryKey, 'list', params],
    queryFn: () => fetchList(params),
    placeholderData: keepPreviousData,
    enabled: isEnabled
  });

  const setParams = useCallback(
    ({ page, pageSize }: IListParams) => {
      setSearch({ ...search, page, pageSize });
    },
    [search, setSearch]
  );

  const submitSearch = useCallback(
    (values: TSearchValues) => {
      const normalized = normalizeSearchValues(fields, { ...search, ...values, page: 1 });

      setSearch(buildSearchWithClearedDefaults(normalized, defaultSearch));
    },
    [defaultSearch, fields, search, setSearch]
  );

  const resetSearch = useCallback(() => {
    setSearch({ page: 1, pageSize: search.pageSize });
  }, [search.pageSize, setSearch]);

  const rows = useMemo(() => list?.data ?? [], [list]);
  const total = list?.total ?? 0;

  const table = useListTable({
    columns,
    data: rows,
    total,
    params: { page: search.page, pageSize: search.pageSize },
    onParamsChange: setParams,
    selection
  });

  useEffect(() => {
    if (!selection) return;

    const visibleIds = rows.map(selection.getRowId);
    const visibleSelection = pick(selection.rowSelection, visibleIds);
    const isPruned =
      Object.keys(visibleSelection).length !== Object.keys(selection.rowSelection).length;

    if (isPruned) selection.onRowSelectionChange(visibleSelection);
  }, [rows, selection]);

  useEffect(() => {
    if (!error) return;

    showErrorNotification({ title: t('table.loadFailed'), message: buildErrorMessage(error) });
  }, [error, showErrorNotification, t]);

  return {
    search,
    params,
    searchValues,
    defaultSearchValues,
    list,
    rows,
    total,
    isFetching,
    isError,
    refetch: () => {
      void refetch();
    },
    table,
    submitSearch,
    resetSearch
  };
};
