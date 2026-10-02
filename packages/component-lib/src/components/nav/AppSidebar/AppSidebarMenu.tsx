import AppSidebarRailItem from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarRailItem';
import { useAppSidebar } from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar-context';
import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppSidebarMenuProps {
  className?: string;
}

/**
 * Renders one rail item per top-level entry in the root's `items`. Exposed as
 * `AppSidebar.Menu`. Place it inside `AppSidebar.Rail`.
 */
const AppSidebarMenu = ({ className }: IAppSidebarMenuProps) => {
  const { items } = useAppSidebar();

  return (
    <ul className={cn(styles.menu, className)} data-slot="app-sidebar-menu">
      {items.map(item => (
        <li key={item.key}>
          <AppSidebarRailItem item={item} />
        </li>
      ))}
    </ul>
  );
};

AppSidebarMenu.displayName = 'AppSidebar.Menu';

export default AppSidebarMenu;
