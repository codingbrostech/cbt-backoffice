import SummaryCardsCard from '@cbt-bo/component-lib/components/table/SummaryCards/SummaryCardsCard';
import SummaryCardsGroup from '@cbt-bo/component-lib/components/table/SummaryCards/SummaryCardsGroup';
import SummaryCardsRoot from '@cbt-bo/component-lib/components/table/SummaryCards/SummaryCardsRoot';

export type { ISummaryCardsCardProps } from '@cbt-bo/component-lib/components/table/SummaryCards/SummaryCardsCard';
export type { ISummaryCardsGroupProps } from '@cbt-bo/component-lib/components/table/SummaryCards/SummaryCardsGroup';
export type { ISummaryCardsRootProps } from '@cbt-bo/component-lib/components/table/SummaryCards/SummaryCardsRoot';

/**
 * Compound row of total cards above a list, such as the sums of a filtered
 * report. Each `Group` stays on one line, and groups wrap as a whole when the
 * row cannot fit every value in full.
 *
 * @example
 * <SummaryCards.Root>
 *   <SummaryCards.Group>
 *     <SummaryCards.Card label="Total Bet" value="1,000.00" tooltip="Sum of bet amounts." />
 *     <SummaryCards.Card label="Total Payout" value="900.00" />
 *   </SummaryCards.Group>
 *   <SummaryCards.Group>
 *     <SummaryCards.Card label="Win Count" value="12" />
 *   </SummaryCards.Group>
 * </SummaryCards.Root>
 */
const SummaryCards = {
  Root: SummaryCardsRoot,
  Group: SummaryCardsGroup,
  Card: SummaryCardsCard
};

export default SummaryCards;
