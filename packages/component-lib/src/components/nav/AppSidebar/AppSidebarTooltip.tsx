import { Tooltip as TooltipPrimitive } from 'radix-ui';
import type { ReactElement } from 'react';

import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';

interface IAppSidebarTooltipProps {
  label: string;
  children: ReactElement;
}

const TOOLTIP_SIDE_OFFSET_PX = 12;

/**
 * Pill tooltip to the right of a rail control, TOOLTIP_SIDE_OFFSET_PX away
 * from it. Needs a Radix `TooltipProvider` above it, which `SidebarProvider`
 * supplies.
 */
const AppSidebarTooltip = ({ label, children }: IAppSidebarTooltipProps) => (
  <TooltipPrimitive.Root>
    <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        side="right"
        sideOffset={TOOLTIP_SIDE_OFFSET_PX}
        className={styles.tooltip}
        data-slot="app-sidebar-tooltip"
      >
        {label}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  </TooltipPrimitive.Root>
);

AppSidebarTooltip.displayName = 'AppSidebarTooltip';

export default AppSidebarTooltip;
