import type { AdminRolePermEntry } from '@cbt-bo/api-schema/bo-fm/models';
import { useSelector } from '@tanstack/react-store';

import type { PAGE_KEY } from '~/constants/page-key';
import { appStore } from '~/store/app-store';

export type TPageKey = (typeof PAGE_KEY)[keyof typeof PAGE_KEY];

export interface IPagePermission {
  isCreateAllowed: boolean;
  isReadAllowed: boolean;
  isUpdateAllowed: boolean;
  isDeleteAllowed: boolean;
}

/**
 * Permission flags of the current role for a page key. Every flag is false
 * when the role has no entry for the page.
 */
export const buildPagePermission = (
  permissions: AdminRolePermEntry[],
  pageKey: string
): IPagePermission => {
  const entry = permissions.find(
    permission => permission.type === 'page' && permission.pageKey === pageKey
  );

  return {
    isCreateAllowed: Boolean(entry?.canCreate),
    isReadAllowed: Boolean(entry?.canRead),
    isUpdateAllowed: Boolean(entry?.canUpdate),
    isDeleteAllowed: Boolean(entry?.canDelete)
  };
};

export const usePagePermission = (pageKey: TPageKey): IPagePermission => {
  const permissions = useSelector(appStore, state => state.currentRolePermissions);

  return buildPagePermission(permissions, pageKey);
};
