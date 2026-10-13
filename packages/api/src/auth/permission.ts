import type { AdminRolePermEntry } from '@cbt-bo/api-schema/bo/models';

import { useSessionStore } from '@cbt-bo/api/auth/store';

export interface IPermission {
  isReadAllowed: boolean;
  isCreateAllowed: boolean;
  isUpdateAllowed: boolean;
  isDeleteAllowed: boolean;
}

/**
 * Flags of the entry in `permissions` whose `pageKey` matches. Every flag is
 * false when `pageKey` is absent or no entry matches.
 *
 * @example
 * const { isCreateAllowed } = buildPermission(currentRolePermissions, 'admins');
 */
export const buildPermission = (
  permissions: AdminRolePermEntry[],
  pageKey?: string
): IPermission => {
  const entry = pageKey ? permissions.find(item => item.pageKey === pageKey) : undefined;
  const { canRead = false, canCreate = false, canUpdate = false, canDelete = false } = entry ?? {};

  return {
    isReadAllowed: canRead,
    isCreateAllowed: canCreate,
    isUpdateAllowed: canUpdate,
    isDeleteAllowed: canDelete
  };
};

/**
 * Permission flags of the signed-in role for `pageKey`, read from the session
 * store.
 *
 * @example
 * const { isUpdateAllowed } = usePermission('admins');
 */
export const usePermission = (pageKey?: string): IPermission => {
  const permissions = useSessionStore(state => state.currentRolePermissions);

  return buildPermission(permissions, pageKey);
};
