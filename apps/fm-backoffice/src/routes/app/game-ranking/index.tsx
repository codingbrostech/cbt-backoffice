import type { IGameRankingEntry } from '@cbt-bo/api/game-ranking/queries';
import { DataTable } from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePagePermission } from '#/hooks/use-page-permission';
import { useTableLabels } from '#/hooks/use-table-labels';
import GamePickerDialog from '#/routes/app/game-ranking/components/GamePickerDialog';
import GameRankingEntryDialog from '#/routes/app/game-ranking/components/GameRankingEntryDialog';
import { buildGameRankingColumns } from '#/routes/app/game-ranking/data-type';
import { useGameRankingEditor } from '#/routes/app/game-ranking/hooks/use-game-ranking-editor';
import { useSaveGameRanking } from '#/routes/app/game-ranking/hooks/use-save-game-ranking';

const GameRankingPage = () => {
  const { t } = useTranslation();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingGameId, setEditingGameId] = useState<string>();
  const {
    entries,
    rankedGameIds,
    isFetching,
    isError,
    isDirty,
    addEntry,
    updateEntry,
    removeEntry,
    reorderEntries,
    reset
  } = useGameRankingEditor();
  const { saveRanking, isPending } = useSaveGameRanking();
  const tableLabels = useTableLabels();
  const { isUpdateAllowed } = usePagePermission();

  const pageParams = { page: 1, pageSize: entries.length };
  const isSaveDisabled = !isUpdateAllowed || !isDirty || isPending;
  const editingIndex = entries.findIndex(({ gameId }) => gameId === editingGameId);
  const editingEntry = entries[editingIndex];

  const save = () => {
    void saveRanking(entries);
  };

  const openEdit = useCallback(({ gameId }: IGameRankingEntry) => {
    setEditingGameId(gameId);
  }, []);

  const closeEdit = useCallback(() => {
    setEditingGameId(undefined);
  }, []);

  const stepEdit = (offset: number) => {
    const target = entries[editingIndex + offset];

    if (target) setEditingGameId(target.gameId);
  };

  const columns = buildGameRankingColumns(t, {
    isUpdateAllowed,
    onEdit: openEdit,
    onRemove: removeEntry
  });

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{t('nav.gameRanking')}</h1>
        <div className="flex gap-2">
          <Button type="button" variant="outline" disabled={!isDirty || isPending} onClick={reset}>
            {t('common.reset')}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={!isUpdateAllowed}
            onClick={() => {
              setIsPickerOpen(true);
            }}
          >
            <PlusIcon />
            {t('gameRanking.addGame')}
          </Button>
          <Button type="button" disabled={isSaveDisabled} onClick={save}>
            {t('common.save')}
          </Button>
        </div>
      </div>
      <DataTable.Root
        columns={columns}
        data={entries}
        total={entries.length}
        labels={tableLabels}
        params={pageParams}
        onParamsChange={() => undefined}
        getRowId={({ gameId }) => gameId}
        onRowReorder={isUpdateAllowed ? reorderEntries : undefined}
        highlightedRowId={editingGameId}
        isLoading={isFetching}
        isError={isError}
      >
        <DataTable.Grid />
      </DataTable.Root>
      <GamePickerDialog
        isOpen={isPickerOpen}
        rankedGameIds={rankedGameIds}
        onOpenChange={setIsPickerOpen}
        onPick={addEntry}
      />
      <GameRankingEntryDialog
        isOpen={Boolean(editingEntry)}
        entry={editingEntry}
        position={editingIndex + 1}
        total={entries.length}
        onOpenChange={closeEdit}
        onSubmit={updateEntry}
        onStep={stepEdit}
      />
    </main>
  );
};

export default GameRankingPage;
