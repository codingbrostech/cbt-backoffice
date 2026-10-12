import { resetSessionQuery, signOut } from '@cbt-bo/api/auth/queries';
import type { IUser } from '@cbt-bo/api/auth/store';
import { usePageTabsStore } from '@cbt-bo/api/page-tabs/store';
import { usePreferencesStore } from '@cbt-bo/api/preferences/store';
import {
  AppHeader,
  BrandLogo,
  LanguageMenu,
  ThemeToggle,
  TimezoneClock,
  UserMenu
} from '@cbt-bo/component-lib/components/header';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import brandIcon from '#/assets/brand-icon.webp';
import { LANGUAGE_OPTIONS } from '#/constants/language-options';
import { PATH } from '#/constants/path';

export interface IShellHeaderProps {
  user: IUser;
}

/**
 * Top bar of the authenticated shell with the brand, the clock, the theme
 * toggle, the language menu and the user menu. Signing out clears the
 * session, the query cache and the open tabs, then returns to the login page.
 */
const ShellHeader = ({ user }: IShellHeaderProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const timezoneMinutes = usePreferencesStore(state => state.timezoneMinutes);
  const theme = usePreferencesStore(state => state.theme);
  const setTheme = usePreferencesStore(state => state.setTheme);

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

  return (
    <AppHeader.Root>
      <AppHeader.Start>
        <BrandLogo
          icon={<img src={brandIcon} alt={t('login.brandName')} className="size-5 rounded-sm" />}
          brandName={`${t('login.brandName')} ${t('login.title')}`}
        />
      </AppHeader.Start>
      <AppHeader.End>
        <TimezoneClock timezoneMinutes={timezoneMinutes} isTimezoneSelectable={false} />
        <AppHeader.Separator />
        <ThemeToggle
          theme={theme}
          onThemeChange={setTheme}
          lightLabel={t('common.theme.light')}
          darkLabel={t('common.theme.dark')}
        />
        <LanguageMenu
          currentLanguage={i18n.language}
          options={LANGUAGE_OPTIONS}
          onChange={handleLanguageChange}
        />
        <AppHeader.Separator />
        <UserMenu
          userName={user.name}
          userRole={user.role}
          logoutLabel={t('common.logout')}
          onLogout={handleLogout}
        />
      </AppHeader.End>
    </AppHeader.Root>
  );
};

export default ShellHeader;
