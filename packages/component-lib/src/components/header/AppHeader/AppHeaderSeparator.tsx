import { Separator as SeparatorPrimitive } from 'radix-ui';

import styles from '@cbt-bo/component-lib/components/header/AppHeader/app-header.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppHeaderSeparatorProps {
  className?: string;
}

/**
 * A short vertical rule between groups of controls, exposed as
 * `AppHeader.Separator`. Place it between children of `AppHeader.End`.
 */
const AppHeaderSeparator = ({ className }: IAppHeaderSeparatorProps) => (
  <SeparatorPrimitive.Root
    decorative
    orientation="vertical"
    className={cn(styles.separator, className)}
    data-slot="app-header-separator"
  />
);

AppHeaderSeparator.displayName = 'AppHeader.Separator';

export default AppHeaderSeparator;
