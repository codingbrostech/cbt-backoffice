import {
  mgtServiceGameFlag,
  mgtServiceGameList,
  mgtServiceGameTypeList
} from '@cbt-bo/api-schema/bo/game';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const getGameTypes = createMgtAction(mgtServiceGameTypeList);

export const getGames = createMgtAction(mgtServiceGameList);

export const updateGameFlag = createMgtAction(mgtServiceGameFlag);
