import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { Tabs as TabsPrimitive } from 'radix-ui';
import type { ReactNode } from 'react';

import type { IHeaderTab } from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTab';
import { HeaderTabsContext } from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs-context';
import styles from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs.module.css';
import { cn } from '@cbt-bo/component-lib/lib/utils';

const TAB_DRAG_START_DISTANCE_PX = 4;

export interface IHeaderTabsRootProps {
  tabs: IHeaderTab[];
  activeKey: string;
  onSelect: (key: string) => void;
  onClose: (key: string) => void;
  onCloseOthers: (key: string) => void;
  onMove: (key: string, targetKey: string) => void;
  isDraggable?: boolean;
  /**
   * The strip's parts, usually `HeaderTabs.ScrollArea` wrapping
   * `HeaderTabs.List`, then `HeaderTabs.Actions`.
   */
  children: ReactNode;
  className?: string;
}

/**
 * Root of the browser-style tab strip, exposed as `HeaderTabs.Root`. Takes the open
 * tabs, the active key and the handlers, and shares them with its parts through context.
 *
 * @example
 * <HeaderTabs.Root
 *   tabs={tabs}
 *   activeKey={key}
 *   onSelect={select}
 *   onClose={close}
 *   onCloseOthers={closeOthers}
 *   onMove={move}
 * >
 *   <HeaderTabs.ScrollArea scrollLeftLabel="Left" scrollRightLabel="Right">
 *     <HeaderTabs.List closeTabLabel="Close tab" />
 *   </HeaderTabs.ScrollArea>
 * </HeaderTabs.Root>
 */
const HeaderTabsRoot = ({
  tabs,
  activeKey,
  onSelect,
  onClose,
  onCloseOthers,
  onMove,
  isDraggable = true,
  children,
  className
}: IHeaderTabsRootProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: TAB_DRAG_START_DISTANCE_PX } })
  );

  const isClosable = tabs.length > 1;
  const context = { tabs, activeKey, isClosable, isDraggable, onClose, onCloseOthers };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || over.id === active.id) return;

    onMove(String(active.id), String(over.id));
  };

  return (
    <HeaderTabsContext value={context}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
      >
        <TabsPrimitive.Root
          className={cn(styles.root, className)}
          data-slot="header-tabs"
          value={activeKey}
          onValueChange={onSelect}
        >
          {children}
        </TabsPrimitive.Root>
      </DndContext>
    </HeaderTabsContext>
  );
};

HeaderTabsRoot.displayName = 'HeaderTabs.Root';

export default HeaderTabsRoot;
