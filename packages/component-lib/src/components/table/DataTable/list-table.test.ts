import {
  type IDataTableColumn,
  buildDataTableRows,
  buildDefaultRowId,
  buildPageCount,
  buildPinOffsets,
  buildPinnedColumns,
  buildVisibleColumns
} from './list-table';

const COLUMNS: IDataTableColumn<{ name: string }>[] = [
  { key: 'code', title: 'Code', render: () => null },
  { key: 'name', title: 'Name', render: ({ name }) => name }
];

describe('buildDefaultRowId', () => {
  describe('when the row carries an id', () => {
    it('should use the id', () => {
      expect(buildDefaultRowId({ id: 7 }, 3)).toBe('7');
    });
  });

  describe('when the row has no id', () => {
    it('should fall back to the row index', () => {
      expect(buildDefaultRowId({ name: 'Ada' }, 3)).toBe('3');
    });
  });
});

describe('buildVisibleColumns', () => {
  describe('when no visibility is set', () => {
    it('should keep every column', () => {
      expect(buildVisibleColumns(COLUMNS, {})).toHaveLength(2);
    });
  });

  describe('when a column is set to false', () => {
    it('should drop only that column', () => {
      const keys = buildVisibleColumns(COLUMNS, { code: false }).map(({ key }) => key);

      expect(keys).toEqual(['name']);
    });
  });
});

describe('buildPageCount', () => {
  describe('when 45 rows are listed twenty per page', () => {
    it('should round up to three pages', () => {
      expect(buildPageCount(45, 20)).toBe(3);
    });
  });

  describe('when the list is empty', () => {
    it('should still report one page', () => {
      expect(buildPageCount(0, 20)).toBe(1);
    });
  });
});

describe('buildDataTableRows', () => {
  describe('when rows are rendered through the columns', () => {
    it('should key each row by its id and each cell by its column key', () => {
      const rows = buildDataTableRows(COLUMNS, [{ name: 'Ada' }], (_row, index) => `r${index}`);

      expect(rows).toEqual([{ id: 'r0', cells: { code: null, name: 'Ada' } }]);
    });
  });
});

describe('buildPinnedColumns', () => {
  const PIN_COLUMNS: IDataTableColumn<unknown>[] = [
    { key: 'a', title: 'A', fixed: 'start', render: () => null },
    { key: 'b', title: 'B', render: () => null },
    { key: 'c', title: 'C', render: () => null },
    { key: 'd', title: 'D', render: () => null }
  ];

  describe('when no pinning is set', () => {
    it('should keep the order and each fixed edge', () => {
      const columns = buildPinnedColumns(PIN_COLUMNS, {});

      expect(columns.map(({ key, fixed }) => [key, fixed])).toEqual([
        ['a', 'start'],
        ['b', undefined],
        ['c', undefined],
        ['d', undefined]
      ]);
    });
  });

  describe('when columns are pinned to both edges', () => {
    it('should move the start pins first and the end pins last', () => {
      const columns = buildPinnedColumns(PIN_COLUMNS, { c: 'start', b: 'end' });

      expect(columns.map(({ key }) => key)).toEqual(['a', 'c', 'd', 'b']);
    });
  });

  describe('when a fixed column is unpinned', () => {
    it('should drop its fixed edge', () => {
      const [column] = buildPinnedColumns(PIN_COLUMNS, { a: false });

      expect(column).toMatchObject({ key: 'a', fixed: undefined });
    });
  });
});

describe('buildPinOffsets', () => {
  describe('when two columns are pinned to each edge', () => {
    it('should offset each one by the widths between it and its edge', () => {
      const offsets = buildPinOffsets(
        [
          { key: 'a', title: 'A', fixed: 'start' },
          { key: 'b', title: 'B', fixed: 'start' },
          { key: 'c', title: 'C' },
          { key: 'd', title: 'D', fixed: 'end' },
          { key: 'e', title: 'E', fixed: 'end' }
        ],
        { a: 100, b: 150, c: 200, d: 120, e: 80 },
        { start: 0, end: 0 }
      );

      expect(offsets).toEqual({ a: 0, b: 100, e: 0, d: 80 });
    });
  });

  describe('when the scroll container has inline padding', () => {
    it('should pull each edge back by the padding on that edge', () => {
      const offsets = buildPinOffsets(
        [
          { key: 'a', title: 'A', fixed: 'start' },
          { key: 'b', title: 'B', fixed: 'start' },
          { key: 'c', title: 'C' },
          { key: 'd', title: 'D', fixed: 'end' }
        ],
        { a: 100, b: 150, c: 200, d: 120 },
        { start: 20, end: 16 }
      );

      expect(offsets).toEqual({ a: -20, b: 80, d: -16 });
    });
  });
});
