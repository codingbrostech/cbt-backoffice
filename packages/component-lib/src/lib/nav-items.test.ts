import type { TNavItem } from '@cbt-bo/component-lib/lib/nav-items';
import {
  buildActiveGroupKey,
  buildActiveNavKey,
  containsActiveKey
} from '@cbt-bo/component-lib/lib/nav-items';

const ITEMS = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: null,
    pageKey: 'dashboard',
    path: '/dashboard'
  },
  {
    key: 'game',
    label: 'Game',
    icon: null,
    pageKey: 'game',
    children: [
      { key: 'games', label: 'Games', icon: null, pageKey: 'games', path: '/games' },
      {
        key: 'game-rounds-group',
        label: 'Game Rounds',
        icon: null,
        pageKey: 'gameRounds',
        children: [
          {
            key: 'game-round-logs',
            label: 'Game Round Logs',
            icon: null,
            pageKey: 'games',
            path: '/game-round-logs'
          }
        ]
      }
    ]
  }
] as const satisfies TNavItem[];

describe('containsActiveKey', () => {
  describe('when the item itself matches', () => {
    it('should return true', () => {
      expect(containsActiveKey(ITEMS[0], 'dashboard')).toBe(true);
    });
  });

  describe('when a nested grandchild matches', () => {
    it('should return true', () => {
      expect(containsActiveKey(ITEMS[1], 'game-round-logs')).toBe(true);
    });
  });

  describe('when nothing in the subtree matches', () => {
    it('should return false', () => {
      expect(containsActiveKey(ITEMS[1], 'unknown')).toBe(false);
    });
  });
});

describe('buildActiveGroupKey', () => {
  describe('when the active key belongs to a direct group child', () => {
    it('should return the parent group key', () => {
      expect(buildActiveGroupKey(ITEMS, 'games')).toBe('game');
    });
  });

  describe('when the active key belongs to a nested grandchild', () => {
    it('should return the top-level group key', () => {
      expect(buildActiveGroupKey(ITEMS, 'game-round-logs')).toBe('game');
    });
  });

  describe('when the active key is a top-level leaf', () => {
    it('should return undefined', () => {
      expect(buildActiveGroupKey(ITEMS, 'dashboard')).toBeUndefined();
    });
  });

  describe('when the active key matches nothing', () => {
    it('should return undefined', () => {
      expect(buildActiveGroupKey(ITEMS, 'unknown')).toBeUndefined();
    });
  });
});

describe('buildActiveNavKey', () => {
  describe('when the path matches a top-level leaf', () => {
    it('should return its key', () => {
      expect(buildActiveNavKey(ITEMS, '/dashboard')).toBe('dashboard');
    });
  });

  describe('when the path matches a group child', () => {
    it('should return the child key', () => {
      expect(buildActiveNavKey(ITEMS, '/games')).toBe('games');
    });
  });

  describe('when the path matches a nested grandchild', () => {
    it('should return the grandchild key', () => {
      expect(buildActiveNavKey(ITEMS, '/game-round-logs')).toBe('game-round-logs');
    });
  });

  describe('when the path matches nothing', () => {
    it('should return undefined', () => {
      expect(buildActiveNavKey(ITEMS, '/unknown')).toBeUndefined();
    });
  });
});
