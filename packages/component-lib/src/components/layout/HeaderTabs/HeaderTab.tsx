import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { Tabs as TabsPrimitive } from 'radix-ui';

import { useHeaderTabs } from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs-context';
import styles from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs.module.css';

export interface IHeaderTab {
  key: string;
  label: string;
}

export interface IHeaderTabProps {
  tab: IHeaderTab;
  closeTabLabel: string;
}

/**
 * One tab in the strip, rendered by `HeaderTabs.List` for each entry in `tabs`.
 * Pass the tab and the close button's label. The active state, whether it can
 * close or drag, and `onClose` come from the enclosing `HeaderTabs.Root`.
 */
const HeaderTab = ({ tab, closeTabLabel }: IHeaderTabProps) => {
  const { activeKey, isClosable, isDraggable, onClose } = useHeaderTabs();
  const { setNodeRef, listeners, transform, transition, isDragging } = useSortable({
    id: tab.key,
    disabled: !isDraggable
  });

  const isActive = tab.key === activeKey;
  const style = { transform: CSS.Translate.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.tab}
      data-slot="header-tab"
      data-active={isActive}
      data-closable={isClosable ? '' : undefined}
      data-draggable={isDraggable ? '' : undefined}
      data-dragging={isDragging ? '' : undefined}
      {...listeners}
    >
      <TabsPrimitive.Trigger
        value={tab.key}
        className={styles.trigger}
        data-slot="header-tab-trigger"
      >
        <span className={styles.label}>
          <span>{tab.label}</span>
          <span aria-hidden className={styles.labelGhost}>
            {tab.label}
          </span>
        </span>
      </TabsPrimitive.Trigger>
      {isClosable && (
        <button
          type="button"
          aria-label={closeTabLabel}
          className={styles.close}
          data-slot="header-tab-close"
          onClick={event => {
            event.stopPropagation();
            onClose(tab.key);
          }}
        >
          <X />
        </button>
      )}
    </div>
  );
};

HeaderTab.displayName = 'HeaderTab';

export default HeaderTab;
