import type { TNavItem } from '@cbt-bo/component-lib/components/nav';
import { AppSidebar } from '@cbt-bo/component-lib/components/nav';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export interface IShellSidebarProps {
  items: TNavItem[];
  activeKey?: string;
}

/**
 * Navigation rail and group panel of the authenticated shell. Leaf items
 * render as router links.
 */
const ShellSidebar = ({ items, activeKey }: IShellSidebarProps) => {
  const { t } = useTranslation();

  return (
    <AppSidebar.Root
      items={items}
      activeKey={activeKey}
      renderLink={(item, children) => (
        <Link to={item.path} className="flex items-center gap-2">
          {children}
        </Link>
      )}
    >
      <AppSidebar.Rail>
        <AppSidebar.Menu />
        <AppSidebar.Footer>
          <AppSidebar.Toggle
            openLabel={t('common.openSidebar')}
            closeLabel={t('common.closeSidebar')}
          />
        </AppSidebar.Footer>
      </AppSidebar.Rail>
      <AppSidebar.Panel />
    </AppSidebar.Root>
  );
};

export default ShellSidebar;
