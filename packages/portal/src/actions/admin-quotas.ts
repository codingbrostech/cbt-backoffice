import {
  mgtServiceAdminQuotaList,
  mgtServiceAdminQuotaReset
} from '@cbt-bo/api-schema/bo-fm/admin';

import { createMgtAction } from '~/services/mgt';

export const listAdminQuotas = createMgtAction(mgtServiceAdminQuotaList);
export const resetAdminQuotas = createMgtAction(mgtServiceAdminQuotaReset);
