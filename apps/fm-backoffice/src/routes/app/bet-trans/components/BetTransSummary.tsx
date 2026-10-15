import type { TWagerTxnSummary } from '@cbt-bo/api/wagertxn/queries';
import { SummaryCards } from '@cbt-bo/component-lib/components/table';
import { formatCount, formatMinorAmount } from '@cbt-bo/component-lib/lib/format';
import { useTranslation } from 'react-i18next';

export interface IBetTransSummaryProps {
  summary: TWagerTxnSummary;
  isLoading: boolean;
}

interface ISummaryCard {
  key: string;
  value: string;
}

const BetTransSummary = ({ summary, isLoading }: IBetTransSummaryProps) => {
  const { t } = useTranslation();
  const { total, totalBetAmt, totalPayoutAmt, totalWl, winCount, lossCount, tieCount } = summary;

  const totalCards = [
    { key: 'totalBetAmt', value: formatMinorAmount(totalBetAmt) },
    { key: 'totalPayoutAmt', value: formatMinorAmount(totalPayoutAmt) },
    { key: 'totalWl', value: formatMinorAmount(totalWl) },
    { key: 'total', value: formatCount(total) }
  ] as const satisfies readonly ISummaryCard[];
  const outcomeCards = [
    { key: 'winCount', value: formatCount(winCount) },
    { key: 'lossCount', value: formatCount(lossCount) },
    { key: 'tieCount', value: formatCount(tieCount) }
  ] as const satisfies readonly ISummaryCard[];

  const renderCard = ({ key, value }: ISummaryCard) => (
    <SummaryCards.Card
      key={key}
      label={t(`betTrans.summary.${key}`)}
      tooltip={t(`betTrans.summary.${key}Tooltip`)}
      value={value}
      isLoading={isLoading}
    />
  );

  return (
    <SummaryCards.Root>
      <SummaryCards.Group>{totalCards.map(renderCard)}</SummaryCards.Group>
      <SummaryCards.Group>{outcomeCards.map(renderCard)}</SummaryCards.Group>
    </SummaryCards.Root>
  );
};

export default BetTransSummary;
