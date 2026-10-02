import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { INavLeafItem, TNavItem } from '@cbt-bo/component-lib/lib/nav-items';

export interface IAppSidebarContext {
  items: TNavItem[];
  activeKey?: string;
  renderLink: (item: INavLeafItem, children: ReactNode) => ReactNode;
  isNavExpanded: boolean;
  dockedGroupKey?: string;
  popoverGroupKey?: string;
  panelItems?: TNavItem[];
  selectGroup: (key?: string) => void;
}

export const AppSidebarContext = createContext<IAppSidebarContext | undefined>(undefined);

/**
 * Reads the nav items, the active key and the group selection shared by the
 * parts inside `AppSidebar`. Throws when called outside an `AppSidebar`.
 */
export const useAppSidebar = (): IAppSidebarContext => {
  const context = useContext(AppSidebarContext);
  if (!context) throw new Error('useAppSidebar must be used within AppSidebar');

  return context;
};
