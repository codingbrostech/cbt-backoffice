import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import zh from './zh.json';

export const resources = {
  en: { translation: en },
  zh: { translation: zh }
};

export const FALLBACK_LOCALE = 'en';

const syncHtmlLang = (language: string): void => {
  document.documentElement.setAttribute('lang', language);
};

/**
 * Initialises the shared i18next instance once. Later calls are no-ops.
 */
export const initI18n = (language: string = FALLBACK_LOCALE): typeof i18n => {
  if (i18n.isInitialized) return i18n;

  void i18n.use(initReactI18next).init({
    lng: language,
    fallbackLng: FALLBACK_LOCALE,
    interpolation: { escapeValue: false },
    resources,
    react: { useSuspense: false }
  });

  if (typeof window !== 'undefined') {
    i18n.on('languageChanged', syncHtmlLang);
  }

  return i18n;
};

export default i18n;
