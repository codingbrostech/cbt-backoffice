import type { RowData } from '@tanstack/react-table';

import { buildMaskedMobileFieldOptions } from '~/components/MaskedMobile';
import { buildPlayerIdLinkFieldOptions } from '~/components/PlayerIdLink';
import type { IFieldOptions } from '~/table/build-column-defs';

export interface IPlayerInfoRow {
  id?: string;
  playerId?: string;
  playerCode?: string;
  mobile?: string;
  patronNumber?: string;
}

/**
 * Field options for the player identity columns shared by the report pages:
 * copyable ids, a masked mobile and a link to the player detail.
 */
export const buildPlayerInfoFieldOptions = <TRow extends RowData & IPlayerInfoRow>(): Partial<
  Record<keyof IPlayerInfoRow, IFieldOptions<TRow>>
> => ({
  id: { formatterType: 'copyable' },
  playerId: buildPlayerIdLinkFieldOptions<TRow>(
    row => row.playerId,
    row => row.playerCode
  ),
  patronNumber: { formatterType: 'copyable' },
  mobile: buildMaskedMobileFieldOptions<TRow>(row => row.mobile)
});
