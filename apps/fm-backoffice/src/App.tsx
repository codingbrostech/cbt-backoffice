import { Toaster } from '@cbt-bo/component-lib/components/ui/sonner';
import { useEffect } from 'react';

import { LANGUAGE_STORAGE_KEY } from '#/constants/storage';
import { useSessionExpiry } from '#/hooks/use-session-expiry';
import i18n, { FALLBACK_LOCALE, initI18n } from '#/i18n/config';
import AppRoutes from '#/routes';

const applyStoredLanguage = (): void => {
  const language = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? FALLBACK_LOCALE;

  if (i18n.language !== language) void i18n.changeLanguage(language);
};

/**
 * Initialises i18n before any route renders, restores the stored language,
 * mounts the session-expiry listener and renders the route tree with the
 * toaster.
 */
const App = () => {
  initI18n();
  useSessionExpiry();

  useEffect(() => {
    applyStoredLanguage();
  }, []);

  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" richColors />
    </>
  );
};

export default App;
