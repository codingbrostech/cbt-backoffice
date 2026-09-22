import {
  mgtServiceAdminQuotaConfigList,
  mgtServiceAdminQuotaConfigSet
} from '@cbt-bo/api-schema/bo-fm/admin';

import { createMgtAction } from '~/services/mgt';

export const listAdminQuotaConfigs = createMgtAction(mgtServiceAdminQuotaConfigList);
export const setAdminQuotaConfig = createMgtAction(mgtServiceAdminQuotaConfigSet);
