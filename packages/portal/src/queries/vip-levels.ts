import { queryOptions } from '@tanstack/react-query';

import { getVipLevelIdxList } from '~/actions/viplevels';
import type { ISelectOption } from '~/table/types';

export const VIP_LEVELS_QUERY_KEY = 'vip-levels';
export const VIP_LEVEL_IDX_QUERY_KEY = 'vip-level-idx';

/**
 * Every VIP level as a select option keyed by `idx` and labelled by `code`.
 */
export const vipLevelIdxOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [VIP_LEVEL_IDX_QUERY_KEY, 'options'],
    queryFn: async (): Promise<ISelectOption[]> => {
      const { data: levels = [] } = await getVipLevelIdxList({});

      return levels.flatMap(({ idx, code }) => (idx ? [{ value: idx, label: code ?? idx }] : []));
    }
  });
