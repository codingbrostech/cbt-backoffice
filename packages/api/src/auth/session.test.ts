import { SESSION_STORAGE_KEY, useSessionStore } from '@cbt-bo/api/auth/store';

import { applyAuthResult, clearSession } from './session';

const resetStore = (): void => {
  useSessionStore.setState(useSessionStore.getInitialState());
  useSessionStore.persist.clearStorage();
};

describe('applyAuthResult', () => {
  afterEach(resetStore);

  describe('when the result carries a token and admin data', () => {
    it('should store the session and return the user', () => {
      const user = applyAuthResult({ token: 't1', data: { name: 'Ada', role: 'super' } });

      const { token, user: storedUser } = useSessionStore.getState();
      expect(user).toEqual({ name: 'Ada', role: 'super' });
      expect(token).toBe('t1');
      expect(storedUser).toEqual(user);
    });

    it('should persist only the token', () => {
      applyAuthResult({ token: 't1', data: { name: 'Ada', role: 'super' } });

      const stored: unknown = JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY) ?? '{}');
      expect(stored).toEqual({ state: { token: 't1' }, version: 0 });
    });
  });

  describe('when the result has no token', () => {
    it('should keep the stored token and return an empty user', () => {
      useSessionStore.setState({ token: 'kept' });

      const user = applyAuthResult({});

      expect(user).toEqual({ name: '', role: '' });
      expect(useSessionStore.getState().token).toBe('kept');
    });
  });
});

describe('clearSession', () => {
  afterEach(resetStore);

  describe('when a session exists', () => {
    it('should reset the user, permissions and token', () => {
      applyAuthResult({ token: 't1', data: { name: 'Ada', role: 'super' } });
      useSessionStore.getState().setCurrentRolePermissions([{ pageKey: 'p' }]);

      clearSession();

      const { token, user, currentRolePermissions } = useSessionStore.getState();
      expect(token).toBeUndefined();
      expect(user).toBeUndefined();
      expect(currentRolePermissions).toEqual([]);
    });
  });
});
