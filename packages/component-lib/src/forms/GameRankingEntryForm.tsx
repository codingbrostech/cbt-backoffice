import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

import LanguageTabs, {
  type ILanguageTab
} from '@cbt-bo/component-lib/components/forms/LanguageTabs';
import SelectField, {
  type ISelectOption
} from '@cbt-bo/component-lib/components/forms/SelectField';
import SubmitButton from '@cbt-bo/component-lib/components/forms/SubmitButton';
import TextField from '@cbt-bo/component-lib/components/forms/TextField';
import TextareaField from '@cbt-bo/component-lib/components/forms/TextareaField';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { FieldError, FieldGroup } from '@cbt-bo/component-lib/components/ui/field';

/**
 * Values of one ranking entry. `titles` and `descriptions` hold one text per
 * language, keyed by the language value.
 */
export interface IGameRankingEntryFormValues {
  rank: string;
  providerCode: string;
  gameId: string;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
}

export interface IGameRankingEntryFormLabels {
  rank: string;
  title: string;
  description: string;
  previousGame: string;
  nextGame: string;
  /**
   * Position indicator between the step buttons, such as `4 / 7`.
   */
  position: string;
  cancel: string;
  submit: string;
  noResults: string;
  gameRankedError: string;
}

export interface IGameRankingEntryFormProps {
  labels: IGameRankingEntryFormLabels;
  /**
   * One title and description tab per language.
   */
  languages: readonly ILanguageTab[];
  /**
   * Fields that pick the provider and the game, bound to `providerCode` and
   * `gameId`. They render inside the form and can read it through
   * `useFormContext`.
   */
  gameFields: ReactNode;
  /**
   * Shows the step buttons. Without it the entry is new and starts at rank
   * `total + 1`.
   */
  isEdit?: boolean;
  /**
   * Values of the edited entry. The form resets whenever they change.
   */
  values?: Partial<IGameRankingEntryFormValues>;
  /**
   * Games already in the ranking, which cannot be picked again.
   */
  rankedGameIds: readonly string[];
  /**
   * 1-based rank of the edited entry.
   */
  position: number;
  /**
   * Number of entries in the ranking.
   */
  total: number;
  /**
   * Receives the values with the texts trimmed and blank ones removed.
   */
  onSubmit: (values: IGameRankingEntryFormValues) => void;
  /**
   * Receives the same values as `onSubmit` plus the step offset, -1 or 1.
   */
  onStep: (values: IGameRankingEntryFormValues, offset: number) => void;
  onCancel: () => void;
}

const DESCRIPTION_ROWS = 3;

const buildRankOptions = (count: number): ISelectOption[] =>
  Array.from({ length: count }, (_, index) => {
    const rank = String(index + 1);

    return { value: rank, label: rank };
  });

const buildLanguageTexts = (
  languages: readonly ILanguageTab[],
  texts: Record<string, string>
): Record<string, string> => {
  const languageTexts = languages.map(({ value }): [string, string] => [value, texts[value] ?? '']);

  return Object.fromEntries(languageTexts);
};

const buildFormValues = (
  languages: readonly ILanguageTab[],
  defaultRank: number,
  values?: Partial<IGameRankingEntryFormValues>
): IGameRankingEntryFormValues => {
  const {
    rank = String(defaultRank),
    providerCode = '',
    gameId = '',
    titles = {},
    descriptions = {}
  } = values ?? {};

  return {
    rank,
    providerCode,
    gameId,
    titles: buildLanguageTexts(languages, titles),
    descriptions: buildLanguageTexts(languages, descriptions)
  };
};

const buildFilledTexts = (texts: Record<string, string>): Record<string, string> => {
  const trimmedTexts = Object.entries(texts).map(([language, text]): [string, string] => [
    language,
    text.trim()
  ]);
  const filledTexts = trimmedTexts.filter(([, text]) => text);

  return Object.fromEntries(filledTexts);
};

const buildSubmittedValues = ({
  titles,
  descriptions,
  ...values
}: IGameRankingEntryFormValues): IGameRankingEntryFormValues => ({
  ...values,
  titles: buildFilledTexts(titles),
  descriptions: buildFilledTexts(descriptions)
});

/**
 * Add or edit form for one game ranking entry. It holds the rank, the game
 * picked through `gameFields`, and a title plus description per language.
 */
const GameRankingEntryForm = ({
  labels,
  languages,
  gameFields,
  isEdit = false,
  values,
  rankedGameIds,
  position,
  total,
  onSubmit,
  onStep,
  onCancel
}: IGameRankingEntryFormProps) => {
  const form = useForm<IGameRankingEntryFormValues>({
    values: buildFormValues(languages, isEdit ? position : total + 1, values)
  });
  const gameId = useWatch({ control: form.control, name: 'gameId' });

  const { gameId: entryGameId = '' } = values ?? {};
  const rankCount = isEdit ? total : total + 1;
  const rankOptions = buildRankOptions(rankCount);
  const isGameTaken = gameId !== entryGameId && rankedGameIds.includes(gameId);
  const isGameValid = Boolean(gameId) && !isGameTaken;
  const isPreviousAvailable = position > 1;
  const isNextAvailable = position < total;

  const submit = (formValues: IGameRankingEntryFormValues) => {
    onSubmit(buildSubmittedValues(formValues));
  };

  const step = (offset: number) => {
    void form.handleSubmit(formValues => {
      onStep(buildSubmittedValues(formValues), offset);
    })();
  };

  return (
    <FormProvider {...form}>
      <form
        noValidate
        onSubmit={event => {
          event.stopPropagation();
          void form.handleSubmit(submit)(event);
        }}
      >
        <FieldGroup>
          <SelectField
            control={form.control}
            name="rank"
            label={labels.rank}
            options={rankOptions}
            noResultsLabel={labels.noResults}
          />
          {gameFields}
          {isGameTaken && <FieldError className="-mt-3">{labels.gameRankedError}</FieldError>}
          <LanguageTabs languages={languages}>
            {({ value }) => (
              <>
                <TextField
                  control={form.control}
                  name={`titles.${value}`}
                  label={labels.title}
                  autoComplete="off"
                />
                <TextareaField
                  control={form.control}
                  name={`descriptions.${value}`}
                  label={labels.description}
                  rows={DESCRIPTION_ROWS}
                />
              </>
            )}
          </LanguageTabs>
          <div className="flex items-center gap-2">
            {isEdit && (
              <>
                <Button
                  type="button"
                  variant="muted"
                  size="icon-sm"
                  aria-label={labels.previousGame}
                  disabled={!isPreviousAvailable || !isGameValid}
                  onClick={() => {
                    step(-1);
                  }}
                >
                  <ChevronLeftIcon />
                </Button>
                <span className="min-w-12 text-center text-xs text-muted-foreground tabular-nums">
                  {labels.position}
                </span>
                <Button
                  type="button"
                  variant="muted"
                  size="icon-sm"
                  aria-label={labels.nextGame}
                  disabled={!isNextAvailable || !isGameValid}
                  onClick={() => {
                    step(1);
                  }}
                >
                  <ChevronRightIcon />
                </Button>
              </>
            )}
            <Button type="button" variant="outline" className="ml-auto" onClick={onCancel}>
              {labels.cancel}
            </Button>
            <SubmitButton control={form.control} label={labels.submit} disabled={!isGameValid} />
          </div>
        </FieldGroup>
      </form>
    </FormProvider>
  );
};

export default GameRankingEntryForm;
