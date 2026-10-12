import { usePageTabsStore } from '@cbt-bo/api/page-tabs/store';
import type { TNavItem } from '@cbt-bo/component-lib/components/nav';
import { buildActiveNavItem } from '@cbt-bo/component-lib/components/nav';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export interface IPageTab {
  key: string;
  label: string;
}

export interface IUsePageTabsResult {
  tabs: IPageTab[];
  activeKey: string;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
  onCloseOthers: (path: string) => void;
  onMove: (path: string, targetPath: string) => void;
}

/**
 * Tracks the pages open as header tabs for `pathname`, backed by
 * `usePageTabsStore`. Selecting a tab navigates to it. Closing the active
 * tab navigates to its neighbor, closing another tab just drops it. Closing
 * the other tabs keeps `pathname` open without navigating. Dropping a
 * dragged tab over another moves it to that tab's position.
 */
export const usePageTabs = (items: TNavItem[], pathname: string): IUsePageTabsResult => {
  const navigate = useNavigate();
  const paths = usePageTabsStore(state => state.paths);
  const openPath = usePageTabsStore(state => state.openPath);
  const closePath = usePageTabsStore(state => state.closePath);
  const closeOtherPaths = usePageTabsStore(state => state.closeOtherPaths);
  const movePath = usePageTabsStore(state => state.movePath);

  const tabs = paths.map(path => ({
    key: path,
    label: buildActiveNavItem(items, path)?.label ?? path
  }));

  const handleSelect = (path: string) => {
    void navigate({ href: path });
  };

  const handleClose = (path: string) => {
    if (path !== pathname) {
      closePath(path);
      return;
    }
    if (paths.length === 1) return;

    const pathIndex = paths.findIndex(candidate => candidate === path);
    const nextIndex = pathIndex === 0 ? 1 : pathIndex - 1;
    const nextPath = paths[nextIndex];
    if (!nextPath) return;

    closePath(path);
    void navigate({ href: nextPath });
  };

  useEffect(() => {
    openPath(pathname);
  }, [pathname, openPath]);

  return {
    tabs,
    activeKey: pathname,
    onSelect: handleSelect,
    onClose: handleClose,
    onCloseOthers: closeOtherPaths,
    onMove: movePath
  };
};
