import {
  mgtServicePlayerGroupDelete,
  mgtServicePlayerGroupGet,
  mgtServicePlayerGroupList,
  mgtServicePlayerGroupUpsert
} from '@cbt-bo/api-schema/bo-fm/playergroup';

import { createMgtAction } from '~/services/mgt';

export const getPlayerGroup = createMgtAction(mgtServicePlayerGroupGet);

export const getPlayerGroups = createMgtAction(mgtServicePlayerGroupList);

export const createOrUpdatePlayerGroup = createMgtAction(mgtServicePlayerGroupUpsert);

export const deletePlayerGroup = createMgtAction(mgtServicePlayerGroupDelete);
