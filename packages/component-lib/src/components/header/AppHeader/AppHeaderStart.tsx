import type { ReactNode } from 'react';

import styles from '@cbt-bo/component-lib/components/header/AppHeader/app-header.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppHeaderStartProps {
  /**
   * What sits at the start of the bar, usually `BrandLogo`.
   */
  children: ReactNode;
  className?: string;
}

/**
 * The leading slot of the bar, exposed as `AppHeader.Start`. Place it inside
 * `AppHeader.Root` before `AppHeader.End`.
 */
const AppHeaderStart = ({ children, className }: IAppHeaderStartProps) => (
  <div className={cn(styles.start, className)} data-slot="app-header-start">
    {children}
  </div>
);

AppHeaderStart.displayName = 'AppHeader.Start';

export default AppHeaderStart;
