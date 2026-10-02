import type { ReactNode } from 'react';

import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppSidebarRailProps {
  /**
   * The rail's parts, usually `AppSidebar.Menu` then `AppSidebar.Footer`.
   */
  children: ReactNode;
  className?: string;
}

/**
 * The icon column of the sidebar, exposed as `AppSidebar.Rail`. Its width
 * follows the root's `data-state` through `--app-sidebar-rail-width` and
 * `--app-sidebar-rail-width-collapsed`.
 */
const AppSidebarRail = ({ children, className }: IAppSidebarRailProps) => (
  <div className={cn(styles.rail, className)} data-slot="app-sidebar-rail">
    {children}
  </div>
);

AppSidebarRail.displayName = 'AppSidebar.Rail';

export default AppSidebarRail;
