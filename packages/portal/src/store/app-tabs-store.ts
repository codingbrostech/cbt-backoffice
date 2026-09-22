import { createStore } from '@tanstack/react-store';

import { persistStore } from './persist-store';

export interface ITabItem {
  /**
   * Pathname the tab was opened for. One tab per pathname.
   */
  pathname: string;
  /**
   * Last visited location of the tab, pathname plus search.
   */
  href: string;
}

export interface IAppTabsState {
  tabs: ITabItem[];
  currentPathname?: string;
  /**
   * Dynamic titles keyed by pathname, for example a player name.
   */
  tabNames: Record<string, string>;
}

const initialState: IAppTabsState = {
  tabs: [],
  currentPathname: undefined,
  tabNames: {}
};

export const appTabsStore = createStore(initialState, ({ setState, get }) => ({
  openTab: (tab: ITabItem) => {
    const { tabs } = get();
    const isOpen = tabs.some(item => item.pathname === tab.pathname);
    const nextTabs = isOpen
      ? tabs.map(item => (item.pathname === tab.pathname ? tab : item))
      : [...tabs, tab];

    setState(prev => ({ ...prev, tabs: nextTabs, currentPathname: tab.pathname }));
  },
  removeTab: (pathname: string) => {
    const { tabs, tabNames } = get();
    if (tabs.length < 2) return;

    const { [pathname]: removedName, ...restNames } = tabNames;
    const nextTabs = tabs.filter(item => item.pathname !== pathname);

    setState(prev => ({ ...prev, tabs: nextTabs, tabNames: removedName ? restNames : tabNames }));
  },
  removeOtherTabs: (pathname: string) => {
    const { tabs, tabNames } = get();
    const selected = tabs.find(item => item.pathname === pathname);
    if (tabs.length < 2 || !selected) return;

    const { [pathname]: keptName } = tabNames;

    setState(prev => ({
      ...prev,
      tabs: [selected],
      tabNames: keptName ? { [pathname]: keptName } : {}
    }));
  },
  setTabName: (pathname: string, name: string) => {
    setState(prev => ({ ...prev, tabNames: { ...prev.tabNames, [pathname]: name } }));
  },
  clearTabs: () => {
    setState(prev => ({ ...prev, tabs: [], currentPathname: undefined, tabNames: {} }));
  }
}));

const { hydrate } = persistStore(appTabsStore, {
  name: 'tgpx-adm-tpl',
  storage: () => sessionStorage,
  version: 2
});

export const hydrateAppTabs = hydrate;
