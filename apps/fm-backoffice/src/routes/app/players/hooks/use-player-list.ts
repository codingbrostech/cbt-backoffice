import { buildOffsetTime } from '@cbt-bo/api/common/time';
import {
  DEFAULT_PLAYER_LIST_FILTER,
  type TPlayerListFilter,
  buildPlayerListParams,
  playerListQueryOptions
} from '@cbt-bo/api/player/queries';
import { usePreferencesStore } from '@cbt-bo/api/preferences/store';
import type { PlayerListResultItem } from '@cbt-bo/api-schema/bo/models';
import { DEFAULT_PAGE_SIZE, type IListParams } from '@cbt-bo/component-lib/components/table';
import {
  type IDateTimeRange,
  TIME_RANGE_MAX_THREE_MONTHS,
  buildQuickRange,
  clampDateTimeRange
} from '@cbt-bo/component-lib/lib/date-range';
import { useQuery } from '@tanstack/react-query';
import { isEqual } from 'radash';
import { useCallback, useState } from 'react';

import {
  DEFAULT_PLAYER_SEARCH_FILTER,
  type TPlayerSearchFilter
} from '#/components/search/PlayerSearchFields';

export type TPlayersFilter = TPlayerSearchFilter & TPlayerListFilter;

export const DEFAULT_PLAYERS_FILTER = {
  ...DEFAULT_PLAYER_SEARCH_FILTER,
  ...DEFAULT_PLAYER_LIST_FILTER
} as const satisfies TPlayersFilter;

export interface IUsePlayerListResult {
  filter: TPlayersFilter;
  pageParams: IListParams;
  rows: PlayerListResultItem[];
  total: number;
  isFetching: boolean;
  isError: boolean;
  search: (filter: TPlayersFilter) => void;
  setPageParams: (params: IListParams) => void;
}

const buildCreatedRange = (
  range: IDateTimeRange,
  now: Date,
  timezoneMinutes: number
): IDateTimeRange => {
  const isBlank = !range.from && !range.to;

  if (isBlank) return range;

  const { to: latest } = buildQuickRange('today', now, timezoneMinutes);

  return clampDateTimeRange(range, TIME_RANGE_MAX_THREE_MONTHS, latest);
};

/**
 * Players list state. The registration time filter is optional, and once
 * set it is kept within TIME_RANGE_MAX_THREE_MONTHS months ending no later than
 * today. Its bounds are sent at the display timezone's offset.
 */
export const usePlayerList = (): IUsePlayerListResult => {
  const timezoneMinutes = usePreferencesStore(state => state.timezoneMinutes);
  const [filter, setFilter] = useState<TPlayersFilter>(DEFAULT_PLAYERS_FILTER);
  const [pageParams, setPageParams] = useState<IListParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });

  const requestFilter = {
    ...filter,
    timeFrom: buildOffsetTime(filter.timeFrom, timezoneMinutes),
    timeTo: buildOffsetTime(filter.timeTo, timezoneMinutes, true)
  };
  const params = buildPlayerListParams(pageParams, requestFilter);

  const { data: list, isFetching, isError, refetch } = useQuery(playerListQueryOptions(params));

  const { rows = [], total = 0 } = list ?? {};

  const search = useCallback(
    (next: TPlayersFilter) => {
      const { from, to } = buildCreatedRange(
        { from: next.timeFrom, to: next.timeTo },
        new Date(),
        timezoneMinutes
      );

      const nextFilter = { ...next, timeFrom: from, timeTo: to };
      const isSameSearch = pageParams.page === 1 && isEqual(nextFilter, filter);

      if (isSameSearch) {
        void refetch();
        return;
      }

      setFilter(nextFilter);
      setPageParams(prev => ({ ...prev, page: 1 }));
    },
    [filter, pageParams.page, refetch, timezoneMinutes]
  );

  return { filter, pageParams, rows, total, isFetching, isError, search, setPageParams };
};
