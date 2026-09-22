import {
  mgtServiceVipLevelDelete,
  mgtServiceVipLevelIdxList,
  mgtServiceVipLevelList,
  mgtServiceVipLevelUpsert
} from '@cbt-bo/api-schema/bo-fm/viplevel';

import { createMgtAction } from '~/services/mgt';

export const getVipLevels = createMgtAction(mgtServiceVipLevelList);

export const getVipLevelIdxList = createMgtAction(mgtServiceVipLevelIdxList);

export const createOrUpdateVipLevel = createMgtAction(mgtServiceVipLevelUpsert);

export const deleteVipLevel = createMgtAction(mgtServiceVipLevelDelete);
