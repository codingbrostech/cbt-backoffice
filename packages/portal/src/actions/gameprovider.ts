import { mgtServiceGameProviderList } from '@cbt-bo/api-schema/bo-fm/gameprovider';

import { createMgtAction } from '~/services/mgt';

export const getGameProviders = createMgtAction(mgtServiceGameProviderList);
