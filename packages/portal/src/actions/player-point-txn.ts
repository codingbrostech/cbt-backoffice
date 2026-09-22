import { mgtServicePlayerPointTxnList } from '@cbt-bo/api-schema/bo-fm/player';

import { createMgtAction, createMgtBlobAction } from '~/services/mgt';

export const listPlayerPointTxn = createMgtAction(mgtServicePlayerPointTxnList);

export const exportPlayerPointTxn = createMgtBlobAction('/mgt/v1/player/pointtxn/export');
