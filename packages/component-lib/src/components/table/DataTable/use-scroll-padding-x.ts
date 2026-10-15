import { type RefObject, useEffect, useState } from 'react';

import { findScrollContainer } from '@cbt-bo/component-lib/components/table/DataTable/find-scroll-container';
import type { TScrollPaddingX } from '@cbt-bo/component-lib/components/table/DataTable/list-table';

const EMPTY_SCROLL_PADDING = { start: 0, end: 0 } as const satisfies TScrollPaddingX;

/**
 * Inline padding of the nearest scroll container above the referenced
 * element. Re-measures whenever that container is resized.
 *
 * @example
 * const scrollPadding = useScrollPaddingX(tableRef);
 */
export const useScrollPaddingX = (ref: RefObject<HTMLElement | null>): TScrollPaddingX => {
  const [scrollPadding, setScrollPadding] = useState<TScrollPaddingX>(EMPTY_SCROLL_PADDING);

  useEffect(() => {
    const container = findScrollContainer(ref.current?.parentElement ?? null);
    if (!container) return undefined;

    const measure = () => {
      const { paddingLeft, paddingRight } = getComputedStyle(container);

      setScrollPadding({
        start: Number.parseFloat(paddingLeft),
        end: Number.parseFloat(paddingRight)
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    measure();

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return scrollPadding;
};
