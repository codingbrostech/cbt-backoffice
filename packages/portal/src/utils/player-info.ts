import { SENSITIVE_DATA_MASK } from '~/constants/common';
import type { ISearchField } from '~/types/data-table';
import { isBrandSo } from '~/utils/env';

export type TPlayerInfoField = 'id' | 'playerId' | 'mobile' | 'playerCode' | 'patronNumber';

const FM_PLAYER_INFO_FIELDS = [
  'playerId',
  'mobile',
  'playerCode'
] as const satisfies readonly TPlayerInfoField[];
const SO_PLAYER_INFO_FIELDS = [
  'playerId',
  'patronNumber',
  'mobile'
] as const satisfies readonly TPlayerInfoField[];

const MOBILE_VISIBLE_EDGE_LENGTH = 3;

export const getPlayerInfoColumns = (isPlayersPage = false): TPlayerInfoField[] => {
  const [, ...restFields] = isBrandSo() ? SO_PLAYER_INFO_FIELDS : FM_PLAYER_INFO_FIELDS;
  const playerIdField: TPlayerInfoField = isPlayersPage ? 'id' : 'playerId';

  return [playerIdField, ...restFields];
};

export const getPlayerInfoSearchFields = (
  modelName: string,
  isPlayersPage = false
): ISearchField[] => {
  const infoColumns = getPlayerInfoColumns(isPlayersPage);

  return infoColumns.map(name => ({ label: `${modelName}.${name}`, name }));
};

/**
 * Masks a mobile number to its first and last MOBILE_VISIBLE_EDGE_LENGTH
 * characters, replacing the middle with SENSITIVE_DATA_MASK.
 *
 * @example
 * maskMobile('9451234753'); // '945****753'
 */
export const maskMobile = (mobile: string): string => {
  if (mobile.length <= MOBILE_VISIBLE_EDGE_LENGTH * 2) return SENSITIVE_DATA_MASK;

  const visibleHead = mobile.slice(0, MOBILE_VISIBLE_EDGE_LENGTH);
  const visibleTail = mobile.slice(-MOBILE_VISIBLE_EDGE_LENGTH);

  return `${visibleHead}${SENSITIVE_DATA_MASK}${visibleTail}`;
};
