import { useSelector } from '@tanstack/react-store';
import { useEffect } from 'react';

import ConfirmDialogHost from '~/components/ConfirmDialogHost';
import { Toaster } from '~/components/ui/sonner';
import { TooltipProvider } from '~/components/ui/tooltip';
import i18n, { initI18n } from '~/i18n/config';
import { hydrateAppTabs } from '~/store/app-tabs-store';
import { hydrateSettings, settingStore } from '~/store/setting-store';
import { hydrateUserSession } from '~/store/user-session-store';
import { type IRuntimeEnv, setEnv } from '~/utils/env';

export interface IPortalProvidersProps {
  /**
   * Runtime env read by the hosting app's server function.
   */
  env: IRuntimeEnv;
  children: React.ReactNode;
}

const DARK_CLASS = 'dark';

const hydrateStores = (): void => {
  hydrateSettings();
  hydrateUserSession();
  hydrateAppTabs();
};

const PortalProviders = ({ env, children }: IPortalProvidersProps) => {
  const language = useSelector(settingStore, state => state.language);
  const colorScheme = useSelector(settingStore, state => state.colorScheme);

  setEnv(env);
  initI18n(language);

  useEffect(() => {
    hydrateStores();
  }, []);

  useEffect(() => {
    if (i18n.language !== language) void i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle(DARK_CLASS, colorScheme === 'dark');
  }, [colorScheme]);

  return (
    <TooltipProvider>
      {children}
      <Toaster position="top-right" richColors />
      <ConfirmDialogHost />
    </TooltipProvider>
  );
};

export default PortalProviders;
