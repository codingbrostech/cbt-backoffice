import { ensureSession, resetSessionQuery, signOut } from '@cbt-bo/api/auth/queries';
import { hydrateSessionStore } from '@cbt-bo/api/auth/store';
import { initMgtClient } from '@cbt-bo/api/client';
import { hydratePageTabsStore, usePageTabsStore } from '@cbt-bo/api/page-tabs/store';
import { hydratePreferencesStore, usePreferencesStore } from '@cbt-bo/api/preferences/store';
import { AppHeader, BrandLogo } from '@cbt-bo/component-lib/components/header';
import { HeaderTabs, PageSpinner } from '@cbt-bo/component-lib/components/layout';
import { AppSidebar, buildActiveNavKey } from '@cbt-bo/component-lib/components/nav';
import { SidebarInset, SidebarProvider } from '@cbt-bo/component-lib/components/ui/sidebar';
import { useQueryClient } from '@tanstack/react-query';
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
  useNavigate
} from '@tanstack/react-router';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import brandIcon from '#/assets/brand-icon.webp';
import { LANGUAGE_OPTIONS } from '#/constants/language-options';
import { buildNavItems } from '#/constants/nav-items';
import { PATH } from '#/constants/path';
import { usePageTabs } from '#/hooks/use-page-tabs';

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
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = Route.useRouteContext();
  const timezoneMinutes = usePreferencesStore(state => state.timezoneMinutes);
  const theme = usePreferencesStore(state => state.theme);
  const setTheme = usePreferencesStore(state => state.setTheme);

  const items = buildNavItems(t);
  const activeKey = buildActiveNavKey(items, location.pathname);
  const pageTabs = usePageTabs(items, location.pathname);

  const handleLogout = useCallback(() => {
    void (async () => {
      await signOut();
      resetSessionQuery(queryClient);
      await navigate({ to: PATH.LOGIN, replace: true });
      queryClient.clear();
      usePageTabsStore.getState().clearPaths();
    })();
  }, [navigate, queryClient]);

  const handleLanguageChange = useCallback(
    (language: string) => {
      void i18n.changeLanguage(language);
    },
    [i18n]
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <SidebarProvider className="h-svh flex-col border-4 border-sidebar bg-sidebar">
      <AppHeader
        start={
          <BrandLogo
            icon={<img src={brandIcon} alt={t('login.brandName')} className="size-5 rounded-sm" />}
            brandName={`${t('login.brandName')} ${t('login.title')}`}
          />
        }
        isTimezoneSelectable={false}
        timezoneMinutes={timezoneMinutes}
        currentLanguage={i18n.language}
        languageOptions={LANGUAGE_OPTIONS}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onThemeChange={setTheme}
        themeLightLabel={t('common.theme.light')}
        themeDarkLabel={t('common.theme.dark')}
        userName={user.name}
        userRole={user.role}
        logoutLabel={t('common.logout')}
        onLogout={handleLogout}
      />

      <div className="flex min-h-0 flex-1">
        <AppSidebar.Root
          items={items}
          activeKey={activeKey}
          renderLink={(item, children) => (
            <Link to={item.path} className="flex items-center gap-2">
              {children}
            </Link>
          )}
        >
          <AppSidebar.Rail>
            <AppSidebar.Menu />
            <AppSidebar.Footer>
              <AppSidebar.Toggle
                openLabel={t('common.openSidebar')}
                closeLabel={t('common.closeSidebar')}
              />
            </AppSidebar.Footer>
          </AppSidebar.Rail>
          <AppSidebar.Panel />
        </AppSidebar.Root>

        <SidebarInset className="min-h-0 min-w-0 rounded-sm rounded-tl-md [[data-panel-docked]+&]:rounded-l-none">
          <div className="mx-5 mt-2.5 mb-5 flex min-h-0 flex-1 flex-col">
            <HeaderTabs.Root
              tabs={pageTabs.tabs}
              activeKey={pageTabs.activeKey}
              onSelect={pageTabs.onSelect}
              onClose={pageTabs.onClose}
              onCloseOthers={pageTabs.onCloseOthers}
              onMove={pageTabs.onMove}
            >
              <HeaderTabs.ScrollArea
                scrollLeftLabel={t('common.scrollTabsLeft')}
                scrollRightLabel={t('common.scrollTabsRight')}
              >
                <HeaderTabs.List closeTabLabel={t('common.closeTab')} />
              </HeaderTabs.ScrollArea>
              <HeaderTabs.Actions
                label={t('common.tabActions')}
                closeSelectedTabLabel={t('common.closeSelectedTab')}
                closeOtherTabsLabel={t('common.closeOtherTabs')}
              />
            </HeaderTabs.Root>
            <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-sm rounded-t-none border border-t-0 border-border bg-card px-5 pt-6 pb-2">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
