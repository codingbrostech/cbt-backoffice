export const PROMO_TYPES = {
  NORMAL: 'normal',
  GIG_MIGRATION: 'gig_migration',
  LEADERBOARD: 'leaderboard',
  FASTTRACK: 'fasttrack',
  DAILY: 'daily'
} as const;

export type TPromoType = (typeof PROMO_TYPES)[keyof typeof PROMO_TYPES];

export const PROMO_TYPE_LIST = [
  PROMO_TYPES.NORMAL,
  PROMO_TYPES.GIG_MIGRATION,
  PROMO_TYPES.LEADERBOARD,
  PROMO_TYPES.FASTTRACK,
  PROMO_TYPES.DAILY
] as const satisfies readonly TPromoType[];
