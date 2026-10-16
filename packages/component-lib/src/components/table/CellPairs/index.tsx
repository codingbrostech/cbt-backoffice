import type { ReactNode } from 'react';

import TruncatedText from '@cbt-bo/component-lib/components/table/TruncatedText';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export type TCellPairsColumns = 1 | 2;

export interface ICellPair {
  label: string;
  value: ReactNode;
  /**
   * Renders the label and the value in the small text size, for a field of
   * lesser weight.
   */
  isSecondary?: boolean;
}

export interface ICellPairsProps {
  /**
   * Fields of the cell in display order, filled row by row. A blank value
   * renders as `-`.
   */
  pairs: ICellPair[];
  /**
   * Pairs laid side by side on each row. Defaults to 1. With 2, the block
   * spans its container and the two value columns share the width left by
   * the labels equally, so the labels line up across rows.
   */
  columns?: TCellPairsColumns;
  /**
   * Right-aligns the values as numbers, for amounts.
   */
  isNumeric?: boolean;
  /**
   * Cuts each string value to one line with an ellipsis, with the full text
   * in a tooltip while it is cut. Needs a Radix `TooltipProvider` above.
   */
  isTruncated?: boolean;
  className?: string;
}

const WIDTH_CLASS_NAMES = {
  1: 'w-fit',
  2: 'w-full'
} as const satisfies Record<TCellPairsColumns, string>;

const GRID_CLASS_NAMES = {
  1: 'grid-cols-[auto_minmax(0,1fr)]',
  2: 'grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]'
} as const satisfies Record<TCellPairsColumns, string>;

const NUMERIC_GRID_CLASS_NAMES = {
  1: 'grid-cols-[auto_minmax(5rem,1fr)]',
  2: 'grid-cols-[auto_minmax(5rem,1fr)_auto_minmax(5rem,1fr)]'
} as const satisfies Record<TCellPairsColumns, string>;

const isBlankValue = (value: ReactNode): boolean =>
  value === undefined || value === null || value === '';

const buildValueContent = (value: ReactNode, isTruncated: boolean): ReactNode => {
  if (isBlankValue(value)) return '-';

  return isTruncated && typeof value === 'string' ? <TruncatedText text={value} /> : value;
};

/**
 * Several related fields of one row stacked as label and value lines inside
 * a single table cell, such as the amounts or the times of a transaction.
 * With one column the block is as wide as its widest line, up to the cell
 * width. With two columns it spans the cell.
 *
 * @example
 * <CellPairs pairs={[{ label: 'Bet', value: '10.00' }, { label: 'Payout', value: '20.00' }]} isNumeric />
 */
const CellPairs = ({
  pairs,
  columns = 1,
  isNumeric = false,
  isTruncated = false,
  className
}: ICellPairsProps) => {
  const widthClassName = WIDTH_CLASS_NAMES[columns];
  const gridClassName = isNumeric ? NUMERIC_GRID_CLASS_NAMES[columns] : GRID_CLASS_NAMES[columns];

  return (
    <dl
      data-slot="cell-pairs"
      className={cn(
        'grid items-center gap-x-3 gap-y-0.5 text-sm font-medium whitespace-nowrap',
        widthClassName,
        gridClassName,
        className
      )}
    >
      {pairs.map(({ label, value, isSecondary = false }, index) => {
        const isRowContinuation = index % columns > 0;
        const content = buildValueContent(value, isTruncated);

        return (
          <div key={label} className="contents">
            <dt
              className={cn(
                'text-muted-foreground font-normal',
                isRowContinuation && 'ps-3',
                isSecondary && 'text-xs'
              )}
            >
              {label}
            </dt>
            <dd
              className={cn(
                'whitespace-normal [overflow-wrap:anywhere]',
                isNumeric && 'text-right tabular-nums',
                isSecondary && 'text-xs'
              )}
            >
              {content}
            </dd>
          </div>
        );
      })}
    </dl>
  );
};

export default CellPairs;
