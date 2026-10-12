import { ensureSession } from '@cbt-bo/api/auth/queries';
import { hydrateSessionStore } from '@cbt-bo/api/auth/store';
import { initMgtClient } from '@cbt-bo/api/client';
import { hydratePageTabsStore } from '@cbt-bo/api/page-tabs/store';
import { hydratePreferencesStore, usePreferencesStore } from '@cbt-bo/api/preferences/store';
import { PageSpinner } from '@cbt-bo/component-lib/components/layout';
import { buildActiveNavKey } from '@cbt-bo/component-lib/components/nav';
import { SidebarProvider } from '@cbt-bo/component-lib/components/ui/sidebar';
import { Outlet, createFileRoute, redirect, useLocation } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ShellContent from '#/app/ShellContent';
import ShellHeader from '#/app/ShellHeader';
import ShellSidebar from '#/app/ShellSidebar';
import { buildNavItems } from '#/constants/nav-items';
import { PATH } from '#/constants/path';

export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  beforeLoad: async ({ context: { env, queryClient }, location }) => {
    initMgtClient(env);
    await hydrateSessionStore();
    await hydratePreferencesStore();
    await hydratePageTabsStore();

    const user = await ensureSession(queryClient);

    if (!user) throw redirect({ to: PATH.LOGIN, search: { redirect: location.href } });

    return { user };
  },
  pendingComponent: PageSpinner,
  component: AuthenticatedLayout
});

function AuthenticatedLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = Route.useRouteContext();
  const theme = usePreferencesStore(state => state.theme);

  const items = buildNavItems(t);
  const activeKey = buildActiveNavKey(items, location.pathname);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <SidebarProvider className="h-svh flex-col border-4 border-sidebar bg-sidebar">
      <ShellHeader user={user} />
      <div className="flex min-h-0 flex-1">
        <ShellSidebar items={items} activeKey={activeKey} />
        <ShellContent items={items} pathname={location.pathname}>
          <Outlet />
        </ShellContent>
      </div>
    </SidebarProvider>
  );
}
