import type { AdminRolePermEntry } from '@cbt-bo/api-schema/bo-fm/models';

import { configurePortal } from '~/config';

import { buildNavCategoryForPath, buildNavLinks } from './nav-links';

const readable = (pageKey: string): AdminRolePermEntry => ({
  pageKey,
  type: 'page',
  canRead: true
});

describe('buildNavLinks', () => {
  describe('when the brand is FM', () => {
    beforeEach(() => {
      configurePortal({ brand: 'FM' });
    });

    it('should hide SO-only groups and disable links without read permission', () => {
      const links = buildNavLinks('finance', [readable('bet-trans')]);

      expect(links.map(link => link.title)).toEqual(['nav.reports']);

      const [reports] = links;
      const betTrans = reports?.subLinks?.find(subLink => subLink.link === '/reports/bet-trans');
      const ledger = reports?.subLinks?.find(subLink => subLink.link === '/reports/ledger-trans');

      expect(reports?.isDisabled).toBe(false);
      expect(betTrans?.isDisabled).toBe(false);
      expect(ledger?.isDisabled).toBe(true);
    });

    it('should keep FM-only links', () => {
      const links = buildNavLinks('player', []);

      expect(links.some(link => link.link === '/players/vip-levels')).toBe(true);
    });
  });

  describe('when the brand is SO', () => {
    beforeEach(() => {
      configurePortal({ brand: 'SO' });
    });

    it('should show the ACSC group and drop FM-only links', () => {
      const finance = buildNavLinks('finance', []);
      const player = buildNavLinks('player', []);

      expect(finance.map(link => link.title)).toEqual(['nav.reports', 'nav.acsc']);
      expect(player.some(link => link.link === '/players/vip-levels')).toBe(false);
    });

    it('should disable a group when every sub link is disabled', () => {
      const [reports] = buildNavLinks('finance', []);

      expect(reports?.isDisabled).toBe(true);
    });
  });
});

describe('buildNavCategoryForPath', () => {
  describe('when the path belongs to a category', () => {
    it('should return that category', () => {
      expect(buildNavCategoryForPath('/admins')).toBe('setting');
      expect(buildNavCategoryForPath('/reports/bet-trans')).toBe('finance');
      expect(buildNavCategoryForPath('/dashboard')).toBe('home');
    });
  });

  describe('when the path is unknown', () => {
    it('should return undefined', () => {
      expect(buildNavCategoryForPath('/nowhere')).toBeUndefined();
    });
  });
});
