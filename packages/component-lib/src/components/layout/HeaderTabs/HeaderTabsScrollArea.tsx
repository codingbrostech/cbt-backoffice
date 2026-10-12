import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { useHeaderTabs } from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs-context';
import styles from '@cbt-bo/component-lib/components/layout/HeaderTabs/header-tabs.module.css';

const TAB_SCROLL_STEP_PX = 200;

export interface IHeaderTabsScrollAreaProps {
  /**
   * The track's content, usually `HeaderTabs.List`.
   */
  children: ReactNode;
  scrollLeftLabel: string;
  scrollRightLabel: string;
}

/**
 * Scrollable track for the tabs, exposed as `HeaderTabs.ScrollArea`. Shows an arrow
 * button at each end once the tabs overflow, and the mouse wheel scrolls sideways.
 */
const HeaderTabsScrollArea = ({
  children,
  scrollLeftLabel,
  scrollRightLabel
}: IHeaderTabsScrollAreaProps) => {
  const { tabs } = useHeaderTabs();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollLeftVisible, setIsScrollLeftVisible] = useState(false);
  const [isScrollRightVisible, setIsScrollRightVisible] = useState(false);

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

    const resizeObserver = new ResizeObserver(updateScrollVisibility);
    resizeObserver.observe(node);
    node.addEventListener('scroll', updateScrollVisibility);
    node.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      resizeObserver.disconnect();
      node.removeEventListener('scroll', updateScrollVisibility);
      node.removeEventListener('wheel', handleWheel);
    };
  }, [updateScrollVisibility, handleWheel]);

  useEffect(() => {
    updateScrollVisibility();
  }, [tabs, updateScrollVisibility]);

  return (
    <>
      {isScrollLeftVisible && (
        <button
          type="button"
          aria-label={scrollLeftLabel}
          className={styles.scrollButton}
          data-slot="header-tabs-scroll-button"
          onClick={handleScrollLeft}
        >
          <ChevronLeft />
        </button>
      )}
      <TabsPrimitive.List ref={scrollRef} className={styles.track} data-slot="header-tabs-track">
        {children}
      </TabsPrimitive.List>
      {isScrollRightVisible && (
        <button
          type="button"
          aria-label={scrollRightLabel}
          className={styles.scrollButton}
          data-slot="header-tabs-scroll-button"
          onClick={handleScrollRight}
        >
          <ChevronRight />
        </button>
      )}
    </>
  );
};

HeaderTabsScrollArea.displayName = 'HeaderTabs.ScrollArea';

export default HeaderTabsScrollArea;
