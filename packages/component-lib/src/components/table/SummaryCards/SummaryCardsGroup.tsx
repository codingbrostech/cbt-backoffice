import { Children, type ReactNode } from 'react';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISummaryCardsGroupProps {
  /**
   * The `SummaryCards.Card` parts that stay on one line together.
   */
  children: ReactNode;
  className?: string;
}

/**
 * Cards that stay on one line together, exposed as `SummaryCards.Group`.
 * Groups sharing a line give their cards the same width.
 */
const SummaryCardsGroup = ({ children, className }: ISummaryCardsGroupProps) => {
  const cardCount = Children.count(children);
  const gapCount = cardCount - 1;

  return (
    <div
      data-slot="summary-cards-group"
      className={cn('flex min-w-max gap-(--summary-cards-gap)', className)}
      style={{ flexGrow: cardCount, flexBasis: `calc(${gapCount} * var(--summary-cards-gap))` }}
    >
      {children}
    </div>
  );
};

export default SummaryCardsGroup;
