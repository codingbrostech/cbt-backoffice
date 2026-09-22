import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { parseListSearch } from './use-list-search';

const schema = z.object({
  page: z.number().int().min(1).default(1),
  code: z.string().optional(),
  labels: z.array(z.string()).optional()
});

describe('parseListSearch', () => {
  describe('when every param satisfies the schema', () => {
    it('should return the parsed search', () => {
      expect(parseListSearch(schema, { page: 2, code: 'abc' })).toEqual({ page: 2, code: 'abc' });
    });
  });

  describe('when a param is rejected', () => {
    it('should drop only that param', () => {
      expect(parseListSearch(schema, { page: 0, code: 'abc' })).toEqual({ page: 1, code: 'abc' });
    });

    it('should drop every rejected param', () => {
      expect(parseListSearch(schema, { page: 'x', code: 123, labels: 'a' })).toEqual({ page: 1 });
    });
  });

  describe('when the search is not an object', () => {
    it('should return the defaults', () => {
      expect(parseListSearch(schema, 'nope')).toEqual({ page: 1 });
    });
  });
});

describe('buildListSearchSchema text fields', () => {
  describe('when the route carries a numeric-looking value', () => {
    it('should keep it as a string', async () => {
      const { buildListSearchSchema } = await import('~/table/search-values');
      const listSchema = buildListSearchSchema([{ label: 'mobile', name: 'mobile' }]);

      expect(parseListSearch(listSchema, { mobile: 961 })).toEqual({
        page: 1,
        pageSize: 10,
        mobile: '961'
      });
    });
  });
});
