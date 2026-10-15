import { type RefObject, useEffect, useRef, useState } from 'react';

import { findScrollContainer } from '@cbt-bo/component-lib/components/table/DataTable/find-scroll-container';

export interface IUseIsOverflowingXResult<TElement extends HTMLElement> {
  /**
   * Attach to the element whose width is compared with its scroll container's.
   */
  ref: RefObject<TElement | null>;
  /**
   * The element is wider than the content box of its nearest scroll
   * container, so that container scrolls sideways.
   */
  isOverflowing: boolean;
}

/**
 * Tells whether the referenced element is wider than the content box of its
 * nearest scroll container. Re-measures whenever either one is resized.
 *
 * @example
 * const { ref, isOverflowing } = useIsOverflowingX<HTMLTableElement>();
 */
export const useIsOverflowingX = <
  TElement extends HTMLElement
>(): IUseIsOverflowingXResult<TElement> => {
  const ref = useRef<TElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const { current: element } = ref;
    const container = findScrollContainer(element?.parentElement ?? null);
    if (!element || !container) return undefined;

    const measure = () => {
      const { paddingLeft, paddingRight } = getComputedStyle(container);
      const paddingWidth = Number.parseFloat(paddingLeft) + Number.parseFloat(paddingRight);
      const contentWidth = container.clientWidth - paddingWidth;

      setIsOverflowing(element.offsetWidth > contentWidth);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(container);
    measure();

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isOverflowing };
};
