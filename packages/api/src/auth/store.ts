import type { AdminRolePermEntry } from '@cbt-bo/api-schema/bo/models';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const SESSION_STORAGE_KEY = 'tgpx-adm-session-storage';

export interface IUser {
  name: string;
  role: string;
}

export interface ISessionState {
  token?: string;
  user?: IUser;
  currentRolePermissions: AdminRolePermEntry[];
  setToken: (token?: string) => void;
  setUser: (user?: IUser) => void;
  setCurrentRolePermissions: (currentRolePermissions: AdminRolePermEntry[]) => void;
}

/**
 * Session state. Only `token` is persisted, under SESSION_STORAGE_KEY.
 * Hydration is skipped on load and started through `hydrateSessionStore`.
 */
export const useSessionStore = create<ISessionState>()(
  persist(
    set => ({
      token: undefined,
      user: undefined,
      currentRolePermissions: [],
      setToken: token => {
        set({ token });
      },
      setUser: user => {
        set({ user });
      },
      setCurrentRolePermissions: currentRolePermissions => {
        set({ currentRolePermissions });
      }
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => window.localStorage),
      partialize: ({ token }) => ({ token }),
      skipHydration: true
    }
  )
);

/**
 * Restores the persisted token on the client. Later calls are no-ops.
 */
export const hydrateSessionStore = async (): Promise<void> => {
  if (useSessionStore.persist.hasHydrated()) return;

  await useSessionStore.persist.rehydrate();
};
