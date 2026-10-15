import { openGameListQueryOptions } from '@cbt-bo/api/game/queries';
import type { IGameRankingEntry } from '@cbt-bo/api/game-ranking/queries';
import type { GameResult } from '@cbt-bo/api-schema/bo/models';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@cbt-bo/component-lib/components/ui/dialog';
import GameRankingEntryForm, {
  type IGameRankingEntryFormValues
} from '@cbt-bo/component-lib/forms/GameRankingEntryForm';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import ProviderGameFields from '#/components/forms/ProviderGameFields';
import { CONTENT_LANGUAGE_OPTIONS } from '#/constants/language-options';
import { buildGameName } from '#/routes/app/game-ranking/columns';

export interface IGameRankingEntryDialogProps {
  isOpen: boolean;
  /**
   * Entry to edit. Absent when adding a new entry.
   */
  entry?: IGameRankingEntry;
  /**
   * Games already in the ranking, which cannot be picked again.
   */
  rankedGameIds: readonly string[];
  /**
   * 1-based rank of `entry`.
   */
  position: number;
  /**
   * Number of entries in the ranking.
   */
  total: number;
  onOpenChange: (isOpen: boolean) => void;
  /**
   * Receives the entry from the form and its 1-based rank.
   */
  onSubmit: (entry: IGameRankingEntry, rank: number) => void;
  /**
   * Moves `offset` entries away. Called after `onSubmit`.
   */
  onStep: (offset: number) => void;
}

const EMPTY_GAMES: GameResult[] = [];

const buildFormValues = ({
  gameId,
  game,
  titles,
  descriptions
}: IGameRankingEntry): Partial<IGameRankingEntryFormValues> => ({
  providerCode: game?.providerCode,
  gameId,
  titles,
  descriptions
});

const buildEntry = (
  values: IGameRankingEntryFormValues,
  games: readonly GameResult[],
  entry?: IGameRankingEntry
): IGameRankingEntry => {
  const { gameId, titles, descriptions } = values;
  const game = entry?.gameId === gameId ? entry.game : games.find(({ id }) => id === gameId);

  return { gameId, game, titles, descriptions };
};

/**
 * Adds a ranked entry, or edits the rank, the game, the multi-language title
 * and the short description of `entry`. The result is handed to `onSubmit`
 * and only reaches the API when the page saves the whole ranking.
 */
const GameRankingEntryDialog = ({
  isOpen,
  entry,
  rankedGameIds,
  position,
  total,
  onOpenChange,
  onSubmit,
  onStep
}: IGameRankingEntryDialogProps) => {
  const { t } = useTranslation();
  const { data: games = EMPTY_GAMES } = useQuery({
    ...openGameListQueryOptions(),
    enabled: isOpen
  });

  const values = entry && buildFormValues(entry);
  const title = entry
    ? t('gameRanking.editEntry', { game: buildGameName(entry) })
    : t('gameRanking.addGame');
  const labels = {
    rank: t('gameRanking.rank'),
    title: t('gameRanking.title'),
    description: t('gameRanking.description'),
    previousGame: t('gameRanking.previousGame'),
    nextGame: t('gameRanking.nextGame'),
    position: t('gameRanking.position', { position, total }),
    cancel: t('common.cancel'),
    submit: t('common.confirm'),
    noResults: t('common.noResultFound'),
    gameRankedError: t('gameRanking.ranked')
  };

  const applyEdits = (formValues: IGameRankingEntryFormValues) => {
    onSubmit(buildEntry(formValues, games, entry), Number(formValues.rank));
  };

  const submit = (formValues: IGameRankingEntryFormValues) => {
    applyEdits(formValues);
    onOpenChange(false);
  };

  const step = (formValues: IGameRankingEntryFormValues, offset: number) => {
    applyEdits(formValues);
    onStep(offset);
  };

  const cancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined} className="grid-cols-[minmax(0,1fr)]">
        <DialogHeader>
          <DialogTitle className="truncate pr-6" title={title}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <GameRankingEntryForm
          labels={labels}
          languages={CONTENT_LANGUAGE_OPTIONS}
          gameFields={
            <ProviderGameFields
              providerName="providerCode"
              gameName="gameId"
              currentGame={entry?.game}
            />
          }
          isEdit={Boolean(entry)}
          values={values}
          rankedGameIds={rankedGameIds}
          position={position}
          total={total}
          onSubmit={submit}
          onStep={step}
          onCancel={cancel}
        />
      </DialogContent>
    </Dialog>
  );
};

export default GameRankingEntryDialog;
