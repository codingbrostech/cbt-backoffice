import type { ReactNode } from 'react';

import styles from '@cbt-bo/component-lib/components/header/AppHeader/app-header.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppHeaderRootProps {
  /**
   * The bar's parts, usually `AppHeader.Start` then `AppHeader.End`.
   */
  children: ReactNode;
  className?: string;
}

/**
 * The top bar of an authenticated page, exposed as `AppHeader.Root`. Lays
 * `AppHeader.Start` and `AppHeader.End` out at either end on the sidebar
 * colors. The controls inside each take their own props.
 *
 * @example
 * <AppHeader.Root>
 *   <AppHeader.Start>
 *     <BrandLogo icon={icon} brandName="Backoffice" />
 *   </AppHeader.Start>
 *   <AppHeader.End>
 *     <TimezoneClock timezoneMinutes={480} isTimezoneSelectable={false} />
 *     <AppHeader.Separator />
 *     <UserMenu userName="admin" logoutLabel="Logout" onLogout={logout} />
 *   </AppHeader.End>
 * </AppHeader.Root>
 */
const AppHeaderRoot = ({ children, className }: IAppHeaderRootProps) => (
  <header className={cn(styles.root, className)} data-slot="app-header">
    {children}
  </header>
);

AppHeaderRoot.displayName = 'AppHeader.Root';

export default AppHeaderRoot;
