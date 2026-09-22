import {
  mgtServiceTxnWagerStatsByGameTypeList,
  mgtServiceTxnWagerStatsByPlayerList,
  mgtServiceTxnWagerStatsByProviderGameList,
  mgtServiceTxnWagerStatsByProviderList
} from '@cbt-bo/api-schema/bo-fm/wagertxn';

import { createMgtAction, createMgtBlobAction } from '~/services/mgt';

export const listWagerStatsByUsernameGame = createMgtAction(mgtServiceTxnWagerStatsByPlayerList);
export const listWagerStatsByGameProvider = createMgtAction(mgtServiceTxnWagerStatsByProviderList);
export const listWagerStatsByGameProviderGame = createMgtAction(
  mgtServiceTxnWagerStatsByProviderGameList
);
export const listWagerStatsByGameType = createMgtAction(mgtServiceTxnWagerStatsByGameTypeList);

export const exportWagerStatsByUsernameGame = createMgtBlobAction(
  '/mgt/v1/wagerstatstxn/by-player/export'
);
export const exportWagerStatsByGameProvider = createMgtBlobAction(
  '/mgt/v1/wagerstatstxn/by-provider/export'
);
export const exportWagerStatsByGameProviderGame = createMgtBlobAction(
  '/mgt/v1/wagerstatstxn/by-provider-game/export'
);
export const exportWagerStatsByGameType = createMgtBlobAction(
  '/mgt/v1/wagerstatstxn/by-gametype/export'
);
