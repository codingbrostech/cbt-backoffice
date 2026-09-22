import type { AdminRolePermEntry } from '@cbt-bo/api-schema/bo-fm/models';
import {
  ChartColumnIcon,
  CoinsIcon,
  CreditCardIcon,
  DicesIcon,
  FileSearchIcon,
  FileTextIcon,
  GemIcon,
  GiftIcon,
  HomeIcon,
  ImagesIcon,
  LayersIcon,
  LayoutGridIcon,
  LogsIcon,
  type LucideIcon,
  MegaphoneIcon,
  PackageSearchIcon,
  ReceiptIcon,
  SettingsIcon,
  ShieldUserIcon,
  ShoppingBagIcon,
  SmartphoneIcon,
  TagIcon,
  TrendingUpIcon,
  TrophyIcon,
  UserCogIcon,
  UsersIcon
} from 'lucide-react';

import { isBrandSo } from '~/config';
import { PAGE_KEY } from '~/constants/page-key';
import { PATH, PATH_NAME_MAP, type TNavCategory } from '~/constants/path';

export interface INavCategory {
  value: TNavCategory;
  label: string;
  icon: LucideIcon;
}

export interface INavSubLink {
  icon: LucideIcon;
  title: string;
  link: string;
  pageKey?: string;
  isDisabled?: boolean;
  isFmOnly?: boolean;
  isSoOnly?: boolean;
}

export interface INavLink extends INavSubLink {
  subLinks?: INavSubLink[];
}

export const NAV_CATEGORIES = [
  { value: 'home', label: 'header.nav.home', icon: HomeIcon },
  { value: 'player', label: 'header.nav.player', icon: UsersIcon },
  { value: 'finance', label: 'header.nav.finance', icon: ChartColumnIcon },
  { value: 'game', label: 'header.nav.game', icon: DicesIcon },
  { value: 'promotion', label: 'header.nav.promotion', icon: GiftIcon },
  { value: 'setting', label: 'header.nav.setting', icon: SettingsIcon }
] as const satisfies readonly INavCategory[];

export const DEFAULT_NAV_CATEGORY: TNavCategory = 'player';

