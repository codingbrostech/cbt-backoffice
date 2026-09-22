import { mgtServiceOperationalStatList } from '@cbt-bo/api-schema/bo-fm/operationalstat';

import { createMgtAction } from '~/services/mgt';

export const getOperationalStats = createMgtAction(mgtServiceOperationalStatList);
