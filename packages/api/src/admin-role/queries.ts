import { getAllRolePermissions } from '@cbt-bo/api/admin-role/actions';
import { useSessionStore } from '@cbt-bo/api/auth/store';

/**
 * Loads the permission entries of `role` into the session store. Skips the
 * request when `role` is empty.
 */
export const loadCurrentRolePermissions = async (role: string): Promise<void> => {
  if (!role) return;

  const { data: roles = [] } = await getAllRolePermissions({});
  const entry = roles.find(item => item.role?.code === role);
  const { perms = [] } = entry ?? {};

  useSessionStore.getState().setCurrentRolePermissions(perms);
};
