import { createStore } from '@tanstack/react-store';

import type { TNavCategory } from '~/constants/path';

export interface IHeaderNavState {
  /**
   * Category picked in the rail. Absent until the user picks one, in which
   * case the layout derives it from the current path.
   */
  category?: TNavCategory;
}

const initialState: IHeaderNavState = {
  category: undefined
};

export const headerNavStore = createStore(initialState, ({ setState }) => ({
  setCategory: (category: TNavCategory) => {
    setState(prev => ({ ...prev, category }));
  }
}));
