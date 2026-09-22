import { appStore } from '~/store/app-store';
import { appTabsStore } from '~/store/app-tabs-store';
import { userSessionStore } from '~/store/user-session-store';

import { applyAuthResult, clearSession } from './session';

describe('applyAuthResult', () => {
  afterEach(() => {
    clearSession();
    appStore.actions.setIsReady(false);
  });

  describe('when the result carries a token and admin data', () => {
    it('should store the token, the user and mark the app ready', () => {
      const role = applyAuthResult({ token: 't1', data: { name: 'Ada', role: 'super' } });

      expect(role).toBe('super');
      expect(userSessionStore.state.token).toBe('t1');
      expect(appStore.state.user).toEqual({ name: 'Ada', token: 't1', role: 'super' });
      expect(appStore.state.isReady).toBe(true);
    });
  });

  describe('when the result has no token', () => {
    it('should keep the stored token', () => {
      userSessionStore.actions.setToken('kept');

      applyAuthResult({ data: { name: 'Ada' } });

      expect(userSessionStore.state.token).toBe('kept');
      expect(appStore.state.user?.role).toBe('');
    });
  });
});

describe('clearSession', () => {
  describe('when a session exists', () => {
    it('should drop the user, permissions, token and tabs', () => {
      applyAuthResult({ token: 't1', data: { name: 'Ada', role: 'super' } });
      appStore.actions.setCurrentRolePermissions([{ pageKey: 'admins', type: 'page' }]);
      appTabsStore.actions.openTab({ pathname: '/admins', href: '/admins' });

      clearSession();

      expect(appStore.state.user).toBeUndefined();
      expect(appStore.state.currentRolePermissions).toEqual([]);
      expect(userSessionStore.state.token).toBe('');
      expect(appTabsStore.state.tabs).toEqual([]);
    });
  });
});
