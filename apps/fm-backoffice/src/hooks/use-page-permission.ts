import { type IPermission, usePermission } from '@cbt-bo/api/auth/permission';
import { buildActiveNavItem } from '@cbt-bo/component-lib/components/nav';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

import { buildNavItems } from '#/constants/nav-items';

/**
 * Permission flags of the current page, looked up by the `pageKey` of the nav
 * item whose path matches the location.
 *
 * @example
 * const { isCreateAllowed, isUpdateAllowed } = usePagePermission();
 */
export const usePagePermission = (): IPermission => {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  const items = buildNavItems(t);
  const { pageKey } = buildActiveNavItem(items, pathname) ?? {};

  return usePermission(pageKey);
};
