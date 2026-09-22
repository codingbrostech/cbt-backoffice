import { createStore } from '@tanstack/react-store';

import { persistStore } from './persist-store';

export type TColorScheme = 'light' | 'dark';

export interface ISettingState {
  language: string;
  colorScheme: TColorScheme;
}

const initialState: ISettingState = {
  language: 'en',
  colorScheme: 'light'
};

export const settingStore = createStore(initialState, ({ setState }) => ({
  setLanguage: (language: string) => {
    setState(prev => ({ ...prev, language }));
  },
  setColorScheme: (colorScheme: TColorScheme) => {
    setState(prev => ({ ...prev, colorScheme }));
  }
}));

const { hydrate } = persistStore(settingStore, {
  name: 'tgpx-adm-setting-storage',
  storage: () => localStorage
});

export const hydrateSettings = hydrate;
