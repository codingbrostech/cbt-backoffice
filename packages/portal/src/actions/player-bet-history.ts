import { mgtServicePlayerBetHistoryList } from '@cbt-bo/api-schema/bo-fm/player';

import { createMgtAction, createMgtBlobAction } from '~/services/mgt';

export const listPlayerBetHistory = createMgtAction(mgtServicePlayerBetHistoryList);

export const exportPlayerBetHistory = createMgtBlobAction('/mgt/v1/player/bethistory/export');
