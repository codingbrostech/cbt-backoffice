import {
  DEFAULT_THEME,
  DEFAULT_TIMEZONE_MINUTES,
  PREFERENCES_STORAGE_KEY,
  hydratePreferencesStore,
  usePreferencesStore
} from '@cbt-bo/api/preferences/store';

const resetStore = (): void => {
  usePreferencesStore.setState(usePreferencesStore.getInitialState());
  usePreferencesStore.persist.clearStorage();
};

describe('usePreferencesStore', () => {
  afterEach(resetStore);

  describe('when nothing has been picked', () => {
    it('should start at DEFAULT_TIMEZONE_MINUTES', () => {
      expect(usePreferencesStore.getState().timezoneMinutes).toBe(DEFAULT_TIMEZONE_MINUTES);
    });

    it('should start at DEFAULT_THEME', () => {
      expect(usePreferencesStore.getState().theme).toBe(DEFAULT_THEME);
    });
  });

  describe('when a timezone is picked', () => {
    it('should persist the offset under PREFERENCES_STORAGE_KEY', () => {
      usePreferencesStore.getState().setTimezoneMinutes(0);

      const stored: unknown = JSON.parse(
        window.localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? '{}'
      );
      expect(usePreferencesStore.getState().timezoneMinutes).toBe(0);
      expect(stored).toEqual({
        state: { timezoneMinutes: 0, theme: DEFAULT_THEME },
        version: 0
      });
    });
  });

  describe('when a theme is picked', () => {
    it('should persist the theme under PREFERENCES_STORAGE_KEY', () => {
      usePreferencesStore.getState().setTheme('dark');

      const stored: unknown = JSON.parse(
        window.localStorage.getItem(PREFERENCES_STORAGE_KEY) ?? '{}'
      );
      expect(usePreferencesStore.getState().theme).toBe('dark');
      expect(stored).toEqual({
        state: { timezoneMinutes: DEFAULT_TIMEZONE_MINUTES, theme: 'dark' },
        version: 0
      });
    });
  });
});

describe('hydratePreferencesStore', () => {
  afterEach(resetStore);

  describe('when preferences were stored', () => {
    it('should restore the offset and the theme', async () => {
      window.localStorage.setItem(
        PREFERENCES_STORAGE_KEY,
        JSON.stringify({ state: { timezoneMinutes: 0, theme: 'dark' }, version: 0 })
      );

      await hydratePreferencesStore();

      expect(usePreferencesStore.getState().timezoneMinutes).toBe(0);
      expect(usePreferencesStore.getState().theme).toBe('dark');
    });
  });
});
