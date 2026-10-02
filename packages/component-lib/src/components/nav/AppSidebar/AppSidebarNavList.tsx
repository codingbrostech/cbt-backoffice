import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';
import { Slot } from 'radix-ui';
import type { CSSProperties } from 'react';
import { useCallback, useState } from 'react';

import { useAppSidebar } from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar-context';
import styles from '@cbt-bo/component-lib/components/nav/AppSidebar/app-sidebar.module.css';
import type { INavGroupItem, TNavItem } from '@cbt-bo/component-lib/lib/nav-items';
import { containsActiveKey, isNavGroupItem } from '@cbt-bo/component-lib/lib/nav-items';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IAppSidebarNavListProps {
  items: TNavItem[];
  /**
   * Called when a leaf is clicked, after the link's own click handler.
   */
  onNavigate?: () => void;
  /**
   * Nesting depth, which sets the row indent. Defaults to 0.
   */
  level?: number;
}

interface INavGroupRowProps {
  item: INavGroupItem;
  onNavigate?: () => void;
  level: number;
}

const ROW_PADDING_REM = 0.5;
const LEVEL_INDENT_REM = 1.5;

const buildIndentStyle = (level: number): CSSProperties => ({
  paddingLeft: `${ROW_PADDING_REM + level * LEVEL_INDENT_REM}rem`
});

/**
 * A group's header row. Shows the group's icon at rest and a chevron on hover,
 * keeps the children mounted only while open, and shows as active while it is
 * collapsed over the active leaf.
 */
const NavGroupRow = ({ item, onNavigate, level }: INavGroupRowProps) => {
  const { activeKey } = useAppSidebar();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = !isOpen && containsActiveKey(item, activeKey);
  const indentStyle = buildIndentStyle(level);
  const ChevronIcon = isOpen ? ChevronDownIcon : ChevronRightIcon;

  const handleToggle = useCallback(() => {
    setIsOpen(open => !open);
  }, []);

  return (
    <>
      <button
        type="button"
        className={cn(styles.navRow, styles.navGroup)}
        data-slot="app-sidebar-nav-group"
        data-active={isActive}
        aria-expanded={isOpen}
        style={indentStyle}
        onClick={handleToggle}
      >
        <span className={styles.navGroupIcon}>
          <span className={styles.navGroupGlyph}>{item.icon}</span>
          <ChevronIcon className={styles.navGroupChevron} />
        </span>
        <span className={styles.navLabel}>{item.label}</span>
      </button>
      {isOpen && (
        <AppSidebarNavList items={item.children} onNavigate={onNavigate} level={level + 1} />
      )}
    </>
  );
};

/**
 * Renders `items` as a nested nav list. A group becomes a toggleable heading
 * followed by its children, recursing for deeper groups, and every row indents
 * by `level`. Reads `activeKey` and `renderLink` from the `AppSidebar` context.
 */
const AppSidebarNavList = ({ items, onNavigate, level = 0 }: IAppSidebarNavListProps) => {
  const { activeKey, renderLink } = useAppSidebar();

  const indentStyle = buildIndentStyle(level);

  return (
    <ul className={styles.navList} data-slot="app-sidebar-nav-list">
      {items.map(item => (
        <li key={item.key}>
          {isNavGroupItem(item) ? (
            <NavGroupRow item={item} onNavigate={onNavigate} level={level} />
          ) : (
            <Slot.Root
              className={styles.navRow}
              data-slot="app-sidebar-nav-item"
              data-active={item.key === activeKey}
              style={indentStyle}
              onClick={onNavigate}
            >
              {renderLink(
                item,
                <>
                  {item.icon}
                  <span className={styles.navLabel}>{item.label}</span>
                </>
              )}
            </Slot.Root>
          )}
        </li>
      ))}
    </ul>
  );
};

AppSidebarNavList.displayName = 'AppSidebarNavList';

export default AppSidebarNavList;
