import type { IGameRankingEntry } from '@cbt-bo/api/game-ranking/queries';
import { CopyButton, IconButton } from '@cbt-bo/component-lib/components/button';
import {
  DataTable,
  type IDataTableColumn,
  TruncatedText
} from '@cbt-bo/component-lib/components/table';
import { cn } from '@cbt-bo/component-lib/lib/utils';
import type { TFunction } from 'i18next';
import { PencilIcon, Trash2Icon } from 'lucide-react';

import { CONTENT_LANGUAGE_OPTIONS } from '#/constants/language-options';

const EMPTY_VALUE = '-';
const DRAG_COLUMN_WIDTH_PX = 32;
const RANK_COLUMN_WIDTH_PX = 64;
const GAME_COLUMN_WIDTH_PX = 240;
const PROVIDER_COLUMN_WIDTH_PX = 160;
const ENTRY_ACTION_COLUMN_WIDTH_PX = 88;

export interface IGameRankingColumnOptions {
  isEditing: boolean;
  providerNameByCode: Readonly<Record<string, string>>;
  onEdit: (entry: IGameRankingEntry) => void;
  onRemove: (gameId: string) => void;
}

const [primaryLanguage, ...secondaryLanguages] = CONTENT_LANGUAGE_OPTIONS;

const buildTextLabel = (text?: string): string => {
  if (!text) return EMPTY_VALUE;

  return text;
};

interface ILocalizedLineProps {
  languageCode: string;
  text: string;
  pairedText: string;
  isSecondary?: boolean;
}

const LocalizedLine = ({
  languageCode,
  text,
  pairedText,
  isSecondary = false
}: ILocalizedLineProps) => {
  const textClassName = cn(
    'col-start-1 row-start-1 line-clamp-2 whitespace-normal',
    isSecondary && 'text-xs font-normal text-muted-foreground'
  );

  return (
    <span className="flex min-w-0 items-baseline gap-2">
      <span className="w-5 shrink-0 text-[10px] font-normal text-muted-foreground uppercase">
        {languageCode}
      </span>
      <span className="grid min-w-0 flex-1">
        <span className={textClassName}>{text}</span>
        <span aria-hidden="true" className={cn(textClassName, 'invisible')}>
          {pairedText}
        </span>
      </span>
    </span>
  );
};

interface ILocalizedTextProps {
  texts: Record<string, string>;
  pairedTexts: Record<string, string>;
}

const LocalizedText = ({ texts, pairedTexts }: ILocalizedTextProps) => (
  <div className="flex min-w-0 flex-col gap-0.5">
    <LocalizedLine
      languageCode={primaryLanguage.value}
      text={buildTextLabel(texts[primaryLanguage.value])}
      pairedText={buildTextLabel(pairedTexts[primaryLanguage.value])}
    />
    {secondaryLanguages.map(({ value }) => (
      <LocalizedLine
        key={value}
        languageCode={value}
        text={buildTextLabel(texts[value])}
        pairedText={buildTextLabel(pairedTexts[value])}
        isSecondary
      />
    ))}
  </div>
);

/**
 * Display name of a ranked game: its English description, then its code,
 * then the bare game id.
 */
export const buildGameName = ({ gameId, game }: IGameRankingEntry): string =>
  game?.descriptions?.en ?? game?.code ?? gameId;

const buildProviderLabel = (
  providerNameByCode: Readonly<Record<string, string>>,
  providerCode?: string
): string => {
  if (!providerCode) return EMPTY_VALUE;

  return providerNameByCode[providerCode] ?? providerCode;
};

export const buildGameRankingColumns = (
  t: TFunction,
  { isEditing, providerNameByCode, onEdit, onRemove }: IGameRankingColumnOptions
): IDataTableColumn<IGameRankingEntry>[] => {
  const dragColumn: IDataTableColumn<IGameRankingEntry> = {
    key: 'drag',
    title: '',
    fixed: 'start',
    width: DRAG_COLUMN_WIDTH_PX,
    cellClassName: 'pr-0',
    render: () => isEditing && <DataTable.DragHandle label={t('gameRanking.dragToReorder')} />
  };
  const entryColumns: IDataTableColumn<IGameRankingEntry>[] = [
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
      width: GAME_COLUMN_WIDTH_PX,
      render: entry => {
        const gameName = buildGameName(entry);

        return (
          <span className="flex min-w-0 items-center gap-2">
            <TruncatedText text={gameName} className="min-w-0" />
            <CopyButton
              value={gameName}
              labels={{ copy: t('common.copy'), copied: t('common.copied') }}
            />
          </span>
        );
      }
    },
    {
      key: 'providerCode',
      title: t('gameRanking.providerCode'),
      width: PROVIDER_COLUMN_WIDTH_PX,
      render: ({ game }) => (
        <TruncatedText text={buildProviderLabel(providerNameByCode, game?.providerCode)} />
      )
    },
    {
      key: 'title',
      title: t('gameRanking.title'),
      render: ({ titles, descriptions }) => (
        <LocalizedText texts={titles} pairedTexts={descriptions} />
      )
    },
    {
      key: 'description',
      title: t('gameRanking.description'),
      render: ({ titles, descriptions }) => (
        <LocalizedText texts={descriptions} pairedTexts={titles} />
      )
    }
  ];
  const actionColumn: IDataTableColumn<IGameRankingEntry> = {
    key: 'action',
    title: isEditing ? t('common.action') : '',
    width: ENTRY_ACTION_COLUMN_WIDTH_PX,
    render: entry =>
      isEditing && (
        <div className="flex gap-2">
          <IconButton
            type="button"
            label={t('common.edit')}
            variant="muted"
            size="icon-sm"
            onClick={() => {
              onEdit(entry);
            }}
          >
            <PencilIcon />
          </IconButton>
          <IconButton
            type="button"
            label={t('common.remove')}
            variant="destructive-muted"
            size="icon-sm"
            onClick={() => {
              onRemove(entry.gameId);
            }}
          >
            <Trash2Icon />
          </IconButton>
        </div>
      )
  };

  return [dragColumn, ...entryColumns, actionColumn];
};
