import {
  mgtServiceAdminRoleDelete,
  mgtServiceAdminRoleGet,
  mgtServiceAdminRoleList,
  mgtServiceAdminRoleUpsert
} from '@cbt-bo/api-schema/bo-fm/adminrole';

import { createMgtAction } from '~/services/mgt';

export const getAdminRoles = createMgtAction(mgtServiceAdminRoleList);

export const getAdminRole = createMgtAction(mgtServiceAdminRoleGet);

export const upsertAdminRole = createMgtAction(mgtServiceAdminRoleUpsert);

export const deleteAdminRole = createMgtAction(mgtServiceAdminRoleDelete);
