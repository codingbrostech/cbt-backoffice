import { describe, expect, it } from 'vitest';

import { buildListParams, buildListSearchSchema, normalizeSearchValues } from './search-values';
import { buildSearchWithClearedDefaults } from './use-list-page';

const FIELDS = [
  { label: 'state', name: 'state', inputType: 'select' as const, options: [] },
  { label: 'code', name: 'code' }
];

describe('buildSearchWithClearedDefaults', () => {
  describe('when a defaulted field was cleared', () => {
    it('should write an explicit empty value', () => {
      const search = buildSearchWithClearedDefaults(
        { page: 1, pageSize: 10, state: undefined, code: 'abc' },
        { state: 'active' }
      );

      expect(search).toEqual({ page: 1, pageSize: 10, state: '', code: 'abc' });
    });

    it('should round-trip through the route as a cleared filter', () => {
      const schema = buildListSearchSchema(FIELDS);
      const parsed = schema.parse({ page: 1, pageSize: 10, state: '' });
      const search = normalizeSearchValues(FIELDS, { state: 'active', ...parsed });

      expect(search.state).toBeUndefined();
      expect(buildListParams<{ state?: string }>(FIELDS, search).state).toBeUndefined();
    });
  });

  describe('when a defaulted field keeps a value', () => {
    it('should leave it untouched', () => {
      const search = buildSearchWithClearedDefaults(
        { page: 1, pageSize: 10, state: 'inactive' },
        { state: 'active' }
      );

      expect(search.state).toBe('inactive');
    });
  });

  describe('when the default is a list', () => {
    it('should write an empty list', () => {
      const search = buildSearchWithClearedDefaults(
        { page: 1, pageSize: 10, labels: undefined },
        { labels: ['vip'] }
      );

      expect(search.labels).toEqual([]);
    });
  });
});
