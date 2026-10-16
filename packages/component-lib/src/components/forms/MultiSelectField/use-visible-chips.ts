import { type RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';

export interface IUseVisibleChipsResult {
  /**
   * Attach to the single-line track that holds the shown chips, the badge and
   * the search box.
   */
  trackRef: RefObject<HTMLDivElement | null>;
  /**
   * Attach to the hidden row that renders every chip followed by the badge at
   * its widest.
   */
  measureRef: RefObject<HTMLDivElement | null>;
  /**
   * Chips from the start that fit on the track. Undefined until measured.
   */
  visibleCount?: number;
}

const parseLength = (value: string): number => Number.parseFloat(value) || 0;

/**
 * Chips from the start of `chipWidths` that fit in `available` pixels with
 * `gap` between them, keeping room for a badge of `badgeWidth` plus a gap
 * whenever a chip is left out. The last counted chip may fit only once
 * shrunk to `minChipWidth`.
 *
 * @example
 * buildVisibleChipCount([60, 60, 60], 30, 4, 150, 40); // 2, the second one shrunk
 */
export const buildVisibleChipCount = (
  chipWidths: readonly number[],
  badgeWidth: number,
  gap: number,
  available: number,
  minChipWidth: number
): number => {
  let usedWidth = 0;
  let visibleCount = 0;

  for (const [index, chipWidth] of chipWidths.entries()) {
    const hiddenAfter = chipWidths.length - index - 1;
    const reservedWidth = hiddenAfter > 0 ? badgeWidth + gap : 0;
    const leadingGap = visibleCount > 0 ? gap : 0;
    const neededWidth = usedWidth + leadingGap + chipWidth + reservedWidth;
    const shrunkWidth = Math.min(chipWidth, minChipWidth);
    const neededShrunkWidth = usedWidth + leadingGap + shrunkWidth + reservedWidth;
    const isShrunkFit = neededShrunkWidth <= available;

    if (neededWidth > available) {
      if (isShrunkFit) visibleCount += 1;
      break;
    }

    usedWidth += leadingGap + chipWidth;
    visibleCount += 1;
  }

  return visibleCount;
};

/**
 * Measures how many chips fit on the track beside a badge for the rest and
 * `reservedWidth` pixels kept free for the search box, the last one shrunk
 * to `minChipWidth` when that is what makes it fit. Measures after every
 * render, so a changed chip set shows right, and again whenever the track is
 * resized.
 *
 * @example
 * const { trackRef, measureRef, visibleCount = chips.length } = useVisibleChips(32, 48);
 */
export const useVisibleChips = (
  reservedWidth: number,
  minChipWidth: number
): IUseVisibleChipsResult => {
  const trackRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number>();

  const measure = useCallback(() => {
    const { current: track } = trackRef;
    const { current: row } = measureRef;
    if (!track || !row) return;

    const { columnGap } = getComputedStyle(track);
    const gap = parseLength(columnGap);
    const children = [...row.children];
    const badge = children.at(-1);
    const chips = children.slice(0, -1);
    const chipWidths = chips.map(chip => chip.getBoundingClientRect().width);
    const badgeWidth = badge?.getBoundingClientRect().width ?? 0;
    const available = track.clientWidth - reservedWidth - gap;

    setVisibleCount(buildVisibleChipCount(chipWidths, badgeWidth, gap, available, minChipWidth));
  }, [reservedWidth, minChipWidth]);

  useLayoutEffect(measure);

  useLayoutEffect(() => {
    const { current: track } = trackRef;
    if (!track) return undefined;

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => {
      observer.disconnect();
    };
  }, [measure]);

  return { trackRef, measureRef, visibleCount };
};
