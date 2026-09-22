/**
 * Copy of `items` with the element at `from` moved to `to`. Out-of-range
 * `from` indexes leave the order unchanged.
 */
export const moveItem = <TItem>(items: readonly TItem[], from: number, to: number): TItem[] => {
  const next = [...items];
  const [moved] = next.splice(from, 1);

  if (moved === undefined) return next;

  next.splice(to, 0, moved);

  return next;
};
