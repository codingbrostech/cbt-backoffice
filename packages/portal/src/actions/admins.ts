import {
  mgtServiceAdminCreate,
  mgtServiceAdminList,
  mgtServiceAdminSessionList,
  mgtServiceAdminUpdate
} from '@cbt-bo/api-schema/bo-fm/admin';

import { createMgtAction } from '~/services/mgt';

export const getAdmins = createMgtAction(mgtServiceAdminList);

export const getAdminSessions = createMgtAction(mgtServiceAdminSessionList);

export const createAdmin = createMgtAction(mgtServiceAdminCreate);

export const updateAdmin = createMgtAction(mgtServiceAdminUpdate);
