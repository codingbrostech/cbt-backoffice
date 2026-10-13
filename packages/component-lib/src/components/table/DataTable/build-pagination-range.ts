export type TPaginationRangeItem = number | 'ellipsis';

const WINDOW_SIZE = 5;

/**
 * Page numbers to offer around `page`, at most WINDOW_SIZE of them, with an
 * `'ellipsis'` marker on each side that still has pages beyond the window.
 */
export const buildPaginationRange = (page: number, pageCount: number): TPaginationRangeItem[] => {
  if (pageCount <= 0) return [];
  if (pageCount <= WINDOW_SIZE) return Array.from({ length: pageCount }, (_, index) => index + 1);

  const half = Math.floor(WINDOW_SIZE / 2);
  const start = Math.max(1, Math.min(page - half, pageCount - WINDOW_SIZE + 1));
  const end = start + WINDOW_SIZE - 1;

  const pages = Array.from({ length: WINDOW_SIZE }, (_, index) => start + index);
  const leading: TPaginationRangeItem[] = start > 1 ? ['ellipsis'] : [];
  const trailing: TPaginationRangeItem[] = end < pageCount ? ['ellipsis'] : [];

  return [...leading, ...pages, ...trailing];
};
