import type { ReactNode } from 'react';

interface INavItemBase {
  key: string;
  label: string;
  icon?: ReactNode;
  pageKey: string;
}

/**
 * A directly navigable nav entry. Selecting it routes to `path`.
 */
export interface INavLeafItem extends INavItemBase {
  path: string;
  children?: undefined;
}

/**
 * A nav entry that opens a secondary panel listing `children` instead of
 * navigating itself. A child may itself be a group, nesting an expandable
 * sub-section inside that panel.
 */
export interface INavGroupItem extends INavItemBase {
  path?: undefined;
  children: TNavItem[];
}

export type TNavItem = INavLeafItem | INavGroupItem;

export const isNavGroupItem = (item: TNavItem): item is INavGroupItem =>
  Boolean(item.children?.length);

/**
 * Whether `item` or one of its nested children, at any depth, matches `activeKey`.
 * False when `activeKey` is absent.
 */
export const containsActiveKey = (item: TNavItem, activeKey?: string): boolean => {
  if (item.key === activeKey) return true;

  return isNavGroupItem(item) && item.children.some(child => containsActiveKey(child, activeKey));
};

/**
 * The top-level item whose subtree contains `activeKey`, if any. Used to
 * auto-open the right group's panel when landing directly on one of its pages.
 */
export const buildActiveGroupKey = (items: TNavItem[], activeKey?: string): string | undefined =>
  items.find(item => isNavGroupItem(item) && containsActiveKey(item, activeKey))?.key;

/**
 * The leaf item whose `path` matches `pathname`, searching nested group
 * children at any depth.
 */
export const buildActiveNavItem = (
  items: TNavItem[],
  pathname: string
): INavLeafItem | undefined => {
  for (const item of items) {
    if (isNavGroupItem(item)) {
      const childItem = buildActiveNavItem(item.children, pathname);
      if (childItem) return childItem;
      continue;
    }

    if (item.path === pathname) return item;
  }

  return undefined;
};

/**
 * The key of the leaf item whose `path` matches `pathname`, searching nested
 * group children at any depth.
 */
export const buildActiveNavKey = (items: TNavItem[], pathname: string): string | undefined =>
  buildActiveNavItem(items, pathname)?.key;

/**
 * The `path` of the first leaf in `items`, searching nested group children
 * at any depth.
 */
export const buildFirstNavPath = (items: TNavItem[]): string | undefined => {
  for (const item of items) {
    if (!isNavGroupItem(item)) return item.path;

    const childPath = buildFirstNavPath(item.children);
    if (childPath) return childPath;
  }

  return undefined;
};

/**
 * Copy of `items` keeping the leaves that pass `isVisible`, searching nested
 * group children at any depth. A group without a visible child is dropped.
 *
 * @example
 * buildVisibleNavItems(items, ({ pageKey }) => allowedPageKeys.includes(pageKey));
 */
export const buildVisibleNavItems = (
  items: TNavItem[],
  isVisible: (item: INavLeafItem) => boolean
): TNavItem[] =>
  items.flatMap<TNavItem>(item => {
    if (!isNavGroupItem(item)) return isVisible(item) ? [item] : [];

    const children = buildVisibleNavItems(item.children, isVisible);

    return children.length ? [{ ...item, children }] : [];
  });
