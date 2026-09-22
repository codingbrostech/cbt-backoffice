import type { AdminRolePermEntry } from '@cbt-bo/api-schema/bo-fm/models';
import { createStore } from '@tanstack/react-store';

export interface IUser {
  name: string;
  token: string;
  role: string;
}

export interface IAppState {
  isReady: boolean;
  user?: IUser;
  currentRolePermissions: AdminRolePermEntry[];
}

const initialState: IAppState = {
  isReady: false,
  user: undefined,
  currentRolePermissions: []
};

export const appStore = createStore(initialState, ({ setState }) => ({
  setIsReady: (isReady: boolean) => {
    setState(prev => ({ ...prev, isReady }));
  },
  setUser: (user?: IUser) => {
    setState(prev => ({ ...prev, user }));
  },
  setCurrentRolePermissions: (currentRolePermissions: AdminRolePermEntry[]) => {
    setState(prev => ({ ...prev, currentRolePermissions }));
  },
  clearCurrentRolePermissions: () => {
    setState(prev => ({ ...prev, currentRolePermissions: [] }));
  }
}));
