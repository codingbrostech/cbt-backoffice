import {
  mgtServiceBonusPrizeDelete,
  mgtServiceBonusPrizeList,
  mgtServiceBonusPrizeUpsert
} from '@cbt-bo/api-schema/bo-fm/bonusprize';

import { createMgtAction } from '~/services/mgt';

export const getBonusPrizes = createMgtAction(mgtServiceBonusPrizeList);

export const createOrUpdateBonusPrize = createMgtAction(mgtServiceBonusPrizeUpsert);

export const deleteBonusPrize = createMgtAction(mgtServiceBonusPrizeDelete);
