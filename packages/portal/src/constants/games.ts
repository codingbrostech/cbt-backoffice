export enum EGameState {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export type TGameState = EGameState;

export const GAME_STATES: TGameState[] = [EGameState.ACTIVE, EGameState.INACTIVE];

export const GAME_GENRES = [
  'live',
  'lottery',
  'chain',
  'elec',
  'chess',
  'sport',
  'slot',
  'mini',
  'fish',
  'bingo'
] as const;

export type TGameGenre = (typeof GAME_GENRES)[number];

/**
 * Query value that lists games whose UI type is not set.
 */
export const UNSET_GAME_TYPE = '__unset__';
