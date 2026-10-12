import type { ReactNode } from 'react';

import styles from '@cbt-bo/component-lib/components/header/AppHeader/app-header.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppHeaderEndProps {
  /**
   * The controls at the end of the bar, such as `TimezoneClock`, `ThemeToggle`,
   * `LanguageMenu` and `UserMenu`, with `AppHeader.Separator` between groups.
   */
  children: ReactNode;
  className?: string;
}

/**
 * The trailing slot of the bar, exposed as `AppHeader.End`. Lines its children
 * up in a row. Place it inside `AppHeader.Root` after `AppHeader.Start`.
 */
const AppHeaderEnd = ({ children, className }: IAppHeaderEndProps) => (
  <div className={cn(styles.end, className)} data-slot="app-header-end">
    {children}
  </div>
);

AppHeaderEnd.displayName = 'AppHeader.End';

export default AppHeaderEnd;
