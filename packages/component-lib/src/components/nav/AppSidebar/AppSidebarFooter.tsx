import type { ReactNode } from 'react';

import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppSidebarFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * Bottom slot of the rail, exposed as `AppSidebar.Footer`. Pass what sits
 * under the menu as children, usually `AppSidebar.Toggle`.
 */
const AppSidebarFooter = ({ children, className }: IAppSidebarFooterProps) => (
  <div className={cn(styles.footer, className)} data-slot="app-sidebar-footer">
    {children}
  </div>
);

AppSidebarFooter.displayName = 'AppSidebar.Footer';

export default AppSidebarFooter;
