import {
  mgtServiceBatchCancelPlayerPromotion,
  mgtServiceBatchGrantPlayerPromotion,
  mgtServiceCancelPlayerPromotion,
  mgtServiceCompletePlayerPromotion,
  mgtServiceDeletePlayerPromotion,
  mgtServiceGetPlayerPromotion,
  mgtServiceListPlayerPromotions,
  mgtServiceUpsertPlayerPromotion
} from '@cbt-bo/api-schema/bo-fm/player-promotion';

import { createMgtAction } from '~/services/mgt';

export const listPlayerPromotions = createMgtAction(mgtServiceListPlayerPromotions);

export const getPlayerPromotion = createMgtAction(mgtServiceGetPlayerPromotion);

export const upsertPlayerPromotion = createMgtAction(mgtServiceUpsertPlayerPromotion);

export const batchGrantPlayerPromotion = createMgtAction(mgtServiceBatchGrantPlayerPromotion);

export const batchCancelPlayerPromotion = createMgtAction(mgtServiceBatchCancelPlayerPromotion);

export const cancelPlayerPromotion = createMgtAction(mgtServiceCancelPlayerPromotion);

export const deletePlayerPromotion = createMgtAction(mgtServiceDeletePlayerPromotion);

export const completePlayerPromotion = createMgtAction(mgtServiceCompletePlayerPromotion);
