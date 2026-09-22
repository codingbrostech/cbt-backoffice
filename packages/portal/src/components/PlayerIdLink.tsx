import { useNavigate } from '@tanstack/react-router';
import type { RowData } from '@tanstack/react-table';
import { ExternalLinkIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import CopyableValue from '~/components/CopyableValue';
import { Button } from '~/components/ui/button';
import { isBrandSo } from '~/config';
import { PAGE_KEY } from '~/constants/page-key';
import { PATH } from '~/constants/path';
import { usePagePermission } from '~/hooks/use-page-permission';
import { appTabsStore } from '~/store/app-tabs-store';
import type { IFieldOptions } from '~/table/build-column-defs';

export interface IPlayerIdLinkProps {
  value: string;
  playerId?: string | null;
  tabName?: string;
  minWidth?: number;
}

const FM_PLAYER_ID_TEXT_MIN_WIDTH = 160;
const SO_PLAYER_ID_TEXT_MIN_WIDTH = 60;
const PATRON_ID_TEXT_MIN_WIDTH = 80;

export const buildPlayerDetailPath = (playerId: string): string =>
  `${PATH.PATH_PLAYERS}/${playerId}`;

const PlayerIdLink = ({ value, playerId, tabName, minWidth }: IPlayerIdLinkProps) => {
  const { t } = useTranslation();
  const { isReadAllowed } = usePagePermission(PAGE_KEY.PLAYERS);
  const navigate = useNavigate();

  const isLinkable = isReadAllowed && Boolean(playerId);

  const goToDetail = () => {
    if (!playerId) return;

    const pathname = buildPlayerDetailPath(playerId);
    appTabsStore.actions.setTabName(pathname, tabName ?? playerId);
    void navigate({ to: pathname });
  };

  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <CopyableValue value={value} minWidth={minWidth} />
      {isLinkable && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground"
          aria-label={t('common.detail')}
          onClick={goToDetail}
        >
          <ExternalLinkIcon />
        </Button>
      )}
    </span>
  );
};

/**
 * Field options rendering a copyable value with a link to the player detail
 * page. `getPlayerId` defaults to the displayed value.
 */
export const buildPlayerIdLinkFieldOptions = <TRow extends RowData>(
  getValue: (row: TRow) => string | null | undefined,
  getTabName?: (row: TRow) => string | null | undefined,
  getPlayerId?: (row: TRow) => string | null | undefined
): IFieldOptions<TRow> => ({
  formatterType: 'custom',
  isCustomCell: true,
  isDetailCopyEnabled: true,
  formatterOptions: {
    customFormatter: row => {
      const value = getValue(row);
      if (!value) return '-';

      const playerId = getPlayerId ? getPlayerId(row) : value;
      const playerIdMinWidth = isBrandSo()
        ? SO_PLAYER_ID_TEXT_MIN_WIDTH
        : FM_PLAYER_ID_TEXT_MIN_WIDTH;
      const minWidth = getPlayerId ? PATRON_ID_TEXT_MIN_WIDTH : playerIdMinWidth;

      return (
        <PlayerIdLink
          value={value}
          playerId={playerId}
          tabName={getTabName?.(row) ?? undefined}
          minWidth={minWidth}
        />
      );
    }
  }
});

export default PlayerIdLink;
