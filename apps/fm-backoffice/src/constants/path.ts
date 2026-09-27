export const PATH = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PLAYERS: '/players',
  PLAYER_SESSIONS: '/player-sessions',
  PLAYER_MOBILE_POLICY: '/player-mobile-policy',
  PLAYER_SELF_LIMITS: '/player-self-limits',
  PLAYER_LABELS: '/player-labels',
  PLAYER_GROUPS: '/player-groups',
  VIP_LEVELS: '/vip-levels',
  BET_TRANS: '/bet-trans',
  LEDGER_TRANS: '/ledger-trans',
  PAYMENT_TRANSACTION: '/payment-transaction',
  POINT_TRANSACTION: '/point-transaction',
  WAGER_STATS: '/wager-stats',
  GAMES: '/games',
  GAME_CATEGORIES: '/game-categories',
  GAME_RANKING: '/game-ranking',
  BANNERS: '/banners',
  BONUSES: '/bonuses',
  REBATE_SETTING: '/rebate-setting',
  REBATE_TRANS: '/rebate-trans',
  REWARDS_SHOP: '/xp-shop',
  REWARDS_SHOP_CATEGORIES: '/xp-shop-categories',
  REDEMPTION_HISTORY: '/xp-shop-history',
  PROMOS: '/promotions',
  PROMOTION_TRANSACTIONS: '/promotion-transactions',
  TIER_TRANSACTIONS: '/vip-level-trans',
  PAGES: '/pages',
  ADMINS: '/admins',
  ADMIN_QUOTA_CONFIGS: '/admin-quota-configs',
  ADMIN_QUOTAS: '/admin-quotas',
  ADMIN_SESSIONS: '/admin-sessions',
  ADMIN_OPS_LOGS: '/admin-ops-logs',
  ROLES: '/roles',
  ROLES_PERMISSION: '/roles-permission',
  PAYMENT_CHANNELS: '/payment-channels'
} as const;

const IN_APP_PATH_PATTERN = /^\/(?!\/)/;

/**
 * In-app href to continue to after login. Falls back to PATH.DASHBOARD when
 * `redirect` is missing or points outside the app.
 */
export const buildPostLoginHref = (redirect?: string): string =>
  redirect && IN_APP_PATH_PATTERN.test(redirect) ? redirect : PATH.DASHBOARD;
