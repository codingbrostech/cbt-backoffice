import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { IHeaderTab } from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTab';
import HeaderTab from '@cbt-bo/component-lib/components/layout/HeaderTabs/HeaderTab';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@cbt-bo/component-lib/components/ui/dropdown-menu';
import { Tabs, TabsList } from '@cbt-bo/component-lib/components/ui/tabs';

export type { IHeaderTab };

const TAB_SCROLL_STEP_PX = 200;
const TAB_DRAG_START_DISTANCE_PX = 4;

export interface IHeaderTabsProps {
  tabs: IHeaderTab[];
  activeKey: string;
  onSelect: (key: string) => void;
  onClose: (key: string) => void;
  onCloseOthers: (key: string) => void;
  onMove: (key: string, targetKey: string) => void;
  isDraggable?: boolean;
  closeTabLabel: string;
  tabActionsLabel: string;
  closeSelectedTabLabel: string;
  closeOtherTabsLabel: string;
  scrollLeftLabel: string;
  scrollRightLabel: string;
}

/**
 * Browser-style tab strip for the pages open in the authenticated shell.
 * Controlled: the caller owns the open tabs, their order, the active key,
 * and navigation on select or close. A tab shows a close button, and the
 * strip shows a tab actions menu, only while more than one tab is open,
 * since the last remaining tab can't be closed. Dragging a tab at least
 * TAB_DRAG_START_DISTANCE_PX along the strip picks it up, and dropping it
 * over another tab calls `onMove` with both keys, unless `isDraggable` is
 * false. The strip scrolls
 * horizontally once the tabs overflow, with a left or right arrow button
 * appearing at each end while there's more to scroll in that direction. The
 * active label is bold, and every tab reserves the bold width so selecting
 * one doesn't shift the strip. The strip draws a single underline, and only
 * the active tab covers it.
 */
const HeaderTabs = ({
  tabs,
  activeKey,
  onSelect,
  onClose,
  onCloseOthers,
  onMove,
  isDraggable = true,
  closeTabLabel,
  tabActionsLabel,
  closeSelectedTabLabel,
  closeOtherTabsLabel,
  scrollLeftLabel,
  scrollRightLabel
}: IHeaderTabsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollLeftVisible, setIsScrollLeftVisible] = useState(false);
  const [isScrollRightVisible, setIsScrollRightVisible] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: TAB_DRAG_START_DISTANCE_PX } })
  );

  const isClosable = tabs.length > 1;
  const tabKeys = tabs.map(tab => tab.key);

  const updateScrollVisibility = useCallback(() => {
    const node = scrollRef.current;
    if (!node) return;

    setIsScrollLeftVisible(node.scrollLeft > 0);
    setIsScrollRightVisible(node.scrollLeft + node.clientWidth < node.scrollWidth - 1);
  }, []);

  const handleScrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -TAB_SCROLL_STEP_PX, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollRef.current?.scrollBy({ left: TAB_SCROLL_STEP_PX, behavior: 'smooth' });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || over.id === active.id) return;

    onMove(String(active.id), String(over.id));
  };

  const handleWheel = useCallback((event: WheelEvent) => {
    const node = scrollRef.current;
    if (!node || node.scrollWidth <= node.clientWidth) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    node.scrollBy({ left: event.deltaY });
  }, []);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    updateScrollVisibility();

    const resizeObserver = new ResizeObserver(updateScrollVisibility);
    resizeObserver.observe(node);
    node.addEventListener('scroll', updateScrollVisibility);
    node.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      resizeObserver.disconnect();
      node.removeEventListener('scroll', updateScrollVisibility);
      node.removeEventListener('wheel', handleWheel);
    };
  }, [tabs, updateScrollVisibility, handleWheel]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
    >
      <Tabs
        className="shrink-0"
        value={activeKey}
        onValueChange={value => {
          onSelect(value);
        }}
      >
        <div className="flex items-stretch shadow-[inset_0_-1px_0_var(--color-border)]">
          {isScrollLeftVisible && (
            <button
              type="button"
              aria-label={scrollLeftLabel}
              className="mb-px inline-flex h-[33px] w-7 shrink-0 cursor-pointer self-end items-center justify-center rounded-t-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground"
              onClick={handleScrollLeft}
            >
              <ChevronLeft className="size-4" />
            </button>
          )}
          <TabsList
            ref={scrollRef}
            variant="line"
            className="h-10! min-w-0 flex-1 flex-nowrap items-end justify-start gap-1.5 overflow-x-auto overflow-y-hidden rounded-none bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <SortableContext items={tabKeys} strategy={horizontalListSortingStrategy}>
              {tabs.map(tab => (
                <HeaderTab
                  key={tab.key}
                  tab={tab}
                  isActive={tab.key === activeKey}
                  isClosable={isClosable}
                  isDraggable={isDraggable}
                  closeTabLabel={closeTabLabel}
                  onClose={onClose}
                />
              ))}
            </SortableContext>
          </TabsList>
          {isScrollRightVisible && (
            <button
              type="button"
              aria-label={scrollRightLabel}
              className="mb-px inline-flex h-[33px] w-7 shrink-0 cursor-pointer self-end items-center justify-center rounded-t-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground"
              onClick={handleScrollRight}
            >
              <ChevronRight className="size-4" />
            </button>
          )}
          {isClosable && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={tabActionsLabel}
                  className="mb-px inline-flex h-[33px] w-8 shrink-0 cursor-pointer self-end items-center justify-center rounded-t-sm text-muted-foreground transition-colors duration-150 ease-out hover:bg-muted hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
                >
                  <MoreHorizontal className="size-4" />
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
          )}
        </div>
      </Tabs>
    </DndContext>
  );
};

export default HeaderTabs;
