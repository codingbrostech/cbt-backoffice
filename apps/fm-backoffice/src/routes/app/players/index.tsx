import { PLAYER_EDITABLE_STATES, PLAYER_STATES } from '@cbt-bo/api/player/queries';
import { PLAYER_KYC_STATES } from '@cbt-bo/api/player-kyc/queries';
import { buildLabelNameById, playerLabelListQueryOptions } from '@cbt-bo/api/player-label/queries';
import { usePreferencesStore } from '@cbt-bo/api/preferences/store';
import type { PlayerLabelResult, PlayerListResultItem } from '@cbt-bo/api-schema/bo/models';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms';
import { Page } from '@cbt-bo/component-lib/components/layout';
import { SearchBar } from '@cbt-bo/component-lib/components/search';
import { DataTable, type TColumnPinning } from '@cbt-bo/component-lib/components/table';
import { TIME_RANGE_MAX_THREE_MONTHS } from '@cbt-bo/component-lib/lib/date-range';
import { buildOptions } from '@cbt-bo/component-lib/lib/options';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import PlayerSearchFields from '#/components/search/PlayerSearchFields';
import { useDateRangeLabels } from '#/hooks/use-date-range-labels';
import { usePagePermission } from '#/hooks/use-page-permission';
import { useTableLabels } from '#/hooks/use-table-labels';
import { buildPlayerColumns } from '#/routes/app/players/columns';
import PlayerKycStateConfirmDialog, {
  type IPlayerKycStateChange
} from '#/routes/app/players/components/PlayerKycStateConfirmDialog';
import PlayerStateConfirmDialog, {
  type IPlayerStateChange
} from '#/routes/app/players/components/PlayerStateConfirmDialog';
import { DEFAULT_PLAYERS_FILTER, usePlayerList } from '#/routes/app/players/hooks/use-player-list';

const buildLabelOptions = (labels: PlayerLabelResult[]): ISelectOption[] =>
  labels.flatMap(({ id, name }) => (id ? [{ value: id, label: name ?? id }] : []));

const PlayersPage = () => {
  const { t } = useTranslation();
  const timezoneMinutes = usePreferencesStore(state => state.timezoneMinutes);
  const [columnPinning, setColumnPinning] = useState<TColumnPinning>({});
  const [stateChange, setStateChange] = useState<IPlayerStateChange>();
  const [kycStateChange, setKycStateChange] = useState<IPlayerKycStateChange>();
  const [isStateDialogOpen, setIsStateDialogOpen] = useState(false);
  const [isKycStateDialogOpen, setIsKycStateDialogOpen] = useState(false);
  const { filter, pageParams, rows, total, isFetching, isError, search, setPageParams } =
    usePlayerList();
  const { data: labels = [] } = useQuery(playerLabelListQueryOptions());
  const tableLabels = useTableLabels();
  const dateRangeLabels = useDateRangeLabels();
  const { isUpdateAllowed } = usePagePermission();

  const stateOptions = buildOptions(PLAYER_STATES, state => t(`state.${state}`));
  const editableStateOptions = buildOptions(PLAYER_EDITABLE_STATES, state => t(`state.${state}`));
  const kycStateOptions = buildOptions(PLAYER_KYC_STATES, state =>
    t(`players.kycStateOption.${state}`)
  );
  const labelOptions = buildLabelOptions(labels);
  const labelNameById = buildLabelNameById(labels);

  const openStateDialog = (player: PlayerListResultItem, state: string) => {
    setStateChange({ player, state });
    setIsStateDialogOpen(true);
  };

  const openKycStateDialog = (player: PlayerListResultItem, kycState: string) => {
    setKycStateChange({ player, kycState });
    setIsKycStateDialogOpen(true);
  };

  const columns = buildPlayerColumns(t, {
    timezoneMinutes,
    labelNameById,
    stateOptions: editableStateOptions,
    kycStateOptions,
    isUpdateAllowed,
    onStateChange: openStateDialog,
    onKycStateChange: openKycStateDialog
  });

  return (
    <Page.Root isPageScroll>
      <Page.Header>
        <SearchBar.Root defaultValues={DEFAULT_PLAYERS_FILTER} values={filter} onSubmit={search}>
          <SearchBar.Header title={t('nav.players')} />
          <SearchBar.Fields>
            <PlayerSearchFields />
            <SearchBar.TextField name="email" label={t('players.email')} />
            <SearchBar.TextField name="firstName" label={t('players.firstName')} />
            <SearchBar.TextField name="lastName" label={t('players.lastName')} />
            <SearchBar.TextField name="applicantId" label={t('players.applicantId')} />
            <SearchBar.SelectField
              name="state"
              label={t('players.playerState')}
              options={stateOptions}
              allLabel={t('common.all')}
              noResultsLabel={t('common.noResultFound')}
            />
            <SearchBar.SelectField
              name="kycStatus"
              label={t('players.kycState')}
              options={kycStateOptions}
              allLabel={t('common.all')}
              noResultsLabel={t('common.noResultFound')}
            />
            <SearchBar.MultiSelectField
              name="labelIds"
              label={t('players.labels')}
              options={labelOptions}
              removeLabel={t('common.remove')}
              span={2}
              maxChips={3}
              allLabel={t('common.all')}
              noResultsLabel={t('common.noResultFound')}
              formatHiddenCount={count => t('common.more', { count })}
            />
            <SearchBar.DateRangeField
              fromName="timeFrom"
              toName="timeTo"
              label={t('players.crtTime')}
              timezoneMinutes={timezoneMinutes}
              labels={dateRangeLabels}
              maxMonths={TIME_RANGE_MAX_THREE_MONTHS}
            />
            <SearchBar.Actions
              resetLabel={t('common.reset')}
              submitLabel={t('common.search')}
              isLoading={isFetching}
            />
          </SearchBar.Fields>
        </SearchBar.Root>
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
      <PlayerStateConfirmDialog
        isOpen={isStateDialogOpen}
        change={stateChange}
        onOpenChange={setIsStateDialogOpen}
      />
      <PlayerKycStateConfirmDialog
        isOpen={isKycStateDialogOpen}
        change={kycStateChange}
        onOpenChange={setIsKycStateDialogOpen}
      />
    </Page.Root>
  );
};

export default PlayersPage;
