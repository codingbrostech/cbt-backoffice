import {
  type IDataTableColumn,
  buildDataTableRows,
  buildDefaultRowId,
  buildPageCount,
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
