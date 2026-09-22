import { describe, expect, it } from 'vitest';

import { moveItem } from './array';

describe('moveItem', () => {
  describe('when the source index exists', () => {
    it('should move the item to the target position', () => {
      expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a']);
    });

    it('should leave the input untouched', () => {
      const items = ['a', 'b', 'c'];

      moveItem(items, 2, 0);

      expect(items).toEqual(['a', 'b', 'c']);
    });
  });

  describe('when the source index is out of range', () => {
    it('should keep the order', () => {
      expect(moveItem(['a', 'b'], 5, 0)).toEqual(['a', 'b']);
    });
  });
});
