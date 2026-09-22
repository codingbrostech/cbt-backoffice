import { describe, expect, it } from 'vitest';

import { buildDefaultRowId } from './use-list-table';

describe('buildDefaultRowId', () => {
  describe('when the row carries an id', () => {
    it('should use the id', () => {
      expect(buildDefaultRowId({ id: 'p-1' }, 3)).toBe('p-1');
      expect(buildDefaultRowId({ id: 42 }, 3)).toBe('42');
    });
  });

  describe('when the row has no usable id', () => {
    it('should fall back to the index', () => {
      expect(buildDefaultRowId({ code: 'x' }, 3)).toBe('3');
      expect(buildDefaultRowId({ id: null }, 3)).toBe('3');
    });
  });
});
