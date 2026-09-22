import type { AdminRolePermEntry } from '@cbt-bo/api-schema/bo-fm/models';

import { getAllRolePermissions } from '~/actions/adminrole-perms';
import { appStore } from '~/store/app-store';

/**
 * Loads the permission entries of `roleCode`. When it is the current user's
 * role, the entries are also written to the app store.
 */
export const fetchCurrentRolePermissions = async (
  roleCode: string,
  currentUserRoleCode?: string
): Promise<AdminRolePermEntry[]> => {
  if (!roleCode) return [];

  const { data: roles = [] } = await getAllRolePermissions({});
  const entry = roles.find(item => item.role?.code === roleCode);
  const { perms = [] } = entry ?? {};

  if (currentUserRoleCode && roleCode === currentUserRoleCode) {
    appStore.actions.setCurrentRolePermissions(perms);
  }

  return perms;
};
