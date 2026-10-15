import { buildOffsetSuffix, buildOffsetTime } from './time';

describe('buildOffsetSuffix', () => {
  describe('when the offset is east of UTC', () => {
    it('should render a plus sign', () => {
      expect(buildOffsetSuffix(480)).toBe('+08:00');
    });
  });

  describe('when the offset is west of UTC with minutes', () => {
    it('should render a minus sign and the minutes', () => {
      expect(buildOffsetSuffix(-570)).toBe('-09:30');
    });
  });

  describe('when the offset is zero', () => {
    it('should render a plus sign', () => {
      expect(buildOffsetSuffix(0)).toBe('+00:00');
    });
  });
});

describe('buildOffsetTime', () => {
  describe('when the value is filled', () => {
    it('should append the seconds and the offset', () => {
      expect(buildOffsetTime('2026-10-13T08:30', 480)).toBe('2026-10-13T08:30:00+08:00');
    });
  });

  describe('when the value is a range end', () => {
    it('should cover the whole minute', () => {
      expect(buildOffsetTime('2026-10-13T23:59', 480, true)).toBe('2026-10-13T23:59:59+08:00');
    });
  });

  describe('when the value is blank', () => {
    it('should stay blank', () => {
      expect(buildOffsetTime('', 480)).toBe('');
    });
  });
});
