import {
  Gamepad2,
  LayoutDashboard,
  LayoutGrid,
  Settings,
  Spade,
  Tag,
  UserCog,
  UserShield,
  Users
} from 'lucide-react';

import type { TNavItem } from '@cbt-bo/component-lib/lib/nav-items';

/**
 * Story fixture covering every item shape NavMenuList and AppSidebar handle.
 * A top-level leaf, a group of leaves, a group with a nested group, and a
 * group made only of nested groups.
 */
export const NAV_ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard />,
    pageKey: 'dashboard',
    path: '/dashboard'
  },
  {
    key: 'player',
    label: 'Player',
    icon: <Users />,
    pageKey: 'player',
    children: [
      {
        key: 'player-mgmt',
        label: 'Player Mgmt',
        icon: <Users />,
        pageKey: 'playerMgmt',
        children: [
          { key: 'players', label: 'Players', pageKey: 'players', path: '/players' },
          {
            key: 'player-sessions',
            label: 'Player Sessions',
            pageKey: 'playerSessions',
            path: '/player-sessions'
          }
        ]
      },
      {
        key: 'player-labels',
        label: 'Player Labels',
        icon: <Tag />,
        pageKey: 'playerLabels',
        path: '/player-labels'
      }
    ]
  },
  {
    key: 'game',
    label: 'Game',
    icon: <Gamepad2 />,
    pageKey: 'game',
    children: [
      { key: 'games', label: 'Games', icon: <Spade />, pageKey: 'games', path: '/games' },
      {
        key: 'game-categories',
        label: 'Game Categories',
        icon: <LayoutGrid />,
        pageKey: 'gameCategories',
        path: '/game-categories'
      }
    ]
  },
  {
    key: 'setting',
    label: 'Setting',
    icon: <Settings />,
    pageKey: 'setting',
    children: [
      {
        key: 'acct-mgmt',
        label: 'Acct Mgmt',
        icon: <UserCog />,
        pageKey: 'acctMgmt',
        children: [{ key: 'admins', label: 'Admins', pageKey: 'admins', path: '/admins' }]
      },
      {
        key: 'role-management',
        label: 'Role Management',
        icon: <UserShield />,
        pageKey: 'roleManagement',
        children: [{ key: 'roles', label: 'Roles', pageKey: 'roles', path: '/roles' }]
      }
    ]
  }
] as const satisfies TNavItem[];

export const PLAYER_NAV_ITEMS = NAV_ITEMS[1].children;
