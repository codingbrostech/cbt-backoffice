import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LANGUAGE_STORAGE_KEY } from '#/constants/storage';

import en from './en.json';
import zh from './zh.json';

export const FALLBACK_LOCALE = 'en';

export const resources = {
  en: { translation: en },
  zh: { translation: zh }
};

const syncLanguage = (language: string): void => {
  document.documentElement.setAttribute('lang', language);
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
};

/**
 * Initialises the shared i18next instance once with FALLBACK_LOCALE. Later
 * calls are no-ops. The stored language is applied by the app providers.
 */
export const initI18n = (): typeof i18n => {
  if (i18n.isInitialized) return i18n;

  void i18n.use(initReactI18next).init({
    lng: FALLBACK_LOCALE,
    fallbackLng: FALLBACK_LOCALE,
    resources,
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });

  if (typeof window !== 'undefined') {
    i18n.on('languageChanged', syncLanguage);
  }

  return i18n;
};

export default i18n;
