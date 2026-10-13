import type {
  AdminCreateInput,
  AdminListInput,
  AdminResult,
  AdminUpdateInput
} from '@cbt-bo/api-schema/bo/models';
import { keepPreviousData, mutationOptions, queryOptions } from '@tanstack/react-query';
import { objectify, shake } from 'radash';

import { createAdmin, getAdmins, updateAdmin } from '@cbt-bo/api/admin/actions';
import { withIsLike } from '@cbt-bo/api/filter/with-is-like';

/**
 * Page and filters of `/mgt/v1/admin/list`. `code` matches an admin login
 * exactly, `state` and `role` match the stored values.
 */
export interface IAdminListParams extends Omit<AdminListInput, 'page' | 'pageSize'> {
  page: number;
  pageSize: number;
}

/**
 * Filter fields of the admins list as form values. An empty string means
 * the field is not applied.
 */
export type TAdminListFilter = Required<Omit<AdminListInput, 'page' | 'pageSize'>>;

export interface IAdminListPage {
  rows: AdminResult[];
  total: number;
}

export const ADMIN_QUERY_KEY = ['admin'] as const;

/**
 * Filter fields sent as a fuzzy `like:<value>` match instead of an exact one.
 */
export const ADMIN_LIKE_FIELDS = ['code'] as const satisfies readonly (keyof TAdminListFilter)[];

export const DEFAULT_ADMIN_LIST_FILTER = {
  code: '',
  state: '',
  role: ''
} as const satisfies TAdminListFilter;

export const adminListQueryKey = (params: IAdminListParams) =>
  [...ADMIN_QUERY_KEY, 'list', params] as const;

export const createAdminMutationKey = () => [...ADMIN_QUERY_KEY, 'create'] as const;

export const updateAdminMutationKey = () => [...ADMIN_QUERY_KEY, 'update'] as const;

const isBlank = (value: unknown): boolean => !value;

const fetchAdminList = async (params: IAdminListParams): Promise<IAdminListPage> => {
  const { data: rows = [], total = 0 } = await getAdmins(params);

  return { rows, total };
};

/**
 * Query params of the admins list for a page and a filter. Blank filter
 * fields are left out so the API does not match on them, and the fields in
 * ADMIN_LIKE_FIELDS are sent as fuzzy matches.
 *
 * @example
 * buildAdminListParams({ page: 1, pageSize: 10 }, { code: 'ada', state: '', role: '' });
 * // { page: 1, pageSize: 10, code: 'like:ada' }
 */
export const buildAdminListParams = (
  page: Pick<IAdminListParams, 'page' | 'pageSize'>,
  filter: TAdminListFilter
): IAdminListParams => {
  const filled = shake(filter, isBlank);
  const filledLikeFields = ADMIN_LIKE_FIELDS.filter(field => filter[field]);
  const likeFilter = objectify(
    filledLikeFields,
    field => field,
    field => withIsLike(filter[field])
  );

  return { ...page, ...filled, ...likeFilter };
};

/**
 * One page of admins for `params`. Keeps the previous page as placeholder
 * data while the next one loads.
 *
 * @example
 * const { data } = useQuery(adminListQueryOptions({ page: 1, pageSize: 10 }));
 */
export const adminListQueryOptions = (params: IAdminListParams) =>
  queryOptions({
    queryKey: adminListQueryKey(params),
    queryFn: () => fetchAdminList(params),
    placeholderData: keepPreviousData
  });

/**
 * Creates an admin through `/mgt/v1/admin/create` and resolves with the
 * new record.
 */
export const createAdminMutationOptions = () =>
  mutationOptions({
    mutationKey: createAdminMutationKey(),
    mutationFn: (input: AdminCreateInput) => createAdmin(input)
  });

/**
 * Updates an admin through `/mgt/v1/admin/update`, matched by `id`. Fields
 * left out of the input keep their stored value.
 */
export const updateAdminMutationOptions = () =>
  mutationOptions({
    mutationKey: updateAdminMutationKey(),
    mutationFn: (input: AdminUpdateInput) => updateAdmin(input)
  });
