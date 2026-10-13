import type { ReactNode } from 'react';

export interface IDataTableColumnMeta {
  key: string;
  title: string;
  width?: number;
  fixed?: 'start' | 'end';
}

export interface IDataTableColumn<TRow> extends IDataTableColumnMeta {
  render: (row: TRow, index: number) => ReactNode;
}

/**
 * Visibility by column key. A column is hidden only when its entry is `false`.
 */
export type TColumnVisibility = Readonly<Record<string, boolean>>;

export interface IListParams {
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const satisfies readonly number[];

const isRowWithId = (row: unknown): row is { id: string | number } =>
  typeof row === 'object' &&
  row !== null &&
  'id' in row &&
  (typeof row.id === 'string' || typeof row.id === 'number');

/**
 * Default row key. The row's `id` when it has one, otherwise its index.
 */
export const buildDefaultRowId = (row: unknown, index: number): string =>
  isRowWithId(row) ? String(row.id) : String(index);

/**
 * One row with every cell already rendered, keyed by column key. Lets the
 * parts read rows without knowing the row type.
 */
export interface IDataTableRow {
  id: string;
  cells: Readonly<Record<string, ReactNode>>;
}

/**
 * Columns left after dropping every one whose `columnVisibility` entry is `false`.
 */
export const buildVisibleColumns = <TColumn extends IDataTableColumnMeta>(
  columns: readonly TColumn[],
  columnVisibility: TColumnVisibility
): TColumn[] => columns.filter(({ key }) => columnVisibility[key] !== false);

/**
 * Renders every column of every row, so the result no longer depends on the
 * row type. Each row is keyed by `getRowId`.
 */
export const buildDataTableRows = <TRow>(
  columns: readonly IDataTableColumn<TRow>[],
  data: readonly TRow[],
  getRowId: (row: TRow, index: number) => string
): IDataTableRow[] =>
  data.map((row, index) => ({
    id: getRowId(row, index),
    cells: Object.fromEntries(columns.map(({ key, render }) => [key, render(row, index)]))
  }));

export const buildPageCount = (total: number, pageSize: number): number =>
  Math.max(Math.ceil(total / pageSize), 1);
