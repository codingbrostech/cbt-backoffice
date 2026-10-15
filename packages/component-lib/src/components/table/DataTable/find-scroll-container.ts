const SCROLLING_OVERFLOWS = ['auto', 'scroll', 'hidden'] as const satisfies readonly string[];

/**
 * The given element or its nearest ancestor that clips or scrolls its
 * content sideways. Absent when nothing up the tree does.
 */
export const findScrollContainer = (element: HTMLElement | null): HTMLElement | undefined => {
  if (!element) return undefined;

  const { overflowX } = getComputedStyle(element);
  const isScrollContainer = SCROLLING_OVERFLOWS.some(overflow => overflow === overflowX);

  return isScrollContainer ? element : findScrollContainer(element.parentElement);
};
