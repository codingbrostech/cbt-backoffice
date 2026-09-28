import type { ILanguageOption } from '@cbt-bo/component-lib/components/header/LanguageMenu';
import type { ITimezoneOption } from '@cbt-bo/component-lib/components/header/TimezoneClock';

export const TIMEZONE_OPTIONS = [
  { value: 0, label: 'UTC+0' },
  { value: 480, label: 'CST(+8)' }
] as const satisfies ITimezoneOption[];

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'zh', label: '繁體中文', shortLabel: '中' }
] as const satisfies ILanguageOption[];
