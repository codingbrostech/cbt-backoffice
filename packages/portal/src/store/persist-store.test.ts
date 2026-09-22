import { createStore } from '@tanstack/react-store';

import { persistStore } from './persist-store';

interface ICounterState {
  count: number;
  label: string;
}

const STORAGE_KEY = 'test-counter';

const buildStore = () => createStore<ICounterState>({ count: 0, label: 'initial' });

describe('persistStore', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('when hydrate runs with a stored record of the same version', () => {
    it('should merge the stored state into the store', () => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { count: 3 }, version: 1 }));
      const store = buildStore();
      const { hydrate } = persistStore(store, { name: STORAGE_KEY, storage: () => sessionStorage });

      hydrate();

      expect(store.state).toEqual({ count: 3, label: 'initial' });
    });
  });

  describe('when the stored record has another version', () => {
    it('should keep the initial state', () => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ state: { count: 3 }, version: 1 }));
      const store = buildStore();
      const { hydrate } = persistStore(store, {
        name: STORAGE_KEY,
        storage: () => sessionStorage,
        version: 2
      });

      hydrate();

      expect(store.state.count).toBe(0);
    });
  });

  describe('when the state changes before hydrate', () => {
    it('should not write to storage', () => {
      const store = buildStore();
      persistStore(store, { name: STORAGE_KEY, storage: () => sessionStorage });

      store.setState(prev => ({ ...prev, count: 1 }));

      expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull();
    });
  });

  describe('when the state changes after hydrate', () => {
    it('should write the picked state with the version', () => {
      const store = buildStore();
      const { hydrate } = persistStore(store, {
        name: STORAGE_KEY,
        storage: () => sessionStorage,
        pick: ({ count }) => ({ count })
      });

      hydrate();
      store.setState(prev => ({ ...prev, count: 5, label: 'changed' }));

      expect(JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '')).toEqual({
        state: { count: 5 },
        version: 1
      });
    });
  });

  describe('when storage holds invalid JSON', () => {
    it('should keep the initial state', () => {
      sessionStorage.setItem(STORAGE_KEY, '{not json');
      const store = buildStore();
      const { hydrate } = persistStore(store, { name: STORAGE_KEY, storage: () => sessionStorage });

      hydrate();

      expect(store.state.count).toBe(0);
    });
  });
});
