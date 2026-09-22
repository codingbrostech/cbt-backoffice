import { queryOptions } from '@tanstack/react-query';

import { getOperationalStats } from '~/actions/operationalstat';

export const OPERATIONAL_STATS_QUERY_KEY = 'operational-stats';

export const operationalStatsQueryOptions = () =>
  queryOptions({
    queryKey: [OPERATIONAL_STATS_QUERY_KEY],
    queryFn: () => getOperationalStats({})
  });
