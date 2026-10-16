import { mgtServicePlayerList, mgtServicePlayerUpdate } from '@cbt-bo/api-schema/bo/player';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const getPlayers = createMgtAction(mgtServicePlayerList);

export const updatePlayer = createMgtAction(mgtServicePlayerUpdate);
