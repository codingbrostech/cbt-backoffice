import {
  mgtServiceAdminCreate,
  mgtServiceAdminList,
  mgtServiceAdminUpdate
} from '@cbt-bo/api-schema/bo/admin';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const getAdmins = createMgtAction(mgtServiceAdminList);

export const createAdmin = createMgtAction(mgtServiceAdminCreate);

export const updateAdmin = createMgtAction(mgtServiceAdminUpdate);