const NAV_LINKS_BY_CATEGORY: Readonly<Record<TNavCategory, readonly INavLink[]>> = {
  home: [{ icon: HomeIcon, title: 'nav.home', link: PATH.PATH_HOME, pageKey: PAGE_KEY.DASHBOARD }],
  player: [
    {
      icon: UsersIcon,
      title: 'nav.playerMgmt',
      link: PATH.PATH_PLAYERS,
      subLinks: [
        {
          title: PATH_NAME_MAP.PATH_PLAYERS ?? '',
          link: PATH.PATH_PLAYERS,
          icon: UsersIcon,
          pageKey: PAGE_KEY.PLAYERS
        },
        {
          title: PATH_NAME_MAP.PATH_PLAYER_SESSIONS ?? '',
          link: PATH.PATH_PLAYER_SESSIONS,
          icon: UsersIcon,
          pageKey: PAGE_KEY.PLAYER_SESSIONS
        },
        {
          title: PATH_NAME_MAP.PATH_PLAYER_MOBILE_POLICY ?? '',
          link: PATH.PATH_PLAYER_MOBILE_POLICY,
          icon: SmartphoneIcon,
          pageKey: PAGE_KEY.PLAYER_MOBILE_POLICY
        },
        {
          title: PATH_NAME_MAP.PATH_PLAYER_SELF_LIMITS ?? '',
          link: PATH.PATH_PLAYER_SELF_LIMITS,
          icon: UsersIcon,
          pageKey: PAGE_KEY.PLAYER_SELF_LIMITS
        }
      ]
    },
    {
      icon: TagIcon,
      title: 'nav.playerlabels',
      link: PATH.PATH_PLAYER_LABELS,
      pageKey: PAGE_KEY.PLAYER_LABELS
    },
    {
      icon: LayersIcon,
      title: 'nav.playergroups',
      link: PATH.PATH_PLAYER_GROUPS,
      pageKey: PAGE_KEY.PLAYER_GROUPS
    },
    {
      icon: TrendingUpIcon,
      title: 'nav.viplevels',
      link: PATH.PATH_VIP_LEVELS,
      pageKey: PAGE_KEY.VIP_LEVELS,
      isFmOnly: true
    }
  ],
  finance: [
    {
      icon: LogsIcon,
      title: 'nav.reports',
      link: PATH.PATH_USERS,
      subLinks: [
        {
          title: PATH_NAME_MAP.PATH_BET_TRANS ?? '',
          link: PATH.PATH_BET_TRANS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.BET_TRANS
        },
        {
          title: PATH_NAME_MAP.PATH_LEDGER_TRANS ?? '',
          link: PATH.PATH_LEDGER_TRANS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.LEDGER_TRANS
        },
        {
          title: PATH_NAME_MAP.PATH_PAYMENT_TRANSACTION ?? '',
          link: PATH.PATH_PAYMENT_TRANSACTION,
          icon: LogsIcon,
          pageKey: PAGE_KEY.PAYMENT_TRANSACTION
        },
        {
          title: PATH_NAME_MAP.PATH_POINT_TRANSACTION ?? '',
          link: PATH.PATH_POINT_TRANSACTION,
          icon: LogsIcon,
          pageKey: PAGE_KEY.POINT_TRANSACTION,
          isFmOnly: true
        },
        {
          title: PATH_NAME_MAP.PATH_WAGER_STATS ?? '',
          link: PATH.PATH_WAGER_STATS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.WAGER_STATS
        }
      ]
    },
    {
      icon: FileSearchIcon,
      title: 'nav.acsc',
      link: PATH.PATH_USERS,
      isSoOnly: true,
      subLinks: [
        {
          title: PATH_NAME_MAP.PATH_ACSC_REWARD_PUSHLOG ?? '',
          link: PATH.PATH_ACSC_REWARD_PUSHLOG,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ACSC_REWARD_PUSHLOG
        },
        {
          title: PATH_NAME_MAP.PATH_ACSC_TRANSFER ?? '',
          link: PATH.PATH_ACSC_TRANSFER,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ACSC_TRANSFER
        }
      ]
    }
  ],
  game: [
    {
      icon: DicesIcon,
      title: PATH_NAME_MAP.PATH_GAMES ?? '',
      link: PATH.PATH_GAMES,
      pageKey: PAGE_KEY.GAMES
    },
    {
      icon: LayoutGridIcon,
      title: PATH_NAME_MAP.PATH_GAME_CATEGORIES ?? '',
      link: PATH.PATH_GAME_CATEGORIES,
      pageKey: PAGE_KEY.GAME_CATEGORIES
    },
    {
      icon: TrophyIcon,
      title: PATH_NAME_MAP.PATH_GAME_RANKING ?? '',
      link: PATH.PATH_GAME_RANKING,
      pageKey: PAGE_KEY.GAME_RANKING
    }
  ],
  promotion: [
    {
      title: PATH_NAME_MAP.PATH_BANNERS ?? '',
      link: PATH.PATH_BANNERS,
      icon: ImagesIcon,
      pageKey: PAGE_KEY.BANNERS
    },
    { icon: GemIcon, title: 'nav.bonuses', link: PATH.PATH_BONUSES, pageKey: PAGE_KEY.BONUSES },
    {
      title: PATH_NAME_MAP.PATH_REBATE_SETTING ?? '',
      link: PATH.PATH_REBATE_SETTING,
      icon: CoinsIcon,
      pageKey: PAGE_KEY.REBATE_SETTING
    },
    {
      title: PATH_NAME_MAP.PATH_REBATE_TRANS ?? '',
      link: PATH.PATH_REBATE_TRANS,
      icon: CoinsIcon,
      pageKey: PAGE_KEY.REBATE_TRANS
    },
    {
      title: PATH_NAME_MAP.PATH_REWARDS_SHOP ?? '',
      link: PATH.PATH_REWARDS_SHOP,
      icon: ShoppingBagIcon,
      pageKey: PAGE_KEY.XP_SHOP
    },
    {
      title: PATH_NAME_MAP.PATH_REWARDS_SHOP_CATEGORIES ?? '',
      link: PATH.PATH_REWARDS_SHOP_CATEGORIES,
      icon: LayoutGridIcon,
      pageKey: PAGE_KEY.XP_SHOP_CATEGORIES
    },
    {
      title: PATH_NAME_MAP.PATH_REDEMPTION_HISTORY ?? '',
      link: PATH.PATH_REDEMPTION_HISTORY,
      icon: PackageSearchIcon,
      pageKey: PAGE_KEY.XP_SHOP_HISTORY
    },
    {
      title: PATH_NAME_MAP.PATH_PROMOS ?? '',
      link: PATH.PATH_PROMOS,
      icon: MegaphoneIcon,
      pageKey: PAGE_KEY.PROMOTIONS
    },
    {
      title: PATH_NAME_MAP.PATH_PROMOTION_TRANSACTIONS ?? '',
      link: PATH.PATH_PROMOTION_TRANSACTIONS,
      icon: ReceiptIcon,
      pageKey: PAGE_KEY.PROMOTION_TRANSACTIONS
    },
    {
      title: PATH_NAME_MAP.PATH_TIER_TRANSACTIONS ?? '',
      link: PATH.PATH_TIER_TRANSACTIONS,
      icon: LogsIcon,
      pageKey: PAGE_KEY.TIER_TRANSACTIONS,
      isFmOnly: true
    },
    {
      title: PATH_NAME_MAP.PATH_PAGES ?? '',
      link: PATH.PATH_PAGES,
      icon: FileTextIcon,
      pageKey: PAGE_KEY.PAGES
    }
  ],
  setting: [
    {
      icon: UserCogIcon,
      title: 'nav.acctMgmt',
      link: PATH.PATH_USERS,
      subLinks: [
        {
          title: PATH_NAME_MAP.PATH_ADMINS ?? '',
          link: PATH.PATH_ADMINS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ADMINS
        },
        {
          title: PATH_NAME_MAP.PATH_ADMIN_QUOTA_CONFIGS ?? '',
          link: PATH.PATH_ADMIN_QUOTA_CONFIGS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ADMIN_QUOTA_CONFIGS
        },
        {
          title: PATH_NAME_MAP.PATH_ADMIN_QUOTAS ?? '',
          link: PATH.PATH_ADMIN_QUOTAS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ADMIN_QUOTAS
        },
        {
          title: PATH_NAME_MAP.PATH_ADMIN_SESSIONS ?? '',
          link: PATH.PATH_ADMIN_SESSIONS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ADMIN_SESSIONS
        },
        {
          title: PATH_NAME_MAP.PATH_ADMIN_OPS_LOGS ?? '',
          link: PATH.PATH_ADMIN_OPS_LOGS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ADMIN_OPS_LOGS
        }
      ]
    },
    {
      icon: ShieldUserIcon,
      title: 'nav.roleManagement',
      link: PATH.PATH_USERS,
      subLinks: [
        {
          title: PATH_NAME_MAP.PATH_ROLES ?? '',
          link: PATH.PATH_ROLES,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ROLES
        },
        {
          title: PATH_NAME_MAP.PATH_ROLES_PERMISSION ?? '',
          link: PATH.PATH_ROLES_PERMISSION,
          icon: LogsIcon,
          pageKey: PAGE_KEY.ROLES_PERMISSION
        }
      ]
    },
    {
      icon: CreditCardIcon,
      title: 'nav.paymentChannelMgmt',
      link: PATH.PATH_PAYMENT_CHANNELS,
      subLinks: [
        {
          title: PATH_NAME_MAP.PATH_PAYMENT_CHANNELS ?? '',
          link: PATH.PATH_PAYMENT_CHANNELS,
          icon: LogsIcon,
          pageKey: PAGE_KEY.PAYMENT_CHANNELS
        }
      ]
    }
  ]
};

