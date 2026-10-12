import { MoreHorizontal } from 'lucide-react';

import { useHeaderTabs } from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs-context';
import styles from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs.module.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@cbt-bo/component-lib/components/ui/dropdown-menu';

export interface IHeaderTabsActionsProps {
  /**
   * Accessible label for the menu trigger.
   */
  label: string;
  closeSelectedTabLabel: string;
  closeOtherTabsLabel: string;
}

/**
 * Menu at the end of the strip, exposed as `HeaderTabs.Actions`. Closes the active
 * tab or every other tab. Hidden while only one tab is open.
 */
const HeaderTabsActions = ({
  label,
  closeSelectedTabLabel,
  closeOtherTabsLabel
}: IHeaderTabsActionsProps) => {
  const { activeKey, isClosable, onClose, onCloseOthers } = useHeaderTabs();

  if (!isClosable) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className={styles.actions}
          data-slot="header-tabs-actions"
        >
          <MoreHorizontal />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            onClose(activeKey);
          }}
        >
          {closeSelectedTabLabel}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            onCloseOthers(activeKey);
          }}
        >
          {closeOtherTabsLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

HeaderTabsActions.displayName = 'HeaderTabs.Actions';

export default HeaderTabsActions;
