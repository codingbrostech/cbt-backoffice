import { buildPaginationRange } from './build-pagination-range';

describe('buildPaginationRange', () => {
  describe('when there are no pages', () => {
    it('should return nothing', () => {
      expect(buildPaginationRange(1, 0)).toEqual([]);
    });
  });

  describe('when every page fits in the window', () => {
    it('should list them all without an ellipsis', () => {
      expect(buildPaginationRange(2, 3)).toEqual([1, 2, 3]);
    });
  });

  describe('when the current page is at the start', () => {
    it('should open the window at page one with a trailing ellipsis', () => {
      expect(buildPaginationRange(1, 10)).toEqual([1, 2, 3, 4, 5, 'ellipsis']);
    });
  });

  describe('when the current page is in the middle', () => {
    it('should center the window with an ellipsis on both sides', () => {
      expect(buildPaginationRange(5, 10)).toEqual(['ellipsis', 3, 4, 5, 6, 7, 'ellipsis']);
    });
  });

  describe('when the current page is at the end', () => {
    it('should close the window on the last page with a leading ellipsis', () => {
      expect(buildPaginationRange(10, 10)).toEqual(['ellipsis', 6, 7, 8, 9, 10]);
    });
  });
});
