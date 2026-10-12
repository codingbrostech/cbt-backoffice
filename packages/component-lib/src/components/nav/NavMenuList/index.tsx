import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
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
import { containsActiveKey, isNavGroupItem } from '@cbt-bo/component-lib/lib/nav-items';

const ROW_PADDING_REM = 0.5;
const LEVEL_INDENT_REM = 1.5;

const MENU_BUTTON_CLASS_NAME =
  'h-8 translate-x-0 rounded-sm hover:bg-white/10 hover:text-sidebar-foreground active:bg-sidebar-panel-accent active:text-sidebar-panel-accent-foreground data-[active=true]:bg-sidebar-panel-accent data-[active=true]:text-sidebar-panel-accent-foreground data-[active=true]:hover:bg-sidebar-panel-accent data-[active=true]:hover:text-sidebar-panel-accent-foreground';
const GROUP_LABEL_CLASS_NAME = `${MENU_BUTTON_CLASS_NAME} group/nav-group-label w-full cursor-pointer gap-2 text-sm`;
const SUB_MENU_CLASS_NAME = 'mx-0 translate-x-0 border-l-0 px-0';

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

const buildIndentStyle = (level: number): CSSProperties => ({
  paddingLeft: `${ROW_PADDING_REM + level * LEVEL_INDENT_REM}rem`
});

/**
 * A group's header row. Shows the group's icon at rest, swapping it for a
 * chevron on hover (right when collapsed, down when expanded) to invite the
 * toggle, Slack-sidebar style. Children stay mounted only while open, and the
 * row shows as active while it is collapsed over the active leaf.
 */
const NavGroupRow = ({ item, activeKey, renderLink, onNavigate, level }: INavGroupRowProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const isActive = !isOpen && containsActiveKey(item, activeKey);
  const indentStyle = buildIndentStyle(level);

  const handleToggle = useCallback(() => {
    setIsOpen(open => !open);
  }, []);

  return (
    <>
      <SidebarGroupLabel asChild className={GROUP_LABEL_CLASS_NAME}>
        <button
          onClick={handleToggle}
          aria-expanded={isOpen}
          data-active={isActive}
          style={indentStyle}
        >
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
 * Every row spans the full column width and nested rows indent their content
 * by LEVEL_INDENT_REM per level, so the hover and active highlight lines up
 * across levels.
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
  const indentStyle = buildIndentStyle(level);

  return (
    <Menu className={level > 0 ? SUB_MENU_CLASS_NAME : undefined}>
      {items.map(item => {
        if (!isNavGroupItem(item)) {
          return (
            <MenuItem key={item.key}>
              <MenuButton
                asChild
                isActive={item.key === activeKey}
                onClick={onNavigate}
                className={MENU_BUTTON_CLASS_NAME}
                style={indentStyle}
              >
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
