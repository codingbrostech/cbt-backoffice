import { appTabsStore } from './app-tabs-store';

describe('appTabsStore', () => {
  beforeEach(() => {
    appTabsStore.actions.clearTabs();
  });

  describe('when a tab is opened for a new pathname', () => {
    it('should append it and make it current', () => {
      appTabsStore.actions.openTab({ pathname: '/admins', href: '/admins' });

      expect(appTabsStore.state.tabs).toEqual([{ pathname: '/admins', href: '/admins' }]);
      expect(appTabsStore.state.currentPathname).toBe('/admins');
    });
  });

  describe('when a tab is opened for an existing pathname', () => {
    it('should update its href without adding a tab', () => {
      appTabsStore.actions.openTab({ pathname: '/admins', href: '/admins' });
      appTabsStore.actions.openTab({ pathname: '/dashboard', href: '/dashboard' });
      appTabsStore.actions.openTab({ pathname: '/admins', href: '/admins?page=2' });

      expect(appTabsStore.state.tabs).toEqual([
        { pathname: '/admins', href: '/admins?page=2' },
        { pathname: '/dashboard', href: '/dashboard' }
      ]);
      expect(appTabsStore.state.currentPathname).toBe('/admins');
    });
  });

  describe('when the only tab is removed', () => {
    it('should keep it', () => {
      appTabsStore.actions.openTab({ pathname: '/admins', href: '/admins' });
      appTabsStore.actions.removeTab('/admins');

      expect(appTabsStore.state.tabs).toHaveLength(1);
    });
  });

  describe('when other tabs are removed', () => {
    it('should keep the selected tab and its name only', () => {
      appTabsStore.actions.openTab({ pathname: '/admins', href: '/admins' });
      appTabsStore.actions.openTab({ pathname: '/players/1', href: '/players/1' });
      appTabsStore.actions.setTabName('/players/1', 'Ada');
      appTabsStore.actions.setTabName('/admins', 'Admins');
      appTabsStore.actions.removeOtherTabs('/players/1');

      expect(appTabsStore.state.tabs).toEqual([{ pathname: '/players/1', href: '/players/1' }]);
      expect(appTabsStore.state.tabNames).toEqual({ '/players/1': 'Ada' });
    });
  });

  describe('when a tab with a name is removed', () => {
    it('should drop its name', () => {
      appTabsStore.actions.openTab({ pathname: '/admins', href: '/admins' });
      appTabsStore.actions.openTab({ pathname: '/players/1', href: '/players/1' });
      appTabsStore.actions.setTabName('/players/1', 'Ada');
      appTabsStore.actions.removeTab('/players/1');

      expect(appTabsStore.state.tabNames).toEqual({});
    });
  });
});
