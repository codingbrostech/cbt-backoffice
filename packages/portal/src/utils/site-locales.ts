import { sift, sort, unique } from 'radash';

import { getEnv, isBrandSo } from '~/utils/env';

export interface ILocaleEntry {
  key: string;
  value: string;
}

export interface IIndexedLocaleEntry {
  entry: ILocaleEntry;
  index: number;
}

const FM_DEFAULT_LOCALES = ['en'] as const satisfies readonly string[];
const SO_DEFAULT_LOCALES = ['en', 'zh', 'ko'] as const satisfies readonly string[];

export const getSiteLocales = (): readonly string[] => {
  const rawLocales = getEnv().clientSiteLocales.split(',');
  const normalizedLocales = rawLocales.map(locale => locale.trim().toLowerCase());
  const filledLocales = sift(normalizedLocales);
  const siteLocales = unique(filledLocales);
  const defaultLocales = isBrandSo() ? SO_DEFAULT_LOCALES : FM_DEFAULT_LOCALES;

  return siteLocales.length ? siteLocales : defaultLocales;
};

/**
 * Strips the region suffix from a locale key.
 *
 * @example
 * normalizeLocaleKey('zh-TW'); // 'zh'
 */
export const normalizeLocaleKey = (key: string): string => {
  const [baseLocale = key] = key.split('-');

  return baseLocale;
};

export const buildOrderedLocaleEntries = (
  entries: readonly ILocaleEntry[],
  siteLocales: readonly string[]
): IIndexedLocaleEntry[] => {
  const rankByLocale = new Map(siteLocales.map((locale, rank) => [locale, rank]));
  const indexedEntries = entries.map((entry, index) => ({ entry, index }));

  const rankOf = ({ entry }: IIndexedLocaleEntry): number =>
    rankByLocale.get(normalizeLocaleKey(entry.key)) ?? siteLocales.length;

  return sort(indexedEntries, rankOf);
};

export const findPrimaryLocaleEntry = (
  entries: readonly ILocaleEntry[]
): ILocaleEntry | undefined => {
  const [primaryLocale] = getSiteLocales();

  return entries.find(({ key }) => normalizeLocaleKey(key) === primaryLocale);
};

const firstLocaleKey = (map: Record<string, string>): string =>
  map.en !== undefined ? 'en' : (Object.keys(map)[0] ?? getSiteLocales()[0] ?? 'en');

export const firstLocaleValue = (map: Record<string, string>): string =>
  map[firstLocaleKey(map)] ?? '';

export const withFirstLocaleValue = (
  map: Record<string, string>,
  value: string
): Record<string, string> => ({ ...map, [firstLocaleKey(map)]: value });

export const toLocaleEntries = (map: Record<string, string>): ILocaleEntry[] => {
  const entries = Object.entries(map).map(([key, value]) => ({ key, value }));
  if (entries.length) return entries;

  const [firstLocale] = getSiteLocales();
  return firstLocale ? [{ key: firstLocale, value: '' }] : entries;
};
