import {
  mgtServiceVipRebateDelete,
  mgtServiceVipRebateGet,
  mgtServiceVipRebateList,
  mgtServiceVipRebateUpsert
} from '@cbt-bo/api-schema/bo-fm/viprebate';

import { createMgtAction } from '~/services/mgt';

export const listVipRebate = createMgtAction(mgtServiceVipRebateList);
export const getVipRebate = createMgtAction(mgtServiceVipRebateGet);
export const upsertVipRebate = createMgtAction(mgtServiceVipRebateUpsert);
export const deleteVipRebate = createMgtAction(mgtServiceVipRebateDelete);
