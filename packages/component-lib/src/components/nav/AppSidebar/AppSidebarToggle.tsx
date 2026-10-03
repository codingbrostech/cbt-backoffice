import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';

import AppSidebarTooltip from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarTooltip';
import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';
import { useSidebar } from '@cbt-bo/component-lib/components/ui/sidebar';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppSidebarToggleProps {
  /**
   * Accessible label while the rail is collapsed.
   */
  openLabel: string;
  /**
   * Accessible label while the rail is expanded.
   */
  closeLabel: string;
  className?: string;
}

/**
 * Button that collapses and expands the rail, exposed as `AppSidebar.Toggle`.
 * Pass the accessible label for each state.
 */
const AppSidebarToggle = ({ openLabel, closeLabel, className }: IAppSidebarToggleProps) => {
  const { open: isNavExpanded, setOpen } = useSidebar();

  const label = isNavExpanded ? closeLabel : openLabel;
  const Icon = isNavExpanded ? PanelLeftCloseIcon : PanelLeftOpenIcon;

  const handleClick = () => {
    setOpen(!isNavExpanded);
  };

  return (
    <AppSidebarTooltip label={label}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className={cn(styles.toggle, className)}
        data-slot="app-sidebar-toggle"
      >
        <Icon />
      </button>
    </AppSidebarTooltip>
  );
};

AppSidebarToggle.displayName = 'AppSidebar.Toggle';

export default AppSidebarToggle;
