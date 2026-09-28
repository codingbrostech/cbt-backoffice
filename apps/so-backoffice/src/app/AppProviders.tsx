import { Toaster } from '@cbt-bo/component-lib/components/ui/sonner';
import { type ReactNode, useEffect } from 'react';

import { LANGUAGE_STORAGE_KEY } from '#/constants/storage';
import { useSessionExpiry } from '#/hooks/use-session-expiry';
import i18n, { FALLBACK_LOCALE, initI18n } from '#/i18n/config';

export interface IAppProvidersProps {
  children: ReactNode;
}

const applyStoredLanguage = (): void => {
  const language = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? FALLBACK_LOCALE;

  if (i18n.language !== language) void i18n.changeLanguage(language);
};

/**
 * Initialises i18n before any child renders, restores the stored language on
 * the client and mounts the session-expiry listener and the toaster.
 */
const AppProviders = ({ children }: IAppProvidersProps) => {
  initI18n();
  useSessionExpiry();

  useEffect(() => {
    applyStoredLanguage();
  }, []);

  return (
    <>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
};

export default AppProviders;
