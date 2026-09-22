import { invert } from 'radash';

export type TNavCategory = 'home' | 'player' | 'finance' | 'game' | 'promotion' | 'setting';

const PATH_LOGIN = '/login';
const PATH_ADMINS = '/admins';
const PATH_ROLES = '/roles';
const PATH_ROLES_PERMISSION = '/roles/roles-permission';
const PATH_HOME = '/dashboard';
const PATH_ADMIN_QUOTA_CONFIGS = '/admins/admin-quota-configs';
const PATH_ADMIN_QUOTAS = '/admins/admin-quotas';
const PATH_ADMIN_SESSIONS = '/admins/admin-sessions';
const PATH_ADMIN_OPS_LOGS = '/admins/admin-ops-logs';
const PATH_USERS = '/users';
const PATH_PLAYERS = '/players';
const PATH_PLAYER_SESSIONS = '/players/player-sessions';
const PATH_PLAYER_MOBILE_POLICY = '/players/player-mobile-policy';
const PATH_PLAYER_SELF_LIMITS = '/players/player-self-limits';
const PATH_BET_TRANS = '/reports/bet-trans';
const PATH_LEDGER_TRANS = '/reports/ledger-trans';
const PATH_PAYMENT_TRANSACTION = '/reports/payment-transaction';
const PATH_POINT_TRANSACTION = '/reports/point-transaction';
const PATH_ACSC_REWARD_PUSHLOG = '/reports/acsc-reward-pushlog';
const PATH_ACSC_TRANSFER = '/reports/acsc-transfer';
const PATH_WAGER_STATS = '/reports/wager-stats';
const PATH_BANNERS = '/settings/banners';
const PATH_PROMOS = '/settings/promotions';
const PATH_PROMOTION_TRANSACTIONS = '/settings/promotion-transactions';
const PATH_TIER_TRANSACTIONS = '/settings/vip-level-trans';
const PATH_PAGES = '/settings/pages';
const PATH_PAGE_DIVS = '/settings/pagedivs';
const PATH_GAME_CATEGORIES = '/game/game-categories';
const PATH_GAME_RANKING = '/game/game-ranking';
const PATH_GAMES = '/game/games';
const PATH_PLAYER_LABELS = '/players/player-labels';
const PATH_PLAYER_REALMS = '/players/playerrealms';
const PATH_PLAYER_GROUPS = '/players/player-groups';
const PATH_VIP_LEVELS = '/players/vip-levels';
const PATH_REBATE_SETTING = '/players/rebate-setting';
const PATH_BONUSES = '/players/bonuses';
const PATH_REBATE_TRANS = '/players/rebate-trans';
const PATH_UNAUTHED_DEFAULT = PATH_LOGIN;
const PATH_AUTHED_DEFAULT = PATH_HOME;
const PATH_REWARDS_SHOP = '/players/xp-shop';
const PATH_REWARDS_SHOP_CATEGORIES = '/players/xp-shop-categories';
const PATH_REDEMPTION_HISTORY = '/players/xp-shop-history';
const PATH_PAYMENT_CHANNELS = '/settings/payment-channels';

export const PATH = {
  PATH_LOGIN,
  PATH_ADMINS,
  PATH_ROLES,
  PATH_ROLES_PERMISSION,
  PATH_HOME,
  PATH_ADMIN_QUOTA_CONFIGS,
  PATH_ADMIN_QUOTAS,
  PATH_ADMIN_SESSIONS,
  PATH_ADMIN_OPS_LOGS,
  PATH_USERS,
  PATH_PLAYERS,
  PATH_PLAYER_SESSIONS,
  PATH_PLAYER_MOBILE_POLICY,
  PATH_PLAYER_SELF_LIMITS,
  PATH_PROMOTION_TRANSACTIONS,
  PATH_TIER_TRANSACTIONS,
  PATH_BET_TRANS,
  PATH_LEDGER_TRANS,
  PATH_PAYMENT_TRANSACTION,
  PATH_POINT_TRANSACTION,
  PATH_ACSC_REWARD_PUSHLOG,
  PATH_ACSC_TRANSFER,
  PATH_WAGER_STATS,
  PATH_BANNERS,
  PATH_PROMOS,
  PATH_PAGES,
  PATH_PAGE_DIVS,
  PATH_GAME_CATEGORIES,
  PATH_GAME_RANKING,
  PATH_GAMES,
  PATH_PLAYER_LABELS,
  PATH_PLAYER_REALMS,
  PATH_PLAYER_GROUPS,
  PATH_VIP_LEVELS,
  PATH_REBATE_SETTING,
  PATH_BONUSES,
  PATH_REBATE_TRANS,
  PATH_UNAUTHED_DEFAULT,
  PATH_AUTHED_DEFAULT,
  PATH_REWARDS_SHOP,
  PATH_REWARDS_SHOP_CATEGORIES,
  PATH_REDEMPTION_HISTORY,
  PATH_PAYMENT_CHANNELS
} as const;

