import { mgtServiceAdminOpsLogList } from '@cbt-bo/api-schema/bo-fm/admin';

import { createMgtAction } from '~/services/mgt';

export const getAdminOpsLogs = createMgtAction(mgtServiceAdminOpsLogList);
