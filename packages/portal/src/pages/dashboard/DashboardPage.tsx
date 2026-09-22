import type { OperationalStat, OperationalStatResult } from '@cbt-bo/api-schema/bo-fm/models';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import ProtectedPage from '~/components/ProtectedPage';
import AppContentTabsToolbar from '~/layouts/AppContentTabsToolbar';
import { operationalStatsQueryOptions } from '~/queries/operational-stats';
import DataTable from '~/table/DataTable';
import { buildColumnDefs } from '~/table/build-column-defs';
import { useStaticTable } from '~/table/use-static-table';
import { toCurrency } from '~/utils/number';

type TStatPeriod = keyof OperationalStatResult;

interface IStatRow extends OperationalStat {
  title: TStatPeriod;
}

const STAT_PERIODS = [
  'today',
  'yesterday',
  'week',
  'month'
] as const satisfies readonly TStatPeriod[];

const COLUMNS_ORDER = [
  'title',
  'registerUsersCnt',
  'firstDepositAmt',
  'firstDepositUserCnt',
  'secondDepositAmt',
  'secondDepositUserCnt',
  'thirdDepositAmt',
  'thirdDepositUserCnt',
  'totalDepositAmt',
  'totalDepositUserCnt',
  'totalWithdrawalAmt',
  'totalWithdrawalUserCnt',
  'totalWithdrawalCnt',
  'income'
] as const satisfies readonly (keyof IStatRow)[];

const CURRENCY_FIELDS = [
  'income',
  'firstDepositAmt',
  'secondDepositAmt',
  'thirdDepositAmt',
  'totalDepositAmt',
  'totalWithdrawalAmt'
] as const satisfies readonly (keyof IStatRow)[];

const buildStatRows = (result?: OperationalStatResult): IStatRow[] =>
  STAT_PERIODS.map(period => ({ title: period, ...result?.[period] }));

const buildStatColumns = () =>
  buildColumnDefs<IStatRow>({
    modelName: 'operationalStats',
    columnsOrder: [...COLUMNS_ORDER],
    fieldOptions: {
      title: { formatterType: 'map', formatterOptions: { fieldMapName: 'statTitleType' } },
      ...Object.fromEntries(CURRENCY_FIELDS.map(field => [field, { formatterType: 'currency' }])),
      registerUsersCnt: { formatterOptions: { defaultValue: '0' } },
      firstDepositUserCnt: { formatterOptions: { defaultValue: '0' } },
      secondDepositUserCnt: { formatterOptions: { defaultValue: '0' } },
      thirdDepositUserCnt: { formatterOptions: { defaultValue: '0' } },
      totalDepositUserCnt: { formatterOptions: { defaultValue: '0' } },
      totalWithdrawalUserCnt: { formatterOptions: { defaultValue: '0' } },
      totalWithdrawalCnt: { formatterOptions: { defaultValue: '0' } }
    }
  });

const buildAmountPerUser = (amount = 0, userCount = 0): string =>
  `${toCurrency(amount)}/${userCount}`;

const StatItem = ({ label, value }: { label: string; value: string | number }) => (
  <div className="rounded-md border bg-card p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 font-heading text-lg font-bold tabular-nums">{value}</p>
  </div>
);

const DashboardPage = () => {
  const { t } = useTranslation();
  const { data, isFetching, refetch } = useQuery(operationalStatsQueryOptions());

  const { today = {} } = data ?? {};
  const rows = useMemo(() => buildStatRows(data), [data]);
  const columns = useMemo(() => buildStatColumns(), []);
  const table = useStaticTable({ columns, data: rows });

  return (
    <ProtectedPage title="nav.home">
      <section>
        <h2 className="text-lg font-bold">{t('operationalStats.todayStats.title')}</h2>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatItem
            label={t('operationalStats.todayStats.income')}
            value={toCurrency(today.income ?? 0)}
          />
          <StatItem
            label={t('operationalStats.todayStats.registerUsers')}
            value={today.registerUsersCnt ?? 0}
          />
          <StatItem
            label={t('operationalStats.todayStats.firstDeposit')}
            value={buildAmountPerUser(today.firstDepositAmt, today.firstDepositUserCnt)}
          />
          <StatItem
            label={t('operationalStats.todayStats.secondDeposit')}
            value={buildAmountPerUser(today.secondDepositAmt, today.secondDepositUserCnt)}
          />
          <StatItem
            label={t('operationalStats.todayStats.thirdDeposit')}
            value={buildAmountPerUser(today.thirdDepositAmt, today.thirdDepositUserCnt)}
          />
          <StatItem
            label={t('operationalStats.todayStats.depositAmt')}
            value={buildAmountPerUser(today.totalDepositAmt, today.totalDepositUserCnt)}
          />
          <StatItem
            label={t('operationalStats.todayStats.withdrawalAmt')}
            value={buildAmountPerUser(today.totalWithdrawalAmt, today.totalWithdrawalCnt)}
          />
        </div>
      </section>
      <section>
        <h2 className="mb-2 text-lg font-bold">{t('operationalStats.recentStats')}</h2>
        <DataTable table={table} isLoading={isFetching} isPaginated={false} />
      </section>
      <AppContentTabsToolbar
        onRefresh={() => {
          void refetch();
        }}
      />
    </ProtectedPage>
  );
};

export default DashboardPage;
