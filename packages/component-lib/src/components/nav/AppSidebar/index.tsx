import { PanelLeftCloseIcon, PanelLeftOpenIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

import NavMenuList from '@cbt-bo/component-lib/components/nav/NavMenuList';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@cbt-bo/component-lib/components/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@cbt-bo/component-lib/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@cbt-bo/component-lib/components/ui/tooltip';
import type { INavLeafItem, TNavItem } from '@cbt-bo/component-lib/lib/nav-items';
import {
  buildActiveGroupKey,
  containsActiveKey,
  isNavGroupItem
} from '@cbt-bo/component-lib/lib/nav-items';

export interface IAppSidebarProps {
  items: TNavItem[];
  activeKey: string;
  renderLink: (item: INavLeafItem, children: ReactNode) => ReactNode;
  footer?: ReactNode;
}

/**
 * A group picked from the rail, tagged with the nav mode it was picked in.
 * A pick made in the other mode is ignored, so toggling the rail drops it.
 * Navigating to a different page also drops it, so the docked or popover
 * panel falls back to following `activeKey`'s own group.
 */
interface IGroupSelection {
  key?: string;
  isNavExpanded: boolean;
}

export const NAV_RAIL_WIDTH = '5rem';
export const NAV_RAIL_WIDTH_COLLAPSED = '3.5rem';
export const NAV_PANEL_WIDTH = '14rem';

const TOOLTIP_PILL = { className: 'rounded-full', sideOffset: 12, showArrow: false } as const;

/**
 * Nav rail for the authenticated pages. Expanded, each top-level item shows
 * its icon and label, and a group opens its children in a docked column that
 * defaults to the group containing `activeKey`. Collapsed, the rail is icon
 * only and a group opens its children in a popover. Navigating to a page
 * outside a manually picked group (a tab, a link inside the panel itself)
 * drops that pick, so the panel snaps back to `activeKey`'s own group. The
 * rail is NAV_RAIL_WIDTH wide expanded and NAV_RAIL_WIDTH_COLLAPSED
 * collapsed, and the docked column adds NAV_PANEL_WIDTH. The root carries
 * `data-panel-docked` while the docked column is shown, so the page
 * container beside it can square off its left edge only then. Reads
 * `useSidebar()`, so it must render inside a `SidebarProvider`, whose open
 * state the footer toggle flips.
 */
const AppSidebar = ({ items, activeKey, renderLink, footer }: IAppSidebarProps) => {
  const { open: isNavExpanded, setOpen } = useSidebar();
  const [groupSelection, setGroupSelection] = useState<IGroupSelection>();
  const [prevActiveKey, setPrevActiveKey] = useState(activeKey);

  if (activeKey !== prevActiveKey) {
    setPrevActiveKey(activeKey);
    setGroupSelection(undefined);
  }

  const selectedGroupKey =
    groupSelection?.isNavExpanded === isNavExpanded ? groupSelection.key : undefined;
  const activeGroupKey = buildActiveGroupKey(items, activeKey);
  const dockedGroupKey = isNavExpanded ? (selectedGroupKey ?? activeGroupKey) : undefined;
  const popoverGroupKey = isNavExpanded ? undefined : selectedGroupKey;
  const dockedGroup = items.find(item => item.key === dockedGroupKey);
  const panelItems = dockedGroup && isNavGroupItem(dockedGroup) ? dockedGroup.children : undefined;
  const railWidth = isNavExpanded ? NAV_RAIL_WIDTH : NAV_RAIL_WIDTH_COLLAPSED;
  const navWidth = panelItems ? `calc(${NAV_RAIL_WIDTH} + ${NAV_PANEL_WIDTH})` : railWidth;
  const railButtonClassName = isNavExpanded
    ? 'h-auto cursor-pointer flex-col gap-1 px-1 py-2 text-[11px] [&>span:last-child]:max-w-full [&>svg]:size-5'
    : 'cursor-pointer justify-center px-2.5 md:px-2 [&>svg]:size-5';
  const railLabelClassName = isNavExpanded ? undefined : 'sr-only';
  const toggleLabel = isNavExpanded ? 'Close sidebar' : 'Open sidebar';
  const ToggleIcon = isNavExpanded ? PanelLeftCloseIcon : PanelLeftOpenIcon;

  const selectGroup = useCallback(
    (key?: string) => {
      setGroupSelection({ key, isNavExpanded });
    },
    [isNavExpanded]
  );

  const handleRailItemClick = useCallback(
    (item: TNavItem) => {
      selectGroup(isNavGroupItem(item) ? item.key : undefined);
    },
    [selectGroup]
  );

  const handlePopoverItemClick = useCallback(() => {
    selectGroup(undefined);
  }, [selectGroup]);

  const handleToggleClick = useCallback(() => {
    setOpen(!isNavExpanded);
  }, [isNavExpanded, setOpen]);

  const renderFooterToggle = () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleToggleClick}
          aria-label={toggleLabel}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg py-2 hover:bg-sidebar-accent"
        >
          <ToggleIcon className="size-5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" {...TOOLTIP_PILL}>
        {toggleLabel}
      </TooltipContent>
    </Tooltip>
  );

  const renderRailLabel = (item: TNavItem) => (
    <>
      {item.icon}
      <span className={railLabelClassName}>{item.label}</span>
    </>
  );

  const renderRailItem = (item: TNavItem) => {
    const isGroup = isNavGroupItem(item);
    const isActive = item.key === dockedGroupKey || containsActiveKey(item, activeKey);

    if (isGroup && !isNavExpanded) {
      return (
        <Popover
          open={popoverGroupKey === item.key}
          onOpenChange={isOpen => {
            selectGroup(isOpen ? item.key : undefined);
          }}
        >
          <PopoverTrigger asChild>
            <SidebarMenuButton
              tooltip={{ children: item.label, ...TOOLTIP_PILL }}
              isActive={isActive}
              className={railButtonClassName}
            >
              {renderRailLabel(item)}
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="start"
            sideOffset={8}
            className="w-56 border-sidebar-border bg-sidebar p-2 text-sidebar-foreground"
          >
            <div className="px-2 pb-2 text-xs font-medium text-sidebar-foreground/70">
              {item.label}
            </div>
            <NavMenuList
              items={item.children}
              activeKey={activeKey}
              renderLink={renderLink}
              onNavigate={handlePopoverItemClick}
            />
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <SidebarMenuButton
        asChild={!isGroup}
        tooltip={{ children: item.label, ...TOOLTIP_PILL }}
        isActive={isActive}
        className={railButtonClassName}
        onClick={() => {
          handleRailItemClick(item);
        }}
      >
        {isGroup ? renderRailLabel(item) : renderLink(item, renderRailLabel(item))}
      </SidebarMenuButton>
    );
  };

  return (
    <Sidebar
      collapsible="none"
      className="hidden shrink-0 flex-row overflow-hidden transition-[width] duration-200 ease-linear md:flex"
      style={{ width: navWidth }}
      data-panel-docked={panelItems ? '' : undefined}
    >
      <Sidebar collapsible="none" className="shrink-0" style={{ width: railWidth }}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {items.map(item => (
                  <SidebarMenuItem key={item.key}>{renderRailItem(item)}</SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="gap-1.5">
          {footer}
          {renderFooterToggle()}
        </SidebarFooter>
      </Sidebar>

      {panelItems && (
        <Sidebar
          collapsible="none"
          className="hidden min-w-0 flex-1 rounded-tl-md rounded-bl-sm bg-sidebar-panel md:flex"
        >
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <NavMenuList items={panelItems} activeKey={activeKey} renderLink={renderLink} />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </Sidebar>
  );
};

export default AppSidebar;
