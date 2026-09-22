import { queryOptions } from '@tanstack/react-query';

import { getPromos } from '~/actions/promos';
import { type IPromotionIdSelectBundle, buildPromotionIdSelectData } from '~/utils/promotion';

export const PROMOTION_SELECT_QUERY_KEY = 'promotion-select';

const ALL_ROWS_PAGE_SIZE = 1000;

/**
 * Promotions as select data with extra search text, optionally limited to
 * one `promoType`.
 */
export const promotionSelectQueryOptions = (promoType?: string) =>
  queryOptions({
    queryKey: [PROMOTION_SELECT_QUERY_KEY, promoType ?? 'all'],
    queryFn: async (): Promise<IPromotionIdSelectBundle> => {
      const { data = [] } = await getPromos({
        page: 1,
        pageSize: ALL_ROWS_PAGE_SIZE,
        ...(promoType && { promoType })
      });

      return buildPromotionIdSelectData(data);
    }
  });
