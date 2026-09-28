import type { ILanguageOption } from '@cbt-bo/component-lib/components/header';

export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'zh', label: '繁體中文', shortLabel: '中' }
] as const satisfies ILanguageOption[];
