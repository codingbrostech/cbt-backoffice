import { mgtServiceTxnVipLevelList } from '@cbt-bo/api-schema/bo-fm/vipleveltxn';

import { createMgtAction } from '~/services/mgt';

export const listVipLevelTxn = createMgtAction(mgtServiceTxnVipLevelList);
