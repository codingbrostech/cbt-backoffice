import { withIsLike } from './with-is-like';

describe('withIsLike', () => {
  describe('when given a value', () => {
    it('should prefix it for fuzzy matching', () => {
      expect(withIsLike('ada')).toBe('like:ada');
    });
  });

  describe('when given a blank value', () => {
    it('should stay blank', () => {
      expect(withIsLike('')).toBe('');
    });
  });
});
