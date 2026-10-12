import AppHeaderEnd from '@cbt-bo/component-lib/components/header/AppHeader/AppHeaderEnd';
import AppHeaderRoot from '@cbt-bo/component-lib/components/header/AppHeader/AppHeaderRoot';
import AppHeaderSeparator from '@cbt-bo/component-lib/components/header/AppHeader/AppHeaderSeparator';
import AppHeaderStart from '@cbt-bo/component-lib/components/header/AppHeader/AppHeaderStart';

export type { IAppHeaderEndProps } from '@cbt-bo/component-lib/components/header/AppHeader/AppHeaderEnd';
export type { IAppHeaderRootProps } from '@cbt-bo/component-lib/components/header/AppHeader/AppHeaderRoot';
export type { IAppHeaderSeparatorProps } from '@cbt-bo/component-lib/components/header/AppHeader/AppHeaderSeparator';
export type { IAppHeaderStartProps } from '@cbt-bo/component-lib/components/header/AppHeader/AppHeaderStart';

/**
 * Compound top bar of an authenticated page. The parts only lay the bar out.
 * `Start` holds the brand mark and `End` lines up the controls, each taking
 * its own props, with `Separator` between groups.
 *
 * @example
 * <AppHeader.Root>
 *   <AppHeader.Start>
 *     <BrandLogo icon={icon} brandName="Backoffice" />
 *   </AppHeader.Start>
 *   <AppHeader.End>
 *     <TimezoneClock timezoneMinutes={480} isTimezoneSelectable={false} />
 *     <AppHeader.Separator />
 *     <ThemeToggle theme={theme} onThemeChange={setTheme} />
 *     <LanguageMenu currentLanguage="en" options={options} onChange={setLanguage} />
 *     <AppHeader.Separator />
 *     <UserMenu userName="admin" logoutLabel="Logout" onLogout={logout} />
 *   </AppHeader.End>
 * </AppHeader.Root>
 */
const AppHeader = {
  Root: AppHeaderRoot,
  Start: AppHeaderStart,
  End: AppHeaderEnd,
  Separator: AppHeaderSeparator
};

export default AppHeader;
