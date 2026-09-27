import { ensureSession, signOut } from '@cbt-bo/api/auth/queries';
import { hydrateSessionStore } from '@cbt-bo/api/auth/store';
import { initMgtClient } from '@cbt-bo/api/client';
import { hydratePreferencesStore, usePreferencesStore } from '@cbt-bo/api/preferences/store';
import { AppHeader, BrandLogo } from '@cbt-bo/component-lib/components/header';
import { PageSpinner } from '@cbt-bo/component-lib/components/layout';
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

export const Route = createFileRoute('/_authenticated')({
  ssr: false,
  beforeLoad: async ({ context: { env, queryClient }, location }) => {
    initMgtClient(env);
    await hydrateSessionStore();
    await hydratePreferencesStore();

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
  const activeKey = buildActiveNavKey(items, location.pathname) ?? '';

  const handleLogout = useCallback(() => {
    void (async () => {
      await signOut();
      await navigate({ to: PATH.LOGIN, replace: true });
      queryClient.clear();
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
    <SidebarProvider className="h-svh flex-col">
      <AppHeader
        start={
          <BrandLogo
            icon={<img src={brandIcon} alt={t('login.brandName')} className="size-5 rounded-sm" />}
            brandName={t('login.brandName')}
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
        <AppSidebar
          items={items}
          activeKey={activeKey}
          renderLink={(item, children) => (
            <Link to={item.path} className="flex items-center gap-2">
              {children}
            </Link>
          )}
        />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
