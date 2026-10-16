import { ACTIVATION_STATES } from '@cbt-bo/api/common/constants';
import { DEFAULT_GAME_PROVIDER_LIST_FILTER } from '@cbt-bo/api/game-provider/queries';
import type { GameProviderResult } from '@cbt-bo/api-schema/bo/models';
import { Page } from '@cbt-bo/component-lib/components/layout';
import { SearchBar } from '@cbt-bo/component-lib/components/search';
import { DataTable, type TColumnPinning } from '@cbt-bo/component-lib/components/table';
import { buildOptions } from '@cbt-bo/component-lib/lib/options';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePagePermission } from '#/hooks/use-page-permission';
import { useTableLabels } from '#/hooks/use-table-labels';
import { buildGameProviderColumns } from '#/routes/app/game-providers/columns';
import ProviderStaffTestDialog from '#/routes/app/game-providers/components/ProviderStaffTestDialog';
import RetryLogoutDialog from '#/routes/app/game-providers/components/RetryLogoutDialog';
import { useGameProviderList } from '#/routes/app/game-providers/hooks/use-game-provider-list';

const GameProvidersPage = () => {
  const { t } = useTranslation();
  const [isStaffTestDialogOpen, setIsStaffTestDialogOpen] = useState(false);
  const [isRetryLogoutDialogOpen, setIsRetryLogoutDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<GameProviderResult>();
  const [columnPinning, setColumnPinning] = useState<TColumnPinning>({});
  const { filter, pageParams, rows, total, isFetching, isError, search, setPageParams } =
    useGameProviderList();
  const tableLabels = useTableLabels();
  const { isUpdateAllowed } = usePagePermission();

  const stateOptions = buildOptions(ACTIVATION_STATES, state => t(`state.${state}`));

  const openStaffTestEdit = (provider: GameProviderResult) => {
    setEditingProvider(provider);
    setIsStaffTestDialogOpen(true);
  };

  const openRetryLogout = (provider: GameProviderResult) => {
    setEditingProvider(provider);
    setIsRetryLogoutDialogOpen(true);
  };

  const columns = buildGameProviderColumns(t, {
    onStaffTestEdit: openStaffTestEdit,
    onRetryLogout: openRetryLogout,
    isUpdateAllowed
  });

  return (
    <Page.Root>
      <Page.Header>
        <SearchBar.Root
          defaultValues={DEFAULT_GAME_PROVIDER_LIST_FILTER}
          values={filter}
          onSubmit={search}
        >
          <SearchBar.Header title={t('nav.gameProviders')} />
          <SearchBar.Fields>
            <SearchBar.TextField name="code" label={t('gameProviders.code')} />
            <SearchBar.TextField name="name" label={t('gameProviders.name')} />
            <SearchBar.SelectField
              name="state"
              label={t('gameProviders.state')}
              options={stateOptions}
              allLabel={t('common.all')}
              noResultsLabel={t('common.noResultFound')}
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
      >
        <DataTable.Grid />
        <DataTable.Pagination />
      </DataTable.Root>
      <ProviderStaffTestDialog
        isOpen={isStaffTestDialogOpen}
        provider={editingProvider}
        onOpenChange={setIsStaffTestDialogOpen}
      />
      <RetryLogoutDialog
        isOpen={isRetryLogoutDialogOpen}
        provider={editingProvider}
        onOpenChange={setIsRetryLogoutDialogOpen}
      />
    </Page.Root>
  );
};

export default GameProvidersPage;
