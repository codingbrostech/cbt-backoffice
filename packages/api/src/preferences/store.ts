import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type TTheme = 'light' | 'dark';

export const PREFERENCES_STORAGE_KEY = 'app-preferences';
export const DEFAULT_TIMEZONE_MINUTES = 480;
export const DEFAULT_THEME: TTheme = 'light';

export interface IPreferencesState {
  /**
   * UTC offset in minutes applied to every displayed date.
   */
  timezoneMinutes: number;
  setTimezoneMinutes: (timezoneMinutes: number) => void;
  theme: TTheme;
  setTheme: (theme: TTheme) => void;
}

/**
 * Display preferences shared by every page, persisted under
 * PREFERENCES_STORAGE_KEY. `timezoneMinutes` starts at DEFAULT_TIMEZONE_MINUTES
 * and `theme` starts at DEFAULT_THEME.
 * Hydration is skipped on load and started through `hydratePreferencesStore`.
 */
export const usePreferencesStore = create<IPreferencesState>()(
  persist(
    set => ({
      timezoneMinutes: DEFAULT_TIMEZONE_MINUTES,
      setTimezoneMinutes: timezoneMinutes => {
        set({ timezoneMinutes });
      },
      theme: DEFAULT_THEME,
      setTheme: theme => {
        set({ theme });
      }
    }),
    {
      name: PREFERENCES_STORAGE_KEY,
      storage: createJSONStorage(() => window.localStorage),
      skipHydration: true
    }
  )
);

/**
 * Restores the persisted preferences on the client. Later calls are no-ops.
 */
export const hydratePreferencesStore = async (): Promise<void> => {
  if (usePreferencesStore.persist.hasHydrated()) return;

  await usePreferencesStore.persist.rehydrate();
};
