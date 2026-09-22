import {
  mgtServicePlayerSelfLimitDelete,
  mgtServicePlayerSelfLimitList,
  mgtServicePlayerSelfLimitUpdate
} from '@cbt-bo/api-schema/bo-fm/player';

import { createMgtAction } from '~/services/mgt';

export const listPlayerSelfLimits = createMgtAction(mgtServicePlayerSelfLimitList);

export const updatePlayerSelfLimits = createMgtAction(mgtServicePlayerSelfLimitUpdate);

export const deletePlayerSelfLimits = createMgtAction(mgtServicePlayerSelfLimitDelete);
