import type { TAppHeaderProps } from '@cbt-bo/component-lib/components/header/AppHeader/app-header.types';
import LanguageMenu from '@cbt-bo/component-lib/components/header/LanguageMenu';
import ThemeToggle from '@cbt-bo/component-lib/components/header/ThemeToggle';
import TimezoneClock from '@cbt-bo/component-lib/components/header/TimezoneClock';
import UserMenu from '@cbt-bo/component-lib/components/header/UserMenu';
import { Separator } from '@cbt-bo/component-lib/components/ui/separator';

export type { TAppHeaderProps } from '@cbt-bo/component-lib/components/header/AppHeader/app-header.types';

const SEPARATOR_CLASS_NAME = 'bg-sidebar-foreground/20 data-[orientation=vertical]:h-4';

const AppHeader = (props: TAppHeaderProps) => {
  const {
    start,
    version,
    currentLanguage,
    languageOptions,
    onLanguageChange,
    theme,
    onThemeChange,
    themeLightLabel,
    themeDarkLabel,
    userName,
    userRole,
    logoutLabel,
    onLogout
  } = props;

  return (
    <header className="flex h-12 shrink-0 items-center justify-between bg-sidebar px-4 text-sidebar-foreground">
      <div className="flex items-center gap-2 font-medium">{start}</div>
      <div className="flex items-center gap-3">
        {props.isTimeVisible !== false && (
          <>
            {props.isTimezoneSelectable === false ? (
              <TimezoneClock
                timezoneMinutes={props.timezoneMinutes}
                isTimezoneSelectable={false}
                version={version}
              />
            ) : (
              <TimezoneClock
                timezoneMinutes={props.timezoneMinutes}
                options={props.timezoneOptions}
                onTimezoneChange={props.onTimezoneChange}
                isTimezoneSelectable={props.isTimezoneSelectable}
                version={version}
              />
            )}
            <Separator orientation="vertical" className={SEPARATOR_CLASS_NAME} />
          </>
        )}
        <ThemeToggle
          theme={theme}
          onThemeChange={onThemeChange}
          lightLabel={themeLightLabel}
          darkLabel={themeDarkLabel}
        />
        <LanguageMenu
          currentLanguage={currentLanguage}
          options={languageOptions}
          onChange={onLanguageChange}
        />
        <Separator orientation="vertical" className={SEPARATOR_CLASS_NAME} />
        <UserMenu
          userName={userName}
          userRole={userRole}
          logoutLabel={logoutLabel}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};

export default AppHeader;
