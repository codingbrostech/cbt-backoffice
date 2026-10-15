import { type RefObject, useEffect, useRef, useState } from 'react';

import type { TColumnWidths } from '@cbt-bo/component-lib/components/table/DataTable/list-table';

export interface IUseColumnWidthsResult<TElement extends HTMLElement> {
  /**
   * Attach to the header row whose cells carry a `data-column-key`.
   */
  ref: RefObject<TElement | null>;
  widths: TColumnWidths;
}

/**
 * Measures every `data-column-key` cell inside the referenced row, keyed by
 * that attribute. Re-measures whenever a cell is resized or `columnKeys`
 * changes.
 *
 * @example
 * const { ref, widths } = useColumnWidths<HTMLTableRowElement>(columnKeys);
 */
export const useColumnWidths = <TElement extends HTMLElement>(
  columnKeys: readonly string[]
): IUseColumnWidthsResult<TElement> => {
  const ref = useRef<TElement>(null);
  const [widths, setWidths] = useState<TColumnWidths>({});

  const columnKeysSignature = columnKeys.join('\n');

  useEffect(() => {
    const { current: row } = ref;
    if (!row) return undefined;

    const cells = [...row.querySelectorAll<HTMLElement>('[data-column-key]')];

    const measure = () => {
      const entries = cells.map(cell => [cell.dataset.columnKey ?? '', cell.offsetWidth] as const);

      setWidths(Object.fromEntries(entries));
    };

    const observer = new ResizeObserver(measure);
    cells.forEach(cell => {
      observer.observe(cell);
    });
    measure();

    return () => {
      observer.disconnect();
    };
  }, [columnKeysSignature]);

  return { ref, widths };
};
