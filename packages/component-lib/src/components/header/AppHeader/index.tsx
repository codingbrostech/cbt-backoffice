import type { ReactNode } from 'react';

import type { ILanguageOption } from '@cbt-bo/component-lib/components/header/LanguageMenu';
import LanguageMenu from '@cbt-bo/component-lib/components/header/LanguageMenu';
import type { TTheme } from '@cbt-bo/component-lib/components/header/ThemeToggle';
import ThemeToggle from '@cbt-bo/component-lib/components/header/ThemeToggle';
import type { ITimezoneOption } from '@cbt-bo/component-lib/components/header/TimezoneClock';
import TimezoneClock from '@cbt-bo/component-lib/components/header/TimezoneClock';
import UserMenu from '@cbt-bo/component-lib/components/header/UserMenu';
import { Separator } from '@cbt-bo/component-lib/components/ui/separator';

interface IAppHeaderBaseProps {
  start?: ReactNode;
  version?: string;
  currentLanguage: string;
  languageOptions: ILanguageOption[];
  onLanguageChange: (language: string) => void;
  theme: TTheme;
  onThemeChange: (theme: TTheme) => void;
  themeLightLabel?: string;
  themeDarkLabel?: string;
  userName: string;
  userRole?: string;
  logoutLabel: string;
  onLogout: () => void;
}

interface ITimeVisibleSelectableHeaderProps extends IAppHeaderBaseProps {
  isTimeVisible?: true;
  isTimezoneSelectable?: true;
  timezoneMinutes: number;
  timezoneOptions: ITimezoneOption[];
  onTimezoneChange: (timezoneMinutes: number) => void;
}

interface ITimeVisibleFixedHeaderProps extends IAppHeaderBaseProps {
  isTimeVisible?: true;
  isTimezoneSelectable: false;
  timezoneMinutes: number;
}

interface ITimeHiddenHeaderProps extends IAppHeaderBaseProps {
  isTimeVisible: false;
}

export type TAppHeaderProps =
  ITimeVisibleSelectableHeaderProps | ITimeVisibleFixedHeaderProps | ITimeHiddenHeaderProps;

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
    <header className="flex h-14 shrink-0 items-center justify-between bg-sidebar px-4 text-sidebar-foreground">
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
