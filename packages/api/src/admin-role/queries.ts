import type { AdminRoleResult } from '@cbt-bo/api-schema/bo/models';
import { queryOptions } from '@tanstack/react-query';
import { objectify } from 'radash';

import { getAdminRoles, getAllRolePermissions } from '@cbt-bo/api/admin-role/actions';
import { useSessionStore } from '@cbt-bo/api/auth/store';
import { ALL_ROWS_PAGE_SIZE } from '@cbt-bo/api/common/constants';

export const ADMIN_ROLE_QUERY_KEY = ['admin-role'] as const;

export const adminRoleListQueryKey = () => [...ADMIN_ROLE_QUERY_KEY, 'list'] as const;

const fetchAdminRoles = async (): Promise<AdminRoleResult[]> => {
  const { data: roles = [] } = await getAdminRoles({ pageSize: ALL_ROWS_PAGE_SIZE });

  return roles;
};

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

/**
 * Role display name by role code. A role without a code or a name is left
 * out, so a lookup miss means the code should be shown as is.
 *
 * @example
 * buildRoleNameByCode([{ code: 'admin', name: 'Admin' }]); // { admin: 'Admin' }
 */
export const buildRoleNameByCode = (
  roles: readonly AdminRoleResult[]
): Readonly<Record<string, string>> => {
  const namedRoles = roles.flatMap(({ code, name }) => (code && name ? [{ code, name }] : []));

  return objectify(
    namedRoles,
    ({ code }) => code,
    ({ name }) => name
  );
};

/**
 * Every admin role in one request through ALL_ROWS_PAGE_SIZE, for role pickers.
 *
 * @example
 * const { data: roles = [] } = useQuery(adminRoleListQueryOptions());
 */
export const adminRoleListQueryOptions = () =>
  queryOptions({
    queryKey: adminRoleListQueryKey(),
    queryFn: fetchAdminRoles
  });
