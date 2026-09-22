import {
  mgtServiceXpShopVectorBundleUpsert,
  mgtServiceXpShopVectorDelete,
  mgtServiceXpShopVectorList,
  mgtServiceXpShopVectorRelationListByVec,
  mgtServiceXpShopVectorUpsert
} from '@cbt-bo/api-schema/bo-fm/xpshopvector';

import { createMgtAction } from '~/services/mgt';

export const getXpShopVectors = createMgtAction(mgtServiceXpShopVectorList);

export const createOrUpdateXpShopVector = createMgtAction(mgtServiceXpShopVectorUpsert);

export const deleteXpShopVector = createMgtAction(mgtServiceXpShopVectorDelete);

export const upsertXpShopVectorBundle = createMgtAction(mgtServiceXpShopVectorBundleUpsert);

export const listXpShopVectorRelationByVec = createMgtAction(
  mgtServiceXpShopVectorRelationListByVec
);
