import {
  mgtServiceBonusClone,
  mgtServiceBonusDelete,
  mgtServiceBonusList,
  mgtServiceBonusUpsert
} from '@cbt-bo/api-schema/bo-fm/bonus';

import { createMgtAction } from '~/services/mgt';

export const getBonuses = createMgtAction(mgtServiceBonusList);

export const createOrUpdateBonus = createMgtAction(mgtServiceBonusUpsert);

export const deleteBonus = createMgtAction(mgtServiceBonusDelete);

export const cloneBonus = createMgtAction(mgtServiceBonusClone);
