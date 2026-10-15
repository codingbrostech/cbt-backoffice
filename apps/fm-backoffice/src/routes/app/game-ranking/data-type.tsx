import type { IGameRankingEntry } from '@cbt-bo/api/game-ranking/queries';
import type { GameResult } from '@cbt-bo/api-schema/bo/models';
import { DataTable, type IDataTableColumn } from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import type { TFunction } from 'i18next';

import { LANGUAGE_OPTIONS } from '#/constants/language-options';

const EMPTY_VALUE = '-';
const DRAG_COLUMN_WIDTH_PX = 48;
const RANK_COLUMN_WIDTH_PX = 64;
const ACTION_COLUMN_WIDTH_PX = 140;

export interface IGameRankingColumnActions {
  isUpdateAllowed: boolean;
  onEdit: (entry: IGameRankingEntry) => void;
  onRemove: (gameId: string) => void;
}

export interface IGamePickerColumnActions {
  rankedGameIds: readonly string[];
  onPick: (game: GameResult) => void;
}

const [primaryLanguage, ...secondaryLanguages] = LANGUAGE_OPTIONS;

const buildTextLabel = (text?: string): string => {
  if (!text) return EMPTY_VALUE;

  return text;
};

interface ILocalizedLineProps {
  languageCode: string;
  text: string;
  isSecondary?: boolean;
}

const LocalizedLine = ({ languageCode, text, isSecondary = false }: ILocalizedLineProps) => (
  <span className="flex min-w-0 items-baseline gap-2">
    <span className="w-5 shrink-0 text-[10px] text-muted-foreground uppercase">{languageCode}</span>
    <span
      className={
        isSecondary
          ? 'line-clamp-2 whitespace-normal text-xs text-muted-foreground'
          : 'line-clamp-2 whitespace-normal'
      }
    >
      {text}
    </span>
  </span>
);

const LocalizedText = ({ texts }: { texts: Record<string, string> }) => (
  <div className="flex min-w-0 flex-col gap-0.5">
    <LocalizedLine
      languageCode={primaryLanguage.value}
      text={buildTextLabel(texts[primaryLanguage.value])}
    />
    {secondaryLanguages.map(({ value }) => (
      <LocalizedLine
        key={value}
        languageCode={value}
        text={buildTextLabel(texts[value])}
        isSecondary
      />
    ))}
  </div>
);

const buildGameTypeLabel = (type?: string): string => {
  if (!type) return EMPTY_VALUE;

  return type;
};

export const buildGameRankingColumns = (
  t: TFunction,
  { isUpdateAllowed, onEdit, onRemove }: IGameRankingColumnActions
): IDataTableColumn<IGameRankingEntry>[] => [
  {
    key: 'drag',
    title: '',
    fixed: 'start',
    width: DRAG_COLUMN_WIDTH_PX,
    render: () => (
      <DataTable.DragHandle label={t('gameRanking.dragToReorder')} isDisabled={!isUpdateAllowed} />
    )
  },
  {
    key: 'rank',
    title: t('gameRanking.rank'),
    fixed: 'start',
    width: RANK_COLUMN_WIDTH_PX,
    render: (_entry, index) => index + 1
  },
  {
    key: 'game',
    title: t('gameRanking.game'),
    render: ({ gameId, game }) => game?.code ?? gameId
  },
  {
    key: 'providerCode',
    title: t('gameRanking.providerCode'),
    render: ({ game }) => game?.providerCode ?? EMPTY_VALUE
  },
  {
    key: 'title',
    title: t('gameRanking.title'),
    render: ({ titles }) => <LocalizedText texts={titles} />
  },
  {
    key: 'description',
    title: t('gameRanking.description'),
    render: ({ descriptions }) => <LocalizedText texts={descriptions} />
  },
  {
    key: 'action',
    title: t('common.action'),
    width: ACTION_COLUMN_WIDTH_PX,
    render: entry => (
      <div className="flex gap-2">
        <Button
          type="button"
          variant="muted"
          size="sm"
          disabled={!isUpdateAllowed}
          onClick={() => {
            onEdit(entry);
          }}
        >
          {t('common.edit')}
        </Button>
        <Button
          type="button"
          variant="destructive-muted"
          size="sm"
          disabled={!isUpdateAllowed}
          onClick={() => {
            onRemove(entry.gameId);
          }}
        >
          {t('common.remove')}
        </Button>
      </div>
    )
  }
];

export const buildGamePickerColumns = (
  t: TFunction,
  { rankedGameIds, onPick }: IGamePickerColumnActions
): IDataTableColumn<GameResult>[] => [
  {
    key: 'code',
    title: t('gameRanking.gameCode'),
    fixed: 'start',
    render: ({ code }) => code ?? EMPTY_VALUE
  },
  {
    key: 'providerCode',
    title: t('gameRanking.providerCode'),
    render: ({ providerCode }) => providerCode ?? EMPTY_VALUE
  },
  {
    key: 'type',
    title: t('gameRanking.gameType'),
    render: ({ type }) => buildGameTypeLabel(type)
  },
  {
    key: 'state',
    title: t('gameRanking.gameState'),
    render: ({ state }) => (state ? t(`state.${state}`, { defaultValue: state }) : EMPTY_VALUE)
  },
  {
    key: 'action',
    title: t('common.action'),
    width: ACTION_COLUMN_WIDTH_PX,
    render: game => (
      <Button
        type="button"
        variant="muted"
        size="sm"
        disabled={!game.id || rankedGameIds.includes(game.id)}
        onClick={() => {
          onPick(game);
        }}
      >
        {game.id && rankedGameIds.includes(game.id) ? t('gameRanking.ranked') : t('common.add')}
      </Button>
    )
  }
];
