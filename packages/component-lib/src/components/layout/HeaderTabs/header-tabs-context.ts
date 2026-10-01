import { createContext, useContext } from 'react';

import type { IHeaderTab } from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTab';

export interface IHeaderTabsContext {
  tabs: IHeaderTab[];
  activeKey: string;
  isClosable: boolean;
  isDraggable: boolean;
  onClose: (key: string) => void;
  onCloseOthers: (key: string) => void;
}

export const HeaderTabsContext = createContext<IHeaderTabsContext | undefined>(undefined);

/**
 * Reads the open tabs and handlers shared by the parts inside `HeaderTabs`.
 * Throws when called outside a `HeaderTabs.Root`.
 */
export const useHeaderTabs = (): IHeaderTabsContext => {
  const context = useContext(HeaderTabsContext);
  if (!context) throw new Error('useHeaderTabs must be used within HeaderTabs');

  return context;
};
