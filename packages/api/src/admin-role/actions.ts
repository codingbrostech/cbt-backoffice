import { mgtServiceAdminRoleAllPerms } from '@cbt-bo/api-schema/bo/adminrole';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const getAllRolePermissions = createMgtAction(mgtServiceAdminRoleAllPerms);
