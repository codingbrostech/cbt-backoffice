import type { IGameRankingEntry } from '@cbt-bo/api/game-ranking/queries';
import SubmitButton from '@cbt-bo/component-lib/components/forms/SubmitButton';
import TextField from '@cbt-bo/component-lib/components/forms/TextField';
import TextareaField from '@cbt-bo/component-lib/components/forms/TextareaField';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@cbt-bo/component-lib/components/ui/dialog';
import { FieldGroup } from '@cbt-bo/component-lib/components/ui/field';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { mapValues, objectify, shake } from 'radash';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { LANGUAGE_OPTIONS } from '#/constants/language-options';
import type { IGameRankingEntryText } from '#/routes/app/game-ranking/hooks/use-game-ranking-editor';

export interface IGameRankingEntryDialogProps {
  isOpen: boolean;
  entry?: IGameRankingEntry;
  /**
   * Rank of `entry`, 1-based, and how many entries the ranking holds. Drive
   * the position indicator and the step buttons.
   */
  position: number;
  total: number;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (gameId: string, text: IGameRankingEntryText) => void;
  /**
   * Moves to the entry `offset` places away, after the current edits are
   * applied to the draft.
   */
  onStep: (offset: number) => void;
}

/**
 * One text per supported locale. The field names nest under `titles` and
 * `descriptions`, which is the shape react-hook-form builds from a dotted
 * field name.
 */
interface IEntryFormValues {
  titles: Record<string, string>;
  descriptions: Record<string, string>;
}

const DESCRIPTION_ROWS = 3;

const buildLocaleTexts = (texts: Record<string, string>): Record<string, string> =>
  objectify(
    LANGUAGE_OPTIONS,
    ({ value }) => value,
    ({ value }) => texts[value] ?? ''
  );

const buildFormValues = (entry?: IGameRankingEntry): IEntryFormValues => {
  const { titles = {}, descriptions = {} } = entry ?? {};

  return { titles: buildLocaleTexts(titles), descriptions: buildLocaleTexts(descriptions) };
};

const buildFilledTexts = (texts: Record<string, string>): Record<string, string> => {
  const trimmedTexts = mapValues(texts, text => text.trim());

  return shake(trimmedTexts, text => !text);
};

const buildText = ({ titles, descriptions }: IEntryFormValues): IGameRankingEntryText => ({
  titles: buildFilledTexts(titles),
  descriptions: buildFilledTexts(descriptions)
});

/**
 * Edits the multi-language title and short description of one ranked game.
 * The change is handed to `onSubmit` and only reaches the API when the page
 * saves the whole ranking.
 */
const GameRankingEntryDialog = ({
  isOpen,
  entry,
  position,
  total,
  onOpenChange,
  onSubmit,
  onStep
}: IGameRankingEntryDialogProps) => {
  const { t } = useTranslation();
  const form = useForm<IEntryFormValues>({ values: buildFormValues(entry) });

  const { gameId = '', game } = entry ?? {};
  const { code = '' } = game ?? {};
  const isPreviousAvailable = position > 1;
  const isNextAvailable = position < total;

  const applyEdits = (values: IEntryFormValues) => {
    onSubmit(gameId, buildText(values));
  };

  const handleSubmit = (values: IEntryFormValues) => {
    applyEdits(values);
    onOpenChange(false);
  };

  const step = (offset: number) => {
    void form.handleSubmit(values => {
      applyEdits(values);
      onStep(offset);
    })();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="truncate pr-6">
            {t('gameRanking.editEntry', { game: code || gameId })}
          </DialogTitle>
        </DialogHeader>
        <form
          noValidate
          onSubmit={event => {
            event.stopPropagation();
            void form.handleSubmit(handleSubmit)(event);
          }}
        >
          <FieldGroup>
            {LANGUAGE_OPTIONS.map(({ value, label }) => (
              <TextField
                key={`titles.${value}`}
                control={form.control}
                name={`titles.${value}`}
                label={t('gameRanking.titleForLanguage', { language: label })}
                autoComplete="off"
              />
            ))}
            {LANGUAGE_OPTIONS.map(({ value, label }) => (
              <TextareaField
                key={`descriptions.${value}`}
                control={form.control}
                name={`descriptions.${value}`}
                label={t('gameRanking.descriptionForLanguage', { language: label })}
                rows={DESCRIPTION_ROWS}
              />
            ))}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="muted"
                size="icon-sm"
                aria-label={t('gameRanking.previousGame')}
                disabled={!isPreviousAvailable}
                onClick={() => {
                  step(-1);
                }}
              >
                <ChevronLeftIcon />
              </Button>
              <span className="min-w-12 text-center text-xs text-muted-foreground tabular-nums">
                {t('gameRanking.position', { position, total })}
              </span>
              <Button
                type="button"
                variant="muted"
                size="icon-sm"
                aria-label={t('gameRanking.nextGame')}
                disabled={!isNextAvailable}
                onClick={() => {
                  step(1);
                }}
              >
                <ChevronRightIcon />
              </Button>
              <Button
                type="button"
                variant="outline"
                className="ml-auto"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                {t('common.cancel')}
              </Button>
              <SubmitButton control={form.control} label={t('common.confirm')} />
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GameRankingEntryDialog;
