import {
  DEFAULT_GAME_LIST_FILTER,
  buildGameListParams,
  gameListQueryOptions
} from '@cbt-bo/api/game/queries';
import type { GameResult } from '@cbt-bo/api-schema/bo/models';
import { SearchBar } from '@cbt-bo/component-lib/components/search';
import { DataTable } from '@cbt-bo/component-lib/components/table';
import { DEFAULT_PAGE_SIZE, type IListParams } from '@cbt-bo/component-lib/components/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@cbt-bo/component-lib/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTableLabels } from '#/hooks/use-table-labels';
import { buildGamePickerColumns } from '#/routes/app/game-ranking/data-type';

export interface IGamePickerDialogProps {
  isOpen: boolean;
  rankedGameIds: readonly string[];
  onOpenChange: (isOpen: boolean) => void;
  onPick: (game: GameResult) => void;
}

/**
 * Picks a game to append to the ranking. A game already ranked is listed but
 * cannot be picked again.
 */
const GamePickerDialog = ({
  isOpen,
  rankedGameIds,
  onOpenChange,
  onPick
}: IGamePickerDialogProps) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState(DEFAULT_GAME_LIST_FILTER);
  const [pageParams, setPageParams] = useState<IListParams>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  const {
    data: list,
    isFetching,
    isError
  } = useQuery({
    ...gameListQueryOptions(buildGameListParams(pageParams, filter)),
    enabled: isOpen
  });
  const tableLabels = useTableLabels();

  const { rows = [], total = 0 } = list ?? {};

  const search = (next: typeof DEFAULT_GAME_LIST_FILTER) => {
    setFilter(next);
    setPageParams(prev => ({ ...prev, page: 1 }));
  };

  const pick = (game: GameResult) => {
    onPick(game);
    onOpenChange(false);
  };

  const columns = buildGamePickerColumns(t, { rankedGameIds, onPick: pick });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{t('gameRanking.addGame')}</DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[60vh] min-h-0 flex-col gap-4">
          <SearchBar.Root
            defaultValues={DEFAULT_GAME_LIST_FILTER}
            values={filter}
            onSubmit={search}
          >
            <SearchBar.Fields>
              <SearchBar.TextField name="name" label={t('gameRanking.gameName')} />
              <SearchBar.TextField name="providerCode" label={t('gameRanking.providerCode')} />
              <SearchBar.Actions
                resetLabel={t('common.reset')}
                submitLabel={t('common.search')}
                isLoading={isFetching}
              />
            </SearchBar.Fields>
          </SearchBar.Root>
          <DataTable.Root
            columns={columns}
            data={rows}
            total={total}
            labels={tableLabels}
            params={pageParams}
            onParamsChange={setPageParams}
            isLoading={isFetching}
            isError={isError}
          >
            <DataTable.Grid />
            <DataTable.Pagination />
          </DataTable.Root>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GamePickerDialog;
