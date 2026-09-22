import { mgtServiceAcscRewardAccrualList } from '@cbt-bo/api-schema/bo-so/acsc';

import { createMgtAction } from '~/services/mgt';

export const listPlayerAcscRewardAccrual = createMgtAction(mgtServiceAcscRewardAccrualList);
