import { buildOffsetTime } from '@cbt-bo/api/common/time';
import { usePreferencesStore } from '@cbt-bo/api/preferences/store';
import {
  DEFAULT_WAGER_TXN_LIST_FILTER,
  type TWagerTxnListFilter,
  type TWagerTxnSummary,
  buildWagerTxnListParams,
  wagerTxnListQueryOptions,
  wagerTxnSummaryQueryOptions
} from '@cbt-bo/api/wagertxn/queries';
import type { TxnWagerResult } from '@cbt-bo/api-schema/bo/models';
import { DEFAULT_PAGE_SIZE, type IListParams } from '@cbt-bo/component-lib/components/table';
import {
  TIME_RANGE_MAX_ONE_MONTHS,
  buildQuickRange,
  buildSearchRange
} from '@cbt-bo/component-lib/lib/date-range';
import { useQuery } from '@tanstack/react-query';
import { isEqual } from 'radash';
import { useCallback, useState } from 'react';

import {
  DEFAULT_PLAYER_SEARCH_FILTER,
  type TPlayerSearchFilter
} from '#/components/search/PlayerSearchFields';
import { useExportJob } from '#/hooks/use-export-job';

const buildTodayFilterRange = (timezoneMinutes: number) => {
  const { from, to } = buildQuickRange('today', new Date(), timezoneMinutes);

  return { timeFrom: from, timeTo: to };
};

/**
 * The player filter plus the bet transactions filter.
 */
export type TBetTransFilter = TPlayerSearchFilter & TWagerTxnListFilter;

export interface IUseBetTransListResult {
  defaultFilter: TBetTransFilter;
  filter: TBetTransFilter;
  pageParams: IListParams;
  rows: TxnWagerResult[];
  total: number;
  summary: TWagerTxnSummary;
  isFetching: boolean;
  isSummaryFetching: boolean;
  isError: boolean;
  isExporting: boolean;
  search: (filter: TBetTransFilter) => void;
  setPageParams: (params: IListParams) => void;
  exportList: () => void;
}

/**
 * Bet transactions list state. The filter starts on today in the display
 * timezone, and its time bounds are sent at that timezone's offset. Each
 * search keeps the bet time within TIME_RANGE_MAX_ONE_MONTHS months ending no later
 * than today.
 */
export const useBetTransList = (): IUseBetTransListResult => {
  const timezoneMinutes = usePreferencesStore(state => state.timezoneMinutes);
  const [defaultFilter] = useState<TBetTransFilter>(() => ({
    ...DEFAULT_PLAYER_SEARCH_FILTER,
    ...DEFAULT_WAGER_TXN_LIST_FILTER,
    ...buildTodayFilterRange(timezoneMinutes)
  }));
  const [filter, setFilter] = useState<TBetTransFilter>(defaultFilter);
  const [pageParams, setPageParams] = useState<IListParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  const { startExport, isExporting } = useExportJob();

  const requestFilter = {
    ...filter,
    timeFrom: buildOffsetTime(filter.timeFrom, timezoneMinutes),
    timeTo: buildOffsetTime(filter.timeTo, timezoneMinutes, true)
  };
  const params = buildWagerTxnListParams(pageParams, requestFilter);
  const { page, pageSize, ...summaryParams } = params;

  const {
    data: list,
    isFetching,
    isError,
    refetch: refetchList
  } = useQuery(wagerTxnListQueryOptions(params));
  const {
    data: summary = {},
    isFetching: isSummaryFetching,
    refetch: refetchSummary
  } = useQuery(wagerTxnSummaryQueryOptions(summaryParams));

  const { rows = [], total = 0 } = list ?? {};

  const search = useCallback(
    (next: TBetTransFilter) => {
      const { from, to } = buildSearchRange(
        { from: next.timeFrom, to: next.timeTo },
        new Date(),
        timezoneMinutes,
        TIME_RANGE_MAX_ONE_MONTHS
      );

      const nextFilter = { ...next, timeFrom: from, timeTo: to };
      const isSameSearch = pageParams.page === 1 && isEqual(nextFilter, filter);

      if (isSameSearch) {
        void refetchList();
        void refetchSummary();
        return;
      }

      setFilter(nextFilter);
      setPageParams(prev => ({ ...prev, page: 1 }));
    },
    [filter, pageParams.page, refetchList, refetchSummary, timezoneMinutes]
  );

  const exportList = () => {
    startExport('wagertxn', summaryParams);
  };

  return {
    defaultFilter,
    filter,
    pageParams,
    rows,
    total,
    summary,
    isFetching,
    isSummaryFetching,
    isError,
    isExporting,
    search,
    setPageParams,
    exportList
  };
};
