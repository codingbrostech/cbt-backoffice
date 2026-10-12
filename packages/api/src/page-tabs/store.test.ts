import {
  PAGE_TABS_STORAGE_KEY,
  hydratePageTabsStore,
  usePageTabsStore
} from '@cbt-bo/api/page-tabs/store';

const resetStore = (): void => {
  usePageTabsStore.setState(usePageTabsStore.getInitialState());
  usePageTabsStore.persist.clearStorage();
};

describe('usePageTabsStore', () => {
  afterEach(resetStore);

  describe('when nothing has been opened', () => {
    it('should start with no paths', () => {
      expect(usePageTabsStore.getState().paths).toEqual([]);
    });
  });

  describe('when a path is opened', () => {
    it('should persist it under PAGE_TABS_STORAGE_KEY', () => {
      usePageTabsStore.getState().openPath('/dashboard');

      const stored: unknown = JSON.parse(
        window.sessionStorage.getItem(PAGE_TABS_STORAGE_KEY) ?? '{}'
      );
      expect(usePageTabsStore.getState().paths).toEqual(['/dashboard']);
      expect(stored).toEqual({ state: { paths: ['/dashboard'] }, version: 0 });
    });

    it('should not add it twice', () => {
      usePageTabsStore.getState().openPath('/dashboard');
      usePageTabsStore.getState().openPath('/dashboard');

      expect(usePageTabsStore.getState().paths).toEqual(['/dashboard']);
    });
  });

  describe('when a path is closed', () => {
    it('should remove only that path', () => {
      usePageTabsStore.getState().openPath('/dashboard');
      usePageTabsStore.getState().openPath('/players');

      usePageTabsStore.getState().closePath('/dashboard');

      expect(usePageTabsStore.getState().paths).toEqual(['/players']);
    });
  });

  describe('when the other paths are closed', () => {
    it('should keep only the given path', () => {
      usePageTabsStore.getState().openPath('/dashboard');
      usePageTabsStore.getState().openPath('/players');
      usePageTabsStore.getState().openPath('/reports');

      usePageTabsStore.getState().closeOtherPaths('/players');

      expect(usePageTabsStore.getState().paths).toEqual(['/players']);
    });
  });

  describe('when a path is moved', () => {
    it('should place it at the target index', () => {
      usePageTabsStore.getState().openPath('/dashboard');
      usePageTabsStore.getState().openPath('/players');
      usePageTabsStore.getState().openPath('/reports');

      usePageTabsStore.getState().movePath('/dashboard', '/reports');

      expect(usePageTabsStore.getState().paths).toEqual(['/players', '/reports', '/dashboard']);
    });

    it('should move it towards the front as well', () => {
      usePageTabsStore.getState().openPath('/dashboard');
      usePageTabsStore.getState().openPath('/players');
      usePageTabsStore.getState().openPath('/reports');

      usePageTabsStore.getState().movePath('/reports', '/dashboard');

      expect(usePageTabsStore.getState().paths).toEqual(['/reports', '/dashboard', '/players']);
    });

    it('should keep the order when either path is not open', () => {
      usePageTabsStore.getState().openPath('/dashboard');
      usePageTabsStore.getState().openPath('/players');

      usePageTabsStore.getState().movePath('/reports', '/dashboard');
      usePageTabsStore.getState().movePath('/dashboard', '/reports');

      expect(usePageTabsStore.getState().paths).toEqual(['/dashboard', '/players']);
    });
  });

  describe('when the paths are cleared', () => {
    it('should leave no paths open', () => {
      usePageTabsStore.getState().openPath('/dashboard');

      usePageTabsStore.getState().clearPaths();

      expect(usePageTabsStore.getState().paths).toEqual([]);
    });
  });
});

describe('hydratePageTabsStore', () => {
  afterEach(resetStore);

  describe('when paths were stored', () => {
    it('should restore them', async () => {
      window.sessionStorage.setItem(
        PAGE_TABS_STORAGE_KEY,
        JSON.stringify({ state: { paths: ['/players'] }, version: 0 })
      );

      await hydratePageTabsStore();

      expect(usePageTabsStore.getState().paths).toEqual(['/players']);
    });
  });
});
