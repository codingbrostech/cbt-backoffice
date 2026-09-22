import { createContext, useContext } from 'react';

export interface IAppContentTabsContext {
  toolbarNode: HTMLElement | null;
}

export const AppContentTabsContext = createContext<IAppContentTabsContext>({ toolbarNode: null });

export const useAppContentTabs = (): IAppContentTabsContext => useContext(AppContentTabsContext);
