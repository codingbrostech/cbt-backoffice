import type { ReactNode } from 'react';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISummaryCardsRootProps {
  /**
   * The `SummaryCards.Group` parts in display order.
   */
  children: ReactNode;
  className?: string;
}

/**
 * Row of card groups, exposed as `SummaryCards.Root`. A group that no longer
 * fits wraps onto the next line as a whole, and `--summary-cards-gap` sets
 * the space between cards.
 */
const SummaryCardsRoot = ({ children, className }: ISummaryCardsRootProps) => (
  <section
    data-slot="summary-cards"
    className={cn(
      'flex flex-wrap gap-(--summary-cards-gap) [--summary-cards-gap:calc(var(--spacing)*2)]',
      className
    )}
  >
    {children}
  </section>
);

export default SummaryCardsRoot;
