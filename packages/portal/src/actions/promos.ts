import {
  mgtServiceDeletePromotion,
  mgtServiceListPromotions,
  mgtServiceUpsertPromotion
} from '@cbt-bo/api-schema/bo-fm/promotion';

import { createMgtAction } from '~/services/mgt';

export const getPromos = createMgtAction(mgtServiceListPromotions);
export const createOrUpdatePromo = createMgtAction(mgtServiceUpsertPromotion);
export const deletePromo = createMgtAction(mgtServiceDeletePromotion);
