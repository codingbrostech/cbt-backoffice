import {
  mgtServiceXpShopItemDelete,
  mgtServiceXpShopItemList,
  mgtServiceXpShopItemUpsert,
  mgtServiceXpShopOrderList,
  mgtServiceXpShopOrderStateUpdate
} from '@cbt-bo/api-schema/bo-fm/xpshop';

import { createMgtAction, createMgtBlobAction } from '~/services/mgt';

export const getXpShopItems = createMgtAction(mgtServiceXpShopItemList);

export const createOrUpdateXpShopItem = createMgtAction(mgtServiceXpShopItemUpsert);

export const deleteXpShopItem = createMgtAction(mgtServiceXpShopItemDelete);

export const getXpShopOrders = createMgtAction(mgtServiceXpShopOrderList);

export const updateXpShopOrderState = createMgtAction(mgtServiceXpShopOrderStateUpdate);

export const exportXpShopOrder = createMgtBlobAction('/mgt/v1/xpshop/order/export');
