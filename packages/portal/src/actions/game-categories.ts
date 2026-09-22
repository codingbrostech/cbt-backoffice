import { mgtServiceGameHomeTabList } from '@cbt-bo/api-schema/bo-fm/game';
import {
  mgtServiceGameVectorBundleUpsert,
  mgtServiceGameVectorDelete,
  mgtServiceGameVectorRelationListByVec,
  mgtServiceGameVectorUpsert
} from '@cbt-bo/api-schema/bo-fm/gamevector';

import { createMgtAction } from '~/services/mgt';

export const getGameHomeTabList = createMgtAction(mgtServiceGameHomeTabList);

export const listGameVectorRelationByVec = createMgtAction(mgtServiceGameVectorRelationListByVec);

export const upsertGameVectorBundle = createMgtAction(mgtServiceGameVectorBundleUpsert);

export const upsertGameVector = createMgtAction(mgtServiceGameVectorUpsert);

export const deleteGameVector = createMgtAction(mgtServiceGameVectorDelete);
