import type { TNavItem } from '@cbt-bo/component-lib/components/nav';
import {
  ArrowLeftRight,
  Boxes,
  CreditCard,
  Diamond,
  FileBarChart,
  FileText,
  Gamepad2,
  Gift,
  History,
  Images,
  LayoutDashboard,
  LayoutGrid,
  Logs,
  Megaphone,
  Receipt,
  Repeat,
  Settings,
  ShoppingBag,
  Spade,
  Store,
  Tag,
  TrendingUp,
  Trophy,
  UserCog,
  UserShield,
  Users
} from 'lucide-react';

import { PATH } from '#/constants/path';

export const buildNavItems = (t: (key: string) => string): TNavItem[] => [
  {
    key: 'dashboard',
    label: t('nav.dashboard'),
    icon: <LayoutDashboard />,
    pageKey: 'dashboard',
    path: PATH.DASHBOARD
  },
  {
    key: 'player',
    label: t('nav.player'),
    icon: <Users />,
    pageKey: 'player',
    children: [
      {
        key: 'player-mgmt',
        label: t('nav.playerMgmt'),
        icon: <Users />,
        pageKey: 'playerMgmt',
        children: [
          {
            key: 'players',
            label: t('nav.players'),
            pageKey: 'players',
            path: PATH.PLAYERS
          },
          {
            key: 'player-sessions',
            label: t('nav.playerSessions'),
            pageKey: 'player-sessions',
            path: PATH.PLAYER_SESSIONS
          },
          {
            key: 'player-mobile-policy',
            label: t('nav.playerMobilePolicy'),
            pageKey: 'player-mobile-policy',
            path: PATH.PLAYER_MOBILE_POLICY
          },
          {
            key: 'player-self-limits',
            label: t('nav.playerSelfLimits'),
            pageKey: 'player-self-limits',
            path: PATH.PLAYER_SELF_LIMITS
          }
        ]
      },
      {
        key: 'player-labels',
        label: t('nav.playerLabels'),
        icon: <Tag />,
        pageKey: 'player-labels',
        path: PATH.PLAYER_LABELS
      },
      {
        key: 'player-groups',
        label: t('nav.playerGroups'),
        icon: <Boxes />,
        pageKey: 'player-groups',
        path: PATH.PLAYER_GROUPS
      },
      {
        key: 'vip-levels',
        label: t('nav.vipLevels'),
        icon: <TrendingUp />,
        pageKey: 'vip-levels',
        path: PATH.VIP_LEVELS
      }
    ]
  },
  {
    key: 'reports',
    label: t('nav.reports'),
    icon: <FileBarChart />,
    pageKey: 'reports',
    children: [
      {
        key: 'reports',
        label: t('nav.reports'),
        icon: <Logs />,
        pageKey: 'reports',
        children: [
          {
            key: 'bet-trans',
            label: t('nav.betTrans'),
            pageKey: 'bet-trans',
            path: PATH.BET_TRANS
          },
          {
            key: 'ledger-trans',
            label: t('nav.ledgerTrans'),
            pageKey: 'ledger-trans',
            path: PATH.LEDGER_TRANS
          },
          {
            key: 'payment-transaction',
            label: t('nav.paymentTransaction'),
            pageKey: 'payment-transaction',
            path: PATH.PAYMENT_TRANSACTION
          },
          {
            key: 'point-transaction',
            label: t('nav.pointTransaction'),
            pageKey: 'point-transaction',
            path: PATH.POINT_TRANSACTION
          },
          {
            key: 'wager-stats',
            label: t('nav.wagerStats'),
            pageKey: 'wager-stats',
            path: PATH.WAGER_STATS
          },
          {
            key: 'top-wager',
            label: t('nav.topWager'),
            pageKey: 'top-wager',
            path: PATH.TOP_WAGER
          },
          {
            key: 'patron-bet-history',
            label: t('nav.patronBetHistory'),
            pageKey: 'patron-bet-history',
            path: PATH.PATRON_BET_HISTORY
          }
        ]
      }
    ]
  },
  {
    key: 'game',
    label: t('nav.game'),
    icon: <Gamepad2 />,
    pageKey: 'game',
    children: [
      {
        key: 'games',
        label: t('nav.games'),
        icon: <Spade />,
        pageKey: 'games',
        path: PATH.GAMES
      },
      {
        key: 'game-categories',
        label: t('nav.gameCategories'),
        icon: <LayoutGrid />,
        pageKey: 'game-categories',
        path: PATH.GAME_CATEGORIES
      },
      {
        key: 'game-ranking',
        label: t('nav.gameRanking'),
        icon: <Trophy />,
        pageKey: 'game-ranking',
        path: PATH.GAME_RANKING
      },
      {
        key: 'game-providers',
        label: t('nav.gameProviders'),
        icon: <Store />,
        pageKey: 'game-providers',
        path: PATH.GAME_PROVIDERS
      }
    ]
  },
  {
    key: 'promotion',
    label: t('nav.promotion'),
    icon: <Gift />,
    pageKey: 'promotion',
    children: [
      {
        key: 'banners',
        label: t('nav.banners'),
        icon: <Images />,
        pageKey: 'banners',
        path: PATH.BANNERS
      },
      {
        key: 'bonuses',
        label: t('nav.bonuses'),
        icon: <Diamond />,
        pageKey: 'bonuses',
        path: PATH.BONUSES
      },
      {
        key: 'rebate-setting',
        label: t('nav.rebateSetting'),
        icon: <Repeat />,
        pageKey: 'rebate-setting',
        path: PATH.REBATE_SETTING
      },
      {
        key: 'rebate-trans',
        label: t('nav.rebateTrans'),
        icon: <ArrowLeftRight />,
        pageKey: 'rebate-trans',
        path: PATH.REBATE_TRANS
      },
      {
        key: 'rewards-shop',
        label: t('nav.rewardsShop'),
        icon: <ShoppingBag />,
        pageKey: 'xp-shop',
        path: PATH.REWARDS_SHOP
      },
      {
        key: 'rewards-shop-categories',
        label: t('nav.rewardsShopCategories'),
        icon: <LayoutGrid />,
        pageKey: 'xp-shop-categories',
        path: PATH.REWARDS_SHOP_CATEGORIES
      },
      {
        key: 'redemption-history',
        label: t('nav.redemptionHistory'),
        icon: <History />,
        pageKey: 'xp-shop-history',
        path: PATH.REDEMPTION_HISTORY
      },
      {
        key: 'promos',
        label: t('nav.promos'),
        icon: <Megaphone />,
        pageKey: 'promotions',
        path: PATH.PROMOS
      },
      {
        key: 'promotion-transactions',
        label: t('nav.promotionTransactions'),
        icon: <Receipt />,
        pageKey: 'promotion-transactions',
        path: PATH.PROMOTION_TRANSACTIONS
      },
      {
        key: 'tier-transactions',
        label: t('nav.tierTransactions'),
        icon: <Logs />,
        pageKey: 'vip-level-trans',
        path: PATH.TIER_TRANSACTIONS
      },
      {
        key: 'pages',
        label: t('nav.pages'),
        icon: <FileText />,
        pageKey: 'pages',
        path: PATH.PAGES
      }
    ]
  },
  {
    key: 'setting',
    label: t('nav.setting'),
    icon: <Settings />,
    pageKey: 'setting',
    children: [
      {
        key: 'acct-mgmt',
        label: t('nav.acctMgmt'),
        icon: <UserCog />,
        pageKey: 'acctMgmt',
        children: [
          {
            key: 'admins',
            label: t('nav.admins'),
            pageKey: 'admins',
            path: PATH.ADMINS
          },
          {
            key: 'admin-quota-configs',
            label: t('nav.adminQuotaConfigs'),
            pageKey: 'admin-quota-configs',
            path: PATH.ADMIN_QUOTA_CONFIGS
          },
          {
            key: 'admin-quotas',
            label: t('nav.adminQuotas'),
            pageKey: 'admin-quotas',
            path: PATH.ADMIN_QUOTAS
          },
          {
            key: 'admin-sessions',
            label: t('nav.adminSessions'),
            pageKey: 'admin-sessions',
            path: PATH.ADMIN_SESSIONS
          },
          {
            key: 'admin-ops-logs',
            label: t('nav.adminOpsLogs'),
            pageKey: 'admin-ops-logs',
            path: PATH.ADMIN_OPS_LOGS
          }
        ]
      },
      {
        key: 'role-management',
        label: t('nav.roleManagement'),
        icon: <UserShield />,
        pageKey: 'roleManagement',
        children: [
          {
            key: 'roles',
            label: t('nav.roles'),
            pageKey: 'roles',
            path: PATH.ROLES
          },
          {
            key: 'roles-permission',
            label: t('nav.rolesPermission'),
            pageKey: 'roles-permission',
            path: PATH.ROLES_PERMISSION
          }
        ]
      },
      {
        key: 'payment-channels',
        label: t('nav.paymentChannels'),
        icon: <CreditCard />,
        pageKey: 'payment-channels',
        path: PATH.PAYMENT_CHANNELS
      }
    ]
  }
];