const isVisibleForBrand = ({ isFmOnly, isSoOnly }: INavSubLink): boolean =>
  (!isFmOnly || !isBrandSo()) && (!isSoOnly || isBrandSo());

const isReadAllowed = (permissions: AdminRolePermEntry[], pageKey?: string): boolean => {
  if (!pageKey) return true;

  const entry = permissions.find(
    permission => permission.type === 'page' && permission.pageKey === pageKey
  );

  return entry?.canRead === true;
};

const buildNavSubLinks = (
  subLinks: readonly INavSubLink[],
  permissions: AdminRolePermEntry[]
): INavSubLink[] =>
  subLinks
    .filter(isVisibleForBrand)
    .map(subLink => ({ ...subLink, isDisabled: !isReadAllowed(permissions, subLink.pageKey) }));

/**
 * Links of a category for the current brand, with `isDisabled` set from the
 * role permissions. A group is disabled when every visible sub link is.
 */
export const buildNavLinks = (
  category: TNavCategory,
  permissions: AdminRolePermEntry[]
): INavLink[] =>
  NAV_LINKS_BY_CATEGORY[category].filter(isVisibleForBrand).map(link => {
    if (!link.subLinks?.length) {
      return { ...link, isDisabled: !isReadAllowed(permissions, link.pageKey) };
    }

    const subLinks = buildNavSubLinks(link.subLinks, permissions);
    const isDisabled = subLinks.every(subLink => subLink.isDisabled);

    return { ...link, subLinks, isDisabled };
  });

/**
 * Category whose links contain `pathname`, when there is one.
 */
export const buildNavCategoryForPath = (pathname: string): TNavCategory | undefined =>
  NAV_CATEGORIES.map(({ value }) => value).find(category =>
    NAV_LINKS_BY_CATEGORY[category].some(
      link => link.link === pathname || link.subLinks?.some(subLink => subLink.link === pathname)
    )
  );
