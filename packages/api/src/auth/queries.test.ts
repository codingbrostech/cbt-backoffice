import { QueryClient } from '@tanstack/react-query';

import { useSessionStore } from '@cbt-bo/api/auth/store';

import { ensureSession, resetSessionQuery, sessionQueryKey } from './queries';

const resetStore = (): void => {
  useSessionStore.setState(useSessionStore.getInitialState());
  useSessionStore.persist.clearStorage();
};

describe('resetSessionQuery', () => {
  afterEach(resetStore);

  describe('when a session is cached but the token is gone', () => {
    it('should make ensureSession resolve null instead of the cached user', async () => {
      const queryClient = new QueryClient();
      const user = { name: 'Ada', role: 'super' };
      queryClient.setQueryData(sessionQueryKey(), user);
      await expect(ensureSession(queryClient)).resolves.toEqual(user);

      resetSessionQuery(queryClient);

      await expect(ensureSession(queryClient)).resolves.toBeNull();
    });
  });
});