export const PATH_SLASH = '/';
export type TPathKey = keyof typeof PATH;
export type TPathNameMap = Partial<Record<TPathKey, string>>;

const {
  PATH_UNAUTHED_DEFAULT: unauthedDefault,
  PATH_AUTHED_DEFAULT: authedDefault,
  ...pathsByKey
} = PATH;

/**
 * Path key for every navigable path, for example `'/admins'` to `'PATH_ADMINS'`.
 * The two default-route aliases are left out so their targets keep one key.
 */
export const PATH_KEY_MAP: Readonly<Record<string, TPathKey>> = invert(pathsByKey);

export const DEFAULT_PATHS = { unauthed: unauthedDefault, authed: authedDefault } as const;

export const PATH_NAME_MAP: TPathNameMap = {
  PATH_BET_TRANS: 'nav.betTrans',
  PATH_LEDGER_TRANS: 'nav.ledgertxns',
  PATH_WAGER_STATS: 'nav.wagerStats',
  PATH_USERS: 'nav.users',
  PATH_PLAYERS: 'nav.players',
  PATH_PLAYER_SESSIONS: 'nav.playerSessions',
  PATH_PLAYER_MOBILE_POLICY: 'nav.playerMobilePolicy',
  PATH_PLAYER_SELF_LIMITS: 'nav.playerSelfLimits',
  PATH_ADMINS: 'nav.admins',
  PATH_ADMIN_QUOTA_CONFIGS: 'nav.adminQuotaConfigs',
  PATH_ADMIN_QUOTAS: 'nav.adminQuotas',
  PATH_ADMIN_SESSIONS: 'nav.adminSessions',
  PATH_ADMIN_OPS_LOGS: 'nav.adminOpsLogs',
  PATH_ROLES: 'nav.roles',
  PATH_ROLES_PERMISSION: 'nav.rolesPermission',
  PATH_BANNERS: 'nav.banners',
  PATH_PROMOS: 'nav.promos',
  PATH_PROMOTION_TRANSACTIONS: 'nav.promotionsTransaction',
  PATH_TIER_TRANSACTIONS: 'nav.tierTransactions',
  PATH_PAGES: 'nav.pages',
  PATH_PAGE_DIVS: 'nav.pagedivs',
  PATH_HOME: 'nav.home',
  PATH_GAME_CATEGORIES: 'nav.gameCategories',
  PATH_GAME_RANKING: 'nav.gameRanking',
  PATH_GAMES: 'nav.games',
  PATH_PLAYER_GROUPS: 'nav.playergroups',
  PATH_PLAYER_LABELS: 'nav.playerlabels',
  PATH_PLAYER_REALMS: 'nav.playerrealms',
  PATH_VIP_LEVELS: 'nav.viplevels',
  PATH_REBATE_SETTING: 'nav.vipRebates',
  PATH_BONUSES: 'nav.bonuses',
  PATH_REBATE_TRANS: 'nav.playerRebateBonus',
  PATH_REWARDS_SHOP: 'nav.rewardsShop',
  PATH_REWARDS_SHOP_CATEGORIES: 'nav.rewardsShopCategories',
  PATH_REDEMPTION_HISTORY: 'nav.redemptionHistory',
  PATH_PAYMENT_TRANSACTION: 'nav.paymentTransaction',
  PATH_POINT_TRANSACTION: 'nav.pointTransaction',
  PATH_ACSC_REWARD_PUSHLOG: 'nav.acscRewardPushLogs',
  PATH_ACSC_TRANSFER: 'nav.acscTransfers',
  PATH_PAYMENT_CHANNELS: 'nav.paymentChannels'
};
