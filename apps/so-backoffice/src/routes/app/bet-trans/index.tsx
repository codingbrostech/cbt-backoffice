import { usePermission } from '@cbt-bo/api/auth/permission';
import { EXPORT_PERMISSION_PAGE_KEY } from '@cbt-bo/api/export-job/queries';
import { gameTypeListQueryOptions } from '@cbt-bo/api/game/queries';
import { usePreferencesStore } from '@cbt-bo/api/preferences/store';
import { WAGER_TXN_BET_STATES, WAGER_TXN_TYPES } from '@cbt-bo/api/wagertxn/queries';
import { Page } from '@cbt-bo/component-lib/components/layout';
import { SearchBar } from '@cbt-bo/component-lib/components/search';
import {
  DataTable,
  ETableView,
  TABLE_VIEWS,
  type TColumnPinning
} from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { Spinner } from '@cbt-bo/component-lib/components/ui/spinner';
import { buildOptions } from '@cbt-bo/component-lib/lib/options';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PlayerSearchFields from '#/components/search/PlayerSearchFields';
import ProviderGameSelect, { EProviderGameField } from '#/components/search/ProviderGameSelect';
import { useDateRangeLabels } from '#/hooks/use-date-range-labels';
import { useTableLabels } from '#/hooks/use-table-labels';
import { buildBetTransColumns } from '#/routes/app/bet-trans/columns';
import BetTransSummary from '#/routes/app/bet-trans/components/BetTransSummary';
import { useBetTransList } from '#/routes/app/bet-trans/hooks/use-bet-trans-list';

const BetTransPage = () => {
  const { t } = useTranslation();
  const timezoneMinutes = usePreferencesStore(state => state.timezoneMinutes);
  const [columnPinning, setColumnPinning] = useState<TColumnPinning>({});
  const [view, setView] = useState(ETableView.SIMPLE);
  const {
    defaultFilter,
    filter,
    pageParams,
    rows,
    total,
    summary,
    isFetching,
    isSummaryFetching,
    isError,
    isExporting,
    search,
    setPageParams,
    exportList
  } = useBetTransList();
  const { data: gameTypes = [] } = useQuery(gameTypeListQueryOptions());
  const tableLabels = useTableLabels();
  const dateRangeLabels = useDateRangeLabels();
  const { isCreateAllowed: isExportAllowed } = usePermission(EXPORT_PERMISSION_PAGE_KEY);

  const betStateOptions = buildOptions(WAGER_TXN_BET_STATES, state =>
    t(`betTrans.betStateOption.${state}`)
  );
  const txnTypeOptions = buildOptions(WAGER_TXN_TYPES, type => t(`betTrans.txnTypeOption.${type}`));
  const gameTypeOptions = buildOptions(gameTypes);
  const viewOptions = buildOptions(TABLE_VIEWS, value => t(`common.viewOption.${value}`));
  const columns = buildBetTransColumns(t, timezoneMinutes, view);
  const isSearching = isFetching || isSummaryFetching;

  return (
    <Page.Root isPageScroll>
      <Page.Header>
        <SearchBar.Root defaultValues={defaultFilter} values={filter} onSubmit={search}>
          <SearchBar.Header title={t('nav.betTrans')} />
          <SearchBar.Fields>
            <PlayerSearchFields />
            <SearchBar.SelectField
              name="betState"
              label={t('betTrans.betState')}
              options={betStateOptions}
              allLabel={t('common.all')}
            />
            <SearchBar.SelectField
              name="txnType"
              label={t('betTrans.txnType')}
              options={txnTypeOptions}
              allLabel={t('common.all')}
            />
            <ProviderGameSelect only={EProviderGameField.PROVIDER} />
            <SearchBar.TextField name="gameId" label={t('betTrans.gameId')} />
            <SearchBar.SelectField
              name="gameType"
              label={t('betTrans.gameType')}
              options={gameTypeOptions}
              allLabel={t('common.all')}
            />
            <SearchBar.TextField name="extRoundId" label={t('betTrans.extRoundId')} />
            <SearchBar.TextField name="extTxnId" label={t('betTrans.extTxnId')} />
            <SearchBar.DateRangeField
              fromName="timeFrom"
              toName="timeTo"
              label={t('betTrans.betTime')}
              timezoneMinutes={timezoneMinutes}
              labels={dateRangeLabels}
            />
            <SearchBar.Actions
              resetLabel={t('common.reset')}
              submitLabel={t('common.search')}
              isLoading={isSearching}
            >
              <SearchBar.ViewToggle
                label={t('common.view')}
                value={view}
                options={viewOptions}
                onValueChange={setView}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!isExportAllowed || isExporting}
                onClick={exportList}
              >
                {isExporting && <Spinner />}
                {t('common.export')}
              </Button>
            </SearchBar.Actions>
          </SearchBar.Fields>
        </SearchBar.Root>
        <BetTransSummary summary={summary} isLoading={isSummaryFetching} />
      </Page.Header>
      <DataTable.Root
        columns={columns}
        data={rows}
        total={total}
        labels={tableLabels}
        params={pageParams}
        onParamsChange={setPageParams}
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
        isLoading={isFetching}
        isError={isError}
        isPageScroll
      >
        <DataTable.Grid />
        <DataTable.Pagination />
      </DataTable.Root>
    </Page.Root>
  );
};

export default BetTransPage;
