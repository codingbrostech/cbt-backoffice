import { buildTrailingSpan } from './use-trailing-span';

const TRACKS = [200, 200, 200, 200];

describe('buildTrailingSpan', () => {
  describe('when the children fit in one track', () => {
    it('should span one column', () => {
      expect(buildTrailingSpan(TRACKS, 8, [80, 90], 8)).toBe(1);
    });
  });

  describe('when the children need more than one track', () => {
    it('should count the gaps between tracks and children', () => {
      expect(buildTrailingSpan(TRACKS, 8, [170, 97, 88, 95], 8)).toBe(3);
    });

    it('should not round down a sub-pixel overflow', () => {
      expect(buildTrailingSpan(TRACKS, 8, [204.5, 3.6], 0)).toBe(2);
    });
  });

  describe('when the children are wider than the grid', () => {
    it('should span every column', () => {
      expect(buildTrailingSpan(TRACKS, 8, [600, 600], 8)).toBe(4);
    });
  });

  describe('when the parent has no tracks', () => {
    it('should give undefined', () => {
      expect(buildTrailingSpan([0], 0, [80], 8)).toBeUndefined();
    });
  });
});
