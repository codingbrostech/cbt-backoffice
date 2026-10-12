import { buildOffsetDateLabel } from '@cbt-bo/component-lib/components/header/TimezoneClock/utils';

describe('buildOffsetDateLabel', () => {
  describe('when the offset is positive', () => {
    it('should shift the date forward', () => {
      const date = new Date('2026-01-01T00:00:00.000Z');

      expect(buildOffsetDateLabel(date, 480)).toBe('2026-01-01 08:00:00');
    });
  });

  describe('when the offset is negative and crosses a day boundary', () => {
    it('should roll the date back a day', () => {
      const date = new Date('2026-01-01T00:00:00.000Z');

      expect(buildOffsetDateLabel(date, -300)).toBe('2025-12-31 19:00:00');
    });
  });

  describe('when the offset is zero', () => {
    it('should return the UTC time unchanged', () => {
      const date = new Date('2026-01-01T12:34:56.000Z');

      expect(buildOffsetDateLabel(date, 0)).toBe('2026-01-01 12:34:56');
    });
  });
});
