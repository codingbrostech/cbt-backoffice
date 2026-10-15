import {
  buildProviderNameByCode,
  gameProviderListQueryOptions
} from '@cbt-bo/api/game-provider/queries';
import type { IGameRankingEntry } from '@cbt-bo/api/game-ranking/queries';
import { DataTable } from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePagePermission } from '#/hooks/use-page-permission';
import { useTableLabels } from '#/hooks/use-table-labels';
import { buildGameRankingColumns } from '#/routes/app/game-ranking/columns';
import GameRankingEntryDialog from '#/routes/app/game-ranking/components/GameRankingEntryDialog';
import { useGameRankingEditor } from '#/routes/app/game-ranking/hooks/use-game-ranking-editor';
import { useSaveGameRanking } from '#/routes/app/game-ranking/hooks/use-save-game-ranking';

const GameRankingPage = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isEntryDialogOpen, setIsEntryDialogOpen] = useState(false);
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
    moveEntry,
    reorderEntries,
    reset
  } = useGameRankingEditor();
  const { saveRanking, isPending } = useSaveGameRanking();
  const { data: providers = [] } = useQuery(gameProviderListQueryOptions());
  const tableLabels = useTableLabels();
  const { isUpdateAllowed } = usePagePermission();

  const isEditable = isUpdateAllowed && isEditing;
  const providerNameByCode = buildProviderNameByCode(providers);
  const pageParams = { page: 1, pageSize: entries.length };
  const isSaveDisabled = !isDirty || isPending;
  const editingIndex = entries.findIndex(({ gameId }) => gameId === editingGameId);
  const editingEntry = entries[editingIndex];
  const highlightedGameId = isEntryDialogOpen ? editingGameId : undefined;

  const startEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    reset();
    setIsEditing(false);
  };

  const save = async () => {
    const isSaved = await saveRanking(entries);

    if (isSaved) setIsEditing(false);
  };

  const openAdd = () => {
    setEditingGameId(undefined);
    setIsEntryDialogOpen(true);
  };

  const openEdit = useCallback(({ gameId }: IGameRankingEntry) => {
    setEditingGameId(gameId);
    setIsEntryDialogOpen(true);
  }, []);

  const submitEntry = (entry: IGameRankingEntry, rank: number) => {
    if (editingEntry) {
      updateEntry(editingEntry.gameId, entry);
      setEditingGameId(entry.gameId);
    } else {
      addEntry(entry);
    }

    moveEntry(entry.gameId, rank - 1);
  };

  const stepEdit = (offset: number) => {
    const target = entries[editingIndex + offset];

    if (target) setEditingGameId(target.gameId);
  };

  const columns = buildGameRankingColumns(t, {
    isEditing: isEditable,
    providerNameByCode,
    onEdit: openEdit,
    onRemove: removeEntry
  });

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{t('nav.gameRanking')}</h1>
        <div className="flex items-center gap-2">
          {isEditable ? (
            <>
              {isDirty && (
                <p className="text-sm text-destructive">{t('gameRanking.unsavedHint')}</p>
              )}
              <Button
                type="button"
                variant="outline"
                disabled={!isDirty || isPending}
                onClick={reset}
              >
                {t('common.reset')}
              </Button>
              <Button type="button" variant="outline" onClick={openAdd}>
                <PlusIcon />
                {t('gameRanking.addGame')}
              </Button>
              <Button
                type="button"
                disabled={isSaveDisabled}
                onClick={() => {
                  void save();
                }}
              >
                {t('common.save')}
              </Button>
              <Button type="button" variant="outline" disabled={isPending} onClick={cancelEdit}>
                {t('common.cancel')}
              </Button>
            </>
          ) : (
            <Button key="edit" type="button" disabled={!isUpdateAllowed} onClick={startEdit}>
              {t('common.edit')}
            </Button>
          )}
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
        onRowReorder={isEditable ? reorderEntries : undefined}
        highlightedRowId={highlightedGameId}
        isLoading={isFetching}
        isError={isError}
      >
        <DataTable.Grid className="font-medium" />
      </DataTable.Root>
      <GameRankingEntryDialog
        isOpen={isEntryDialogOpen}
        entry={editingEntry}
        rankedGameIds={rankedGameIds}
        position={editingIndex + 1}
        total={entries.length}
        onOpenChange={setIsEntryDialogOpen}
        onSubmit={submitEntry}
        onStep={stepEdit}
      />
    </main>
  );
};

export default GameRankingPage;
