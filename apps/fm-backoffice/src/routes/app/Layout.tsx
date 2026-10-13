import { sessionQueryOptions } from '@cbt-bo/api/auth/queries';
import { usePreferencesStore } from '@cbt-bo/api/preferences/store';
import { PageSpinner } from '@cbt-bo/component-lib/components/layout';
import { buildActiveNavKey } from '@cbt-bo/component-lib/components/nav';
import { SidebarProvider } from '@cbt-bo/component-lib/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, useLocation } from 'react-router';

import { buildNavItems } from '#/constants/nav-items';
import { buildLoginHref } from '#/constants/path';
import Content from '#/routes/app/components/Content';
import Header from '#/routes/app/components/Header';
import NavSide from '#/routes/app/components/NavSide';

/**
 * Session guard and shell for the signed-in pages. Shows PageSpinner until
 * the session resolves, sends a visitor without one to the login page through
 * `buildLoginHref` with the current location as the redirect target, and
 * otherwise renders Header, NavSide and Content around the matched page.
 */
const AppLayout = () => {
  const { t } = useTranslation();
  const { pathname, search, hash } = useLocation();
  const { data: user, isPending } = useQuery(sessionQueryOptions());
  const theme = usePreferencesStore(state => state.theme);

  const items = buildNavItems(t);
  const activeKey = buildActiveNavKey(items, pathname);
  const loginHref = buildLoginHref(`${pathname}${search}${hash}`);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (isPending) return <PageSpinner />;
  if (!user) return <Navigate to={loginHref} replace />;

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
