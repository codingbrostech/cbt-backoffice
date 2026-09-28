export const PATH = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PLAYERS: '/players/players',
  PLAYER_SESSIONS: '/players/sessions',
  PLAYER_MOBILE_POLICY: '/players/mobile-policy',
  PLAYER_SELF_LIMITS: '/players/self-limits',
  PLAYER_LABELS: '/players/labels',
  PLAYER_GROUPS: '/players/groups',
  VIP_LEVELS: '/players/vip-levels',
  BET_TRANS: '/reports/bet-trans',
  LEDGER_TRANS: '/reports/ledger-trans',
  PAYMENT_TRANSACTION: '/reports/payment-transaction',
  POINT_TRANSACTION: '/reports/point-transaction',
  WAGER_STATS: '/reports/wager-stats',
  GAMES: '/games/games',
  GAME_CATEGORIES: '/games/categories',
  GAME_RANKING: '/games/ranking',
  BANNERS: '/promotions/banners',
  BONUSES: '/promotions/bonuses',
  REBATE_SETTING: '/promotions/rebate-setting',
  REBATE_TRANS: '/promotions/rebate-trans',
  REWARDS_SHOP: '/promotions/xp-shop',
  REWARDS_SHOP_CATEGORIES: '/promotions/xp-shop-categories',
  REDEMPTION_HISTORY: '/promotions/xp-shop-history',
  PROMOS: '/promotions/promotions',
  PROMOTION_TRANSACTIONS: '/promotions/transactions',
  TIER_TRANSACTIONS: '/promotions/vip-level-trans',
  PAGES: '/promotions/pages',
  ADMINS: '/settings/admins',
  ADMIN_QUOTA_CONFIGS: '/settings/admin-quota-configs',
  ADMIN_QUOTAS: '/settings/admin-quotas',
  ADMIN_SESSIONS: '/settings/admin-sessions',
  ADMIN_OPS_LOGS: '/settings/admin-ops-logs',
  ROLES: '/settings/roles',
  ROLES_PERMISSION: '/settings/roles-permission',
  PAYMENT_CHANNELS: '/settings/payment-channels'
} as const;

const IN_APP_PATH_PATTERN = /^\/(?!\/)/;

/**
 * In-app href to continue to after login. Falls back to PATH.DASHBOARD when
 * `redirect` is missing or points outside the app.
 */
export const buildPostLoginHref = (redirect?: string): string =>
  redirect && IN_APP_PATH_PATTERN.test(redirect) ? redirect : PATH.DASHBOARD;
