import { Popover as PopoverPrimitive, Slot } from 'radix-ui';

import AppSidebarNavList from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarNavList';
import AppSidebarTooltip from '@cbt-bo/component-lib/components/nav/AppSidebar/AppSidebarTooltip';
import { useAppSidebar } from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar-context';
import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';
import type { TNavItem } from '@cbt-bo/component-lib/lib/nav-items';
import { containsActiveKey, isNavGroupItem } from '@cbt-bo/component-lib/lib/nav-items';

export interface IAppSidebarRailItemProps {
  item: TNavItem;
}

const POPOVER_SIDE_OFFSET_PX = 8;

/**
 * One top-level item on the rail. A leaf renders through the root's `renderLink`.
 * A group picks itself in the root, so its children show in the docked panel
 * while the rail is expanded and in a popover while it is collapsed.
 */
const AppSidebarRailItem = ({ item }: IAppSidebarRailItemProps) => {
  const { activeKey, renderLink, isNavExpanded, dockedGroupKey, popoverGroupKey, selectGroup } =
    useAppSidebar();

  const isGroup = isNavGroupItem(item);
  const isActive = item.key === dockedGroupKey || containsActiveKey(item, activeKey);
  const label = (
    <>
      {item.icon}
      <span className={styles.itemLabel}>{item.label}</span>
    </>
  );

  const handleClick = () => {
    selectGroup(isGroup ? item.key : undefined);
  };

  const handlePopoverOpenChange = (isOpen: boolean) => {
    selectGroup(isOpen ? item.key : undefined);
  };

  const handlePopoverNavigate = () => {
    selectGroup(undefined);
  };

  if (!isGroup) {
    const link = (
      <Slot.Root className={styles.item} data-slot="app-sidebar-item" data-active={isActive}>
        {renderLink(item, label)}
      </Slot.Root>
    );

    return isNavExpanded ? link : <AppSidebarTooltip label={item.label}>{link}</AppSidebarTooltip>;
  }

  if (isNavExpanded) {
    return (
      <button
        type="button"
        className={styles.item}
        data-slot="app-sidebar-item"
        data-active={isActive}
        onClick={handleClick}
      >
        {label}
      </button>
    );
  }

  return (
    <PopoverPrimitive.Root
      open={popoverGroupKey === item.key}
      onOpenChange={handlePopoverOpenChange}
    >
      <AppSidebarTooltip label={item.label}>
        <PopoverPrimitive.Trigger
          className={styles.item}
          data-slot="app-sidebar-item"
          data-active={isActive}
        >
          {label}
        </PopoverPrimitive.Trigger>
      </AppSidebarTooltip>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="right"
          align="start"
          sideOffset={POPOVER_SIDE_OFFSET_PX}
          className={styles.popover}
          data-slot="app-sidebar-popover"
        >
          <div className={styles.popoverTitle}>{item.label}</div>
          <AppSidebarNavList items={item.children} onNavigate={handlePopoverNavigate} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};

AppSidebarRailItem.displayName = 'AppSidebarRailItem';

export default AppSidebarRailItem;
