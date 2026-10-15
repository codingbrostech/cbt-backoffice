import {
  type IGameRankingEntry,
  gameRankingListQueryOptions
} from '@cbt-bo/api/game-ranking/queries';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export interface IUseGameRankingEditorResult {
  entries: IGameRankingEntry[];
  rankedGameIds: string[];
  isFetching: boolean;
  isError: boolean;
  isDirty: boolean;
  addEntry: (entry: IGameRankingEntry) => void;
  updateEntry: (gameId: string, entry: IGameRankingEntry) => void;
  removeEntry: (gameId: string) => void;
  moveEntry: (gameId: string, toIndex: number) => void;
  reorderEntries: (activeGameId: string, overGameId: string) => void;
  reset: () => void;
}

const EMPTY_ENTRIES: IGameRankingEntry[] = [];

const moveTo = (
  entries: readonly IGameRankingEntry[],
  fromIndex: number,
  toIndex: number
): IGameRankingEntry[] => {
  if (fromIndex < 0 || toIndex < 0 || toIndex >= entries.length) return [...entries];

  const next = [...entries];
  const [moved] = next.splice(fromIndex, 1);

  if (!moved) return [...entries];

  next.splice(toIndex, 0, moved);

  return next;
};

const buildComparable = (entries: readonly IGameRankingEntry[]) =>
  entries.map(({ gameId, titles, descriptions }) => ({ gameId, titles, descriptions }));

const isSameOrder = (left: readonly IGameRankingEntry[], right: readonly IGameRankingEntry[]) =>
  JSON.stringify(buildComparable(left)) === JSON.stringify(buildComparable(right));

/**
 * Draft of the whole ranking. The server list seeds the draft, every edit
 * stays local, and `isDirty` says whether the draft still matches the server.
 *
 * @example
 * const { entries, reorderEntries, isDirty } = useGameRankingEditor();
 */
export const useGameRankingEditor = (): IUseGameRankingEditorResult => {
  const {
    data: savedEntries = EMPTY_ENTRIES,
    isFetching,
    isError
  } = useQuery(gameRankingListQueryOptions());
  const [entries, setEntries] = useState<IGameRankingEntry[]>(savedEntries);
  const [syncedEntries, setSyncedEntries] = useState<IGameRankingEntry[]>(savedEntries);

  if (syncedEntries !== savedEntries) {
    setSyncedEntries(savedEntries);
    setEntries(savedEntries);
  }

  const rankedGameIds = entries.map(({ gameId }) => gameId);
  const isDirty = !isSameOrder(entries, savedEntries);

  const addEntry = useCallback((next: IGameRankingEntry) => {
    setEntries(prev => (prev.some(entry => entry.gameId === next.gameId) ? prev : [...prev, next]));
  }, []);

  const updateEntry = useCallback((gameId: string, next: IGameRankingEntry) => {
    setEntries(prev => prev.map(entry => (entry.gameId === gameId ? next : entry)));
  }, []);

  const removeEntry = useCallback((gameId: string) => {
    setEntries(prev => prev.filter(entry => entry.gameId !== gameId));
  }, []);

  const moveEntry = useCallback((gameId: string, toIndex: number) => {
    setEntries(prev =>
      moveTo(
        prev,
        prev.findIndex(entry => entry.gameId === gameId),
        toIndex
      )
    );
  }, []);

  const reorderEntries = useCallback((activeGameId: string, overGameId: string) => {
    setEntries(prev =>
      moveTo(
        prev,
        prev.findIndex(entry => entry.gameId === activeGameId),
        prev.findIndex(entry => entry.gameId === overGameId)
      )
    );
  }, []);

  const reset = useCallback(() => {
    setEntries(savedEntries);
  }, [savedEntries]);

  return {
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
  };
};
