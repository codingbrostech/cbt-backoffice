import { createContext, useContext } from 'react';

export interface IPageContext {
  isPageScroll: boolean;
}

export const PageContext = createContext<IPageContext | undefined>(undefined);

/**
 * Reads the scroll mode shared by the parts inside `Page`. Throws when called
 * outside a `Page.Root`.
 */
export const usePage = (): IPageContext => {
  const context = useContext(PageContext);
  if (!context) throw new Error('usePage must be used within Page');

  return context;
};
