import { createStore } from '@tanstack/react-store';

import { persistStore } from './persist-store';

export interface IUserSessionState {
  token?: string;
  isHydrated: boolean;
}

const initialState: IUserSessionState = {
  token: undefined,
  isHydrated: false
};

export const userSessionStore = createStore(initialState, ({ setState }) => ({
  setToken: (token?: string) => {
    setState(prev => ({ ...prev, token }));
  },
  setHydrated: () => {
    setState(prev => ({ ...prev, isHydrated: true }));
  }
}));

const { hydrate } = persistStore(userSessionStore, {
  name: 'tgpx-adm-session-storage',
  storage: () => localStorage,
  pick: ({ token }) => ({ token })
});

/**
 * Restores the persisted token on the client and flags the store as hydrated.
 */
export const hydrateUserSession = (): void => {
  hydrate();
  userSessionStore.actions.setHydrated();
};
