import { createContext, useContext } from 'react';

export interface ISearchBarContext {
  clearLabel: string;
}

export const SearchBarContext = createContext<ISearchBarContext | undefined>(undefined);

/**
 * Reads the labels shared by the field parts inside `SearchBar`. Throws when
 * called outside a `SearchBar.Root`.
 */
export const useSearchBar = (): ISearchBarContext => {
  const context = useContext(SearchBarContext);
  if (!context) throw new Error('useSearchBar must be used within SearchBar');

  return context;
};
