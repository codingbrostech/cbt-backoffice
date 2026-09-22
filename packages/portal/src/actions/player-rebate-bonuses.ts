import {
  mgtServiceGenerateRebateBonusForPeriod,
  mgtServiceManualDistributeRebate,
  mgtServicePlayerBonusRebateDelete,
  mgtServicePlayerBonusRebateList,
  mgtServicePlayerBonusRebateUpdate
} from '@cbt-bo/api-schema/bo-fm/playerbonus';

import { createMgtAction, createMgtBlobAction } from '~/services/mgt';

export const listPlayerRebateBonus = createMgtAction(mgtServicePlayerBonusRebateList);

export const updatePlayerRebateBonus = createMgtAction(mgtServicePlayerBonusRebateUpdate);

export const deletePlayerRebateBonus = createMgtAction(mgtServicePlayerBonusRebateDelete);

export const generatePlayerRebateBonus = createMgtAction(mgtServiceGenerateRebateBonusForPeriod);

export const distributePlayerRebateBonus = createMgtAction(mgtServiceManualDistributeRebate);

export const exportPlayerRebateBonus = createMgtBlobAction('/mgt/v1/playerbonus/rebate/export');
