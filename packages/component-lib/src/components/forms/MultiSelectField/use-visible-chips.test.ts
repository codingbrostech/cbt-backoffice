import { buildVisibleChipCount } from './use-visible-chips';

const CHIPS = [60, 60, 60];
const BADGE = 30;
const GAP = 4;
const MIN_CHIP = 40;

describe('buildVisibleChipCount', () => {
  describe('when every chip fits', () => {
    it('should show them all without room for the badge', () => {
      expect(buildVisibleChipCount(CHIPS, BADGE, GAP, 188, MIN_CHIP)).toBe(3);
    });
  });

  describe('when the next chip fits only once shrunk', () => {
    it('should count it as the last one', () => {
      expect(buildVisibleChipCount(CHIPS, BADGE, GAP, 150, MIN_CHIP)).toBe(2);
    });
  });

  describe('when the next chip does not fit even shrunk', () => {
    it('should keep room for the badge and its gap', () => {
      expect(buildVisibleChipCount(CHIPS, BADGE, GAP, 130, MIN_CHIP)).toBe(1);
    });
  });

  describe('when not even the first chip fits shrunk beside the badge', () => {
    it('should show no chip', () => {
      expect(buildVisibleChipCount(CHIPS, BADGE, GAP, 50, MIN_CHIP)).toBe(0);
    });
  });

  describe('when there is no chip', () => {
    it('should give zero', () => {
      expect(buildVisibleChipCount([], BADGE, GAP, 150, MIN_CHIP)).toBe(0);
    });
  });
});
