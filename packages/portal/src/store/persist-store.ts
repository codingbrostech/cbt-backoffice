import type { Store, StoreActionMap } from '@tanstack/react-store';

interface IPersistedRecord<TState> {
  state: Partial<TState>;
  version: number;
}

export interface IPersistStoreOptions<TState extends object> {
  /**
   * Storage key.
   */
  name: string;
  storage: () => Storage;
  /**
   * Records written with another version are ignored on hydrate. Defaults to 1.
   */
  version?: number;
  /**
   * Subset of the state to write. Defaults to the whole state.
   */
  pick?: (state: TState) => Partial<TState>;
}

export interface IPersistedStore {
  hydrate: () => void;
}

const isPersistedRecord = <TState>(value: unknown): value is IPersistedRecord<TState> =>
  typeof value === 'object' && value !== null && 'state' in value && 'version' in value;

/**
 * Mirrors a store into web storage as a `{ state, version }` record. Nothing
 * is written until `hydrate` has run, which keeps server renders and the
 * first client render on the initial state.
 *
 * @example
 * const { hydrate } = persistStore(settingStore, {
 *   name: 'tgpx-adm-setting-storage',
 *   storage: () => localStorage
 * });
 */
export const persistStore = <TState extends object, TActions extends StoreActionMap>(
  store: Store<TState, TActions>,
  options: IPersistStoreOptions<TState>
): IPersistedStore => {
  const { name, storage, version = 1, pick = state => state } = options;
  let isHydrated = false;

  const read = (): Partial<TState> | undefined => {
    try {
      const raw = storage().getItem(name);
      if (!raw) return undefined;

      const parsed: unknown = JSON.parse(raw);

      return isPersistedRecord<TState>(parsed) && parsed.version === version
        ? parsed.state
        : undefined;
    } catch {
      return undefined;
    }
  };

  const write = (state: TState): void => {
    try {
      storage().setItem(name, JSON.stringify({ state: pick(state), version }));
    } catch {
      return;
    }
  };

  const hydrate = (): void => {
    const stored = read();

    if (stored) {
      store.setState(prev => ({ ...prev, ...stored }));
    }
    isHydrated = true;
  };

  store.subscribe(() => {
    if (isHydrated) write(store.state);
  });

  return { hydrate };
};
