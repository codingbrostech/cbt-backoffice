import type { XpShopItem, XpShopVector } from '@cbt-bo/api-schema/bo-fm/models';
import { queryOptions } from '@tanstack/react-query';

import { getXpShopItems } from '~/actions/rewards-shop';
import { getXpShopVectors, listXpShopVectorRelationByVec } from '~/actions/xp-shop-vectors';

export const XP_SHOP_VECTORS_QUERY_KEY = 'xp-shop-vectors';
export const XP_SHOP_ACTIVE_ITEMS_QUERY_KEY = 'xp-shop-active-items';

const ALL_ROWS_PAGE_SIZE = 10_000;

const bySort = (left: XpShopVector, right: XpShopVector): number =>
  (left.sort ?? 0) - (right.sort ?? 0);

/**
 * Every XP shop vector ordered by `sort`.
 */
export const xpShopVectorsQueryOptions = () =>
  queryOptions({
    queryKey: [XP_SHOP_VECTORS_QUERY_KEY],
    queryFn: async (): Promise<XpShopVector[]> => {
      const { data = [] } = await getXpShopVectors({ page: 1, pageSize: ALL_ROWS_PAGE_SIZE });

      return [...data].sort(bySort);
    }
  });

/**
 * Every active XP shop item.
 */
export const xpShopActiveItemsQueryOptions = () =>
  queryOptions({
    queryKey: [XP_SHOP_ACTIVE_ITEMS_QUERY_KEY],
    queryFn: async (): Promise<XpShopItem[]> => {
      const { data = [] } = await getXpShopItems({
        page: 1,
        pageSize: ALL_ROWS_PAGE_SIZE,
        state: 'active'
      });

      return data;
    }
  });

/**
 * The vector and its item relations for one vector code.
 */
export const xpShopVectorRelationsQueryOptions = (code: string) =>
  queryOptions({
    queryKey: [XP_SHOP_VECTORS_QUERY_KEY, 'relations', code],
    queryFn: () => listXpShopVectorRelationByVec({ code }),
    enabled: Boolean(code)
  });
