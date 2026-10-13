import { buildPermission } from '@cbt-bo/api/auth/permission';
import { sessionQueryOptions } from '@cbt-bo/api/auth/queries';
import { useSessionStore } from '@cbt-bo/api/auth/store';
import { usePreferencesStore } from '@cbt-bo/api/preferences/store';
import { PageSpinner } from '@cbt-bo/component-lib/components/layout';
import {
  buildActiveNavItem,
  buildActiveNavKey,
  buildVisibleNavItems
} from '@cbt-bo/component-lib/components/nav';
import { SidebarProvider } from '@cbt-bo/component-lib/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useLocation } from 'react-router';

import { buildNavItems } from '#/constants/nav-items';
import { PATH, buildLoginHref } from '#/constants/path';
import Content from '#/routes/app/components/Content';
import Header from '#/routes/app/components/Header';
import NavSide from '#/routes/app/components/NavSide';

/**
 * Shell for the signed-in pages. Redirects to the login page without a
 * session, and to PATH.DASHBOARD from a page the role may not read.
 */
const AppLayout = () => {
  const { t } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const { data: user, isPending } = useQuery(sessionQueryOptions());
  const theme = usePreferencesStore(state => state.theme);
  const permissions = useSessionStore(state => state.currentRolePermissions);

  const navItems = buildNavItems(t);
  const items = buildVisibleNavItems(
    navItems,
    ({ path, pageKey }) =>
      path === PATH.DASHBOARD || buildPermission(permissions, pageKey).isReadAllowed
  );
  const activeKey = buildActiveNavKey(items, pathname);
  const isPageReadAllowed = !buildActiveNavItem(navItems, pathname) || Boolean(activeKey);
  const loginHref = buildLoginHref(`${pathname}${search}${hash}`);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (isPending) return <PageSpinner />;
  if (!user) return <Navigate to={loginHref} replace />;
  if (!isPageReadAllowed) return <Navigate to={PATH.DASHBOARD} replace />;

  return (
    <SidebarProvider className="h-svh flex-col border-4 border-sidebar bg-sidebar">
      <Header user={user} />
      <div className="flex min-h-0 flex-1">
        <NavSide items={items} activeKey={activeKey} />
        <Content items={items} pathname={pathname}>
          <Outlet />
        </Content>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
