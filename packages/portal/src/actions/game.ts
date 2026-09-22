import {
  mgtServiceGameDelete,
  mgtServiceGameList,
  mgtServiceGameSync,
  mgtServiceGameTypeList,
  mgtServiceGameUpsert
} from '@cbt-bo/api-schema/bo-fm/game';

import { createMgtAction } from '~/services/mgt';

export const getGames = createMgtAction(mgtServiceGameList);

export const getGameTypes = createMgtAction(mgtServiceGameTypeList);

export const createOrUpdateGame = createMgtAction(mgtServiceGameUpsert);

export const deleteGame = createMgtAction(mgtServiceGameDelete);

export const syncGames = createMgtAction(mgtServiceGameSync);
