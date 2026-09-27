import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from '@cbt-bo/component-lib/components/ui/sidebar';
import type { INavGroupItem, INavLeafItem, TNavItem } from '@cbt-bo/component-lib/lib/nav-items';
import { isNavGroupItem } from '@cbt-bo/component-lib/lib/nav-items';

export interface INavMenuListProps {
  items: TNavItem[];
  activeKey: string;
  renderLink: (item: INavLeafItem, children: ReactNode) => ReactNode;
  onNavigate?: () => void;
  level?: number;
}

interface INavGroupRowProps {
  item: INavGroupItem;
  activeKey: string;
  renderLink: (item: INavLeafItem, children: ReactNode) => ReactNode;
  onNavigate?: () => void;
  level: number;
}

/**
 * A group's header row. Shows the group's icon at rest, swapping it for a
 * chevron on hover (right when collapsed, down when expanded) to invite the
 * toggle, Slack-sidebar style. Children stay mounted only while open.
 */
const NavGroupRow = ({ item, activeKey, renderLink, onNavigate, level }: INavGroupRowProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setIsOpen(open => !open);
  }, []);

  return (
    <>
      <SidebarGroupLabel
        asChild
        className="group/nav-group-label cursor-pointer gap-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <button onClick={handleToggle} aria-expanded={isOpen}>
          <span className="relative flex size-4 shrink-0 items-center justify-center [&_svg]:size-4">
            <span className="group-hover/nav-group-label:hidden">{item.icon}</span>
            {isOpen ? (
              <ChevronDownIcon className="hidden group-hover/nav-group-label:block" />
            ) : (
              <ChevronRightIcon className="hidden group-hover/nav-group-label:block" />
            )}
          </span>
          <span>{item.label}</span>
        </button>
      </SidebarGroupLabel>
      {isOpen && (
        <NavMenuList
          items={item.children}
          activeKey={activeKey}
          renderLink={renderLink}
          onNavigate={onNavigate}
          level={level + 1}
        />
      )}
    </>
  );
};

/**
 * Renders `items` as a nav list. A group becomes a toggleable section heading
 * followed by its children in a `SidebarMenuSub`, recursing for deeper groups.
 */
const NavMenuList = ({
  items,
  activeKey,
  renderLink,
  onNavigate,
  level = 0
}: INavMenuListProps) => {
  const Menu = level === 0 ? SidebarMenu : SidebarMenuSub;
  const MenuItem = level === 0 ? SidebarMenuItem : SidebarMenuSubItem;
  const MenuButton = level === 0 ? SidebarMenuButton : SidebarMenuSubButton;

  return (
    <Menu className={level > 0 ? 'border-l-0' : undefined}>
      {items.map(item => {
        if (!isNavGroupItem(item)) {
          return (
            <MenuItem key={item.key}>
              <MenuButton asChild isActive={item.key === activeKey} onClick={onNavigate}>
                {renderLink(
                  item,
                  <>
                    {item.icon}
                    <span>{item.label}</span>
                  </>
                )}
              </MenuButton>
            </MenuItem>
          );
        }

        return (
          <MenuItem key={item.key}>
            <NavGroupRow
              item={item}
              activeKey={activeKey}
              renderLink={renderLink}
              onNavigate={onNavigate}
              level={level}
            />
          </MenuItem>
        );
      })}
    </Menu>
  );
};

export default NavMenuList;
