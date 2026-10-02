import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import { AppSidebarContext } from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar-context';
import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';
import { useSidebar } from '@cbt-bo/component-lib/components/ui/sidebar';
import type { INavLeafItem, TNavItem } from '@cbt-bo/component-lib/lib/nav-items';
import { buildActiveGroupKey, isNavGroupItem } from '@cbt-bo/component-lib/lib/nav-items';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppSidebarRootProps {
  items: TNavItem[];
  activeKey?: string;
  renderLink: (item: INavLeafItem, children: ReactNode) => ReactNode;
  /**
   * The sidebar's parts, usually `AppSidebar.Rail` then `AppSidebar.Panel`.
   */
  children: ReactNode;
  className?: string;
}

/**
 * A group picked from the rail, tagged with the nav mode it was picked in.
 * A pick made in the other mode is ignored, so toggling the rail drops it.
 * Navigating to a different page also drops it, so the docked or popover
 * panel falls back to following `activeKey`'s own group.
 */
interface IGroupSelection {
  key?: string;
  isNavExpanded: boolean;
}

/**
 * Root of the nav rail, exposed as `AppSidebar.Root`. It owns the picked group
 * and shares it with the other parts through context, along with `items`,
 * `activeKey` and `renderLink`. Must render inside a `SidebarProvider`.
 *
 * @example
 * <AppSidebar.Root items={items} activeKey={activeKey} renderLink={renderLink}>
 *   <AppSidebar.Rail>
 *     <AppSidebar.Menu />
 *     <AppSidebar.Footer>
 *       <AppSidebar.Toggle openLabel="Open sidebar" closeLabel="Close sidebar" />
 *     </AppSidebar.Footer>
 *   </AppSidebar.Rail>
 *   <AppSidebar.Panel />
 * </AppSidebar.Root>
 */
const AppSidebarRoot = ({
  items,
  activeKey,
  renderLink,
  children,
  className
}: IAppSidebarRootProps) => {
  const { open: isNavExpanded } = useSidebar();
  const [groupSelection, setGroupSelection] = useState<IGroupSelection>();
  const [prevActiveKey, setPrevActiveKey] = useState(activeKey);

  if (activeKey !== prevActiveKey) {
    setPrevActiveKey(activeKey);
    setGroupSelection(undefined);
  }

  const selectedGroupKey =
    groupSelection?.isNavExpanded === isNavExpanded ? groupSelection.key : undefined;
  const activeGroupKey = buildActiveGroupKey(items, activeKey);
  const dockedGroupKey = isNavExpanded ? (selectedGroupKey ?? activeGroupKey) : undefined;
  const popoverGroupKey = isNavExpanded ? undefined : selectedGroupKey;
  const dockedGroup = items.find(item => item.key === dockedGroupKey);
  const panelItems = dockedGroup && isNavGroupItem(dockedGroup) ? dockedGroup.children : undefined;
  const navState = isNavExpanded ? 'expanded' : 'collapsed';

  const selectGroup = useCallback(
    (key?: string) => {
      setGroupSelection({ key, isNavExpanded });
    },
    [isNavExpanded]
  );

  const context = {
    items,
    activeKey,
    renderLink,
    isNavExpanded,
    dockedGroupKey,
    popoverGroupKey,
    panelItems,
    selectGroup
  };

  return (
    <AppSidebarContext value={context}>
      <div
        className={cn(styles.root, className)}
        data-slot="app-sidebar"
        data-state={navState}
        data-panel-docked={panelItems ? '' : undefined}
      >
        {children}
      </div>
    </AppSidebarContext>
  );
};

AppSidebarRoot.displayName = 'AppSidebar.Root';

export default AppSidebarRoot;
