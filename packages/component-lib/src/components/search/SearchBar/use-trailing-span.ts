import { type RefObject, useLayoutEffect, useRef, useState } from 'react';

export interface IUseTrailingSpanResult<TElement extends HTMLElement> {
  /**
   * Attach to a grid item whose children sit side by side.
   */
  ref: RefObject<TElement | null>;
  /**
   * Columns of the parent grid the children need side by side. Undefined
   * until measured, or when the parent is not a grid.
   */
  span?: number;
}

const parseLength = (value: string): number => Number.parseFloat(value) || 0;

/**
 * Columns of a grid with `trackWidths` and `trackGap` that children with
 * `childWidths` and `childGap` need side by side, between one and the track
 * count. Undefined when there is no track to measure against.
 *
 * @example
 * buildTrailingSpan([200, 200, 200, 200], 8, [170, 97, 88, 95], 8); // 3
 */
export const buildTrailingSpan = (
  trackWidths: readonly number[],
  trackGap: number,
  childWidths: readonly number[],
  childGap: number
): number | undefined => {
  const [trackWidth] = trackWidths;

  if (!trackWidth) return undefined;

  const childrenWidth = childWidths.reduce((total, width) => total + width, 0);
  const gapsWidth = childGap * Math.max(childWidths.length - 1, 0);
  const neededWidth = childrenWidth + gapsWidth;
  const span = Math.ceil((neededWidth + trackGap) / (trackWidth + trackGap));

  return Math.min(Math.max(span, 1), trackWidths.length);
};

/**
 * Measures how many columns of its parent grid the referenced element needs
 * to keep its children side by side. Re-measures whenever the grid or a child
 * is resized.
 *
 * @example
 * const { ref, span } = useTrailingSpan<HTMLDivElement>();
 * <div ref={ref} style={span ? { gridColumn: `span ${span} / -1` } : undefined} />
 */
export const useTrailingSpan = <
  TElement extends HTMLElement
>(): IUseTrailingSpanResult<TElement> => {
  const ref = useRef<TElement>(null);
  const [span, setSpan] = useState<number>();

  useLayoutEffect(() => {
    const { current: element } = ref;
    const grid = element?.parentElement;
    if (!element || !grid) return undefined;

    const children = [...element.children];

    const measure = () => {
      const { gridTemplateColumns, columnGap: trackGap } = getComputedStyle(grid);
      const { columnGap: childGap } = getComputedStyle(element);
      const trackWidths = gridTemplateColumns.split(' ').map(parseLength);
      const childWidths = children.map(child => child.getBoundingClientRect().width);

      setSpan(
        buildTrailingSpan(trackWidths, parseLength(trackGap), childWidths, parseLength(childGap))
      );
    };

    const observer = new ResizeObserver(measure);
    observer.observe(grid);
    children.forEach(child => {
      observer.observe(child);
    });
    measure();

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, span };
};
