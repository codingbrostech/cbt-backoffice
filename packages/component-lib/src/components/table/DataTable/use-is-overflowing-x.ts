import { type RefObject, useEffect, useRef, useState } from 'react';

export interface IUseIsOverflowingXResult<TElement extends HTMLElement> {
  /**
   * Attach to the element whose width is compared with its parent's.
   */
  ref: RefObject<TElement | null>;
  /**
   * The element is wider than its parent, so the parent scrolls sideways.
   */
  isOverflowing: boolean;
}

/**
 * Tells whether the referenced element is wider than its parent. Re-measures
 * whenever either one is resized.
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
    const parent = element?.parentElement;
    if (!element || !parent) return undefined;

    const measure = () => {
      setIsOverflowing(element.offsetWidth > parent.clientWidth);
    };

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(parent);
    measure();

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, isOverflowing };
};
