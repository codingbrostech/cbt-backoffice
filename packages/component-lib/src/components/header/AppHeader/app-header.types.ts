import type { ReactNode } from 'react';

import type { ILanguageOption } from '@cbt-bo/component-lib/components/header/LanguageMenu';
import type { TTheme } from '@cbt-bo/component-lib/components/header/ThemeToggle';
import type { ITimezoneOption } from '@cbt-bo/component-lib/components/header/TimezoneClock';

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
