import { queryOptions } from '@tanstack/react-query';

import { getAdminRoles } from '~/actions/adminroles';
import { getAdmins } from '~/actions/admins';
import type { ISelectOption } from '~/table/types';

const ROLE_PAGE_SIZE = 100;
const ALL_ROWS_PAGE_SIZE = -1;

export const ADMINS_QUERY_KEY = 'admins';
export const ADMIN_ROLES_QUERY_KEY = 'admin-roles';
export const ADMIN_CODES_QUERY_KEY = 'admin-codes';

export const adminRoleOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [ADMIN_ROLES_QUERY_KEY, 'options'],
    queryFn: async (): Promise<ISelectOption[]> => {
      const { data: roles = [] } = await getAdminRoles({ page: 1, pageSize: ROLE_PAGE_SIZE });

      return roles.flatMap(({ code, name }) =>
        code ? [{ value: code, label: name ?? code }] : []
      );
    }
  });

/**
 * Every admin as a select option labelled `name (code)`, sorted by label.
 */
export const adminCodeOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [ADMIN_CODES_QUERY_KEY, 'options'],
    queryFn: async (): Promise<ISelectOption[]> => {
      const { data: admins = [] } = await getAdmins({ page: 1, pageSize: ALL_ROWS_PAGE_SIZE });
      const options = admins.flatMap(({ code, name }) => {
        const trimmedCode = code?.trim();
        if (!trimmedCode) return [];

        const trimmedName = name?.trim();
        const label =
          trimmedName && trimmedName !== trimmedCode
            ? `${trimmedName} (${trimmedCode})`
            : trimmedCode;

        return [{ value: trimmedCode, label }];
      });

      return options.sort((left, right) => left.label.localeCompare(right.label));
    }
  });
