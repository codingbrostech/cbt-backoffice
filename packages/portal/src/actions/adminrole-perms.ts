import {
  mgtServiceAdminRoleAllPerms,
  mgtServiceAdminRolePageKeys,
  mgtServiceAdminRolePermGet,
  mgtServiceAdminRolePermSet
} from '@cbt-bo/api-schema/bo-fm/adminrole';

import { createMgtAction } from '~/services/mgt';

export const getRolePermissionKeys = createMgtAction(mgtServiceAdminRolePageKeys);

export const getRolePermissions = createMgtAction(mgtServiceAdminRolePermGet);

export const setRolePermissions = createMgtAction(mgtServiceAdminRolePermSet);

export const getAllRolePermissions = createMgtAction(mgtServiceAdminRoleAllPerms);
