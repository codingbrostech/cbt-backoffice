export const BONUS_TYPES = [
  'newbie',
  'levelup',
  'checkin',
  'deposit',
  'lottery',
  'referral',
  'cashback',
  'quest'
] as const;

export const BONUS_SUB_TYPES = ['bet'] as const;

export const BONUS_CYCLES = ['once', 'daily', 'weekly', 'monthly'] as const;

export const BONUS_PRIZE_TYPES = ['coin', 'rate', 'item'] as const;

export type TBonusType = (typeof BONUS_TYPES)[number];
export type TBonusCycle = (typeof BONUS_CYCLES)[number];
export type TBonusPrizeType = (typeof BONUS_PRIZE_TYPES)[number];
