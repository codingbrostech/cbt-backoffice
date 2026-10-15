import type { ReactNode } from 'react';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ICellPair {
  label: string;
  value: ReactNode;
}

export interface ICellPairsProps {
  /**
   * Rows of the cell in display order. A blank value renders as `-`.
   */
  pairs: ICellPair[];
  /**
   * Right-aligns the values as numbers, for amounts.
   */
  isNumeric?: boolean;
  className?: string;
}

const isBlankValue = (value: ReactNode): boolean =>
  value === undefined || value === null || value === '';

/**
 * Several related fields of one row stacked as label and value lines inside
 * a single table cell, such as the amounts or the times of a transaction.
 * The block is as wide as its widest line, up to the cell width.
 *
 * @example
 * <CellPairs pairs={[{ label: 'Bet', value: '10.00' }, { label: 'Payout', value: '20.00' }]} isNumeric />
 */
const CellPairs = ({ pairs, isNumeric = false, className }: ICellPairsProps) => (
  <dl
    data-slot="cell-pairs"
    className={cn(
      'grid w-fit grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-0.5 text-sm font-medium whitespace-nowrap',
      isNumeric && 'grid-cols-[auto_minmax(5rem,1fr)]',
      className
    )}
  >
    {pairs.map(({ label, value }) => (
      <div key={label} className="contents">
        <dt className="text-muted-foreground font-normal">{label}</dt>
        <dd
          className={cn(
            'whitespace-normal [overflow-wrap:anywhere]',
            isNumeric && 'text-right tabular-nums'
          )}
        >
          {isBlankValue(value) ? '-' : value}
        </dd>
      </div>
    ))}
  </dl>
);

export default CellPairs;
