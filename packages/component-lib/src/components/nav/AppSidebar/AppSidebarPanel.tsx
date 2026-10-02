import AppSidebarNavList from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarNavList';
import { useAppSidebar } from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar-context';
import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppSidebarPanelProps {
  className?: string;
}

/**
 * The docked column beside the rail, exposed as `AppSidebar.Panel`. Lists
 * the children of the docked group through `AppSidebarNavList` and renders nothing
 * while no group is docked. Place it inside `AppSidebar.Root` after
 * `AppSidebar.Rail`.
 */
const AppSidebarPanel = ({ className }: IAppSidebarPanelProps) => {
  const { panelItems } = useAppSidebar();

  if (!panelItems) return null;

  return (
    <div className={cn(styles.panel, className)} data-slot="app-sidebar-panel">
      <AppSidebarNavList items={panelItems} />
    </div>
  );
};

AppSidebarPanel.displayName = 'AppSidebar.Panel';

export default AppSidebarPanel;
