import {
  mgtServiceGameProviderList,
  mgtServiceGameProviderRetryLogout
} from '@cbt-bo/api-schema/bo/gameprovider';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const getGameProviders = createMgtAction(mgtServiceGameProviderList);

export const retryGameProviderLogout = createMgtAction(mgtServiceGameProviderRetryLogout);
