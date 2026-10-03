import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const PAGE_TABS_STORAGE_KEY = 'app-page-tabs';

export interface IPageTabsState {
  paths: string[];
  openPath: (path: string) => void;
  closePath: (path: string) => void;
  closeOtherPaths: (path: string) => void;
  /**
   * Moves `path` to `targetPath`'s index. Either path not being open leaves
   * the order unchanged.
   */
  movePath: (path: string, targetPath: string) => void;
  clearPaths: () => void;
}

/**
 * Paths open as header tabs in the authenticated shell, persisted under
 * PAGE_TABS_STORAGE_KEY for the browser tab's lifetime.
 * Hydration is skipped on load and started through `hydratePageTabsStore`.
 */
export const usePageTabsStore = create<IPageTabsState>()(
  persist(
    (set, get) => ({
      paths: [],
      openPath: path => {
        const { paths } = get();
        if (paths.includes(path)) return;
        set({ paths: [...paths, path] });
      },
      closePath: path => {
        set({ paths: get().paths.filter(candidate => candidate !== path) });
      },
      closeOtherPaths: path => {
        set({ paths: get().paths.filter(candidate => candidate === path) });
      },
      movePath: (path, targetPath) => {
        const { paths } = get();
        const fromIndex = paths.indexOf(path);
        const toIndex = paths.indexOf(targetPath);
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

        const remainingPaths = paths.filter(candidate => candidate !== path);
        const nextPaths = remainingPaths.toSpliced(toIndex, 0, path);
        set({ paths: nextPaths });
      },
      clearPaths: () => {
        set({ paths: [] });
      }
    }),
    {
      name: PAGE_TABS_STORAGE_KEY,
      storage: createJSONStorage(() => window.sessionStorage),
      skipHydration: true
    }
  )
);

/**
 * Restores the persisted open tabs on the client. Later calls are no-ops.
 */
export const hydratePageTabsStore = async (): Promise<void> => {
  if (usePageTabsStore.persist.hasHydrated()) return;

  await usePageTabsStore.persist.rehydrate();
};
