import type { ReactNode } from 'react';

export type TColumnPin = 'start' | 'end';

export interface IDataTableColumnMeta {
  key: string;
  title: string;
  width?: number;
  fixed?: TColumnPin;
}

export interface IDataTableColumn<TRow> extends IDataTableColumnMeta {
  render: (row: TRow, index: number) => ReactNode;
}

/**
 * Visibility by column key. A column is hidden only when its entry is `false`.
 */
export type TColumnVisibility = Readonly<Record<string, boolean>>;

/**
 * Pin by column key. An entry overrides the column's `fixed`, and `false`
 * unpins it.
 */
export type TColumnPinning = Readonly<Record<string, TColumnPin | false>>;

/**
 * Rendered width in pixels by column key.
 */
export type TColumnWidths = Readonly<Record<string, number>>;

/**
 * Inline padding in pixels of the scroll container, by pin edge.
 */
export type TScrollPaddingX = Readonly<Record<TColumnPin, number>>;

export interface IListParams {
  page: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const satisfies readonly number[];

export enum ETableView {
  SIMPLE = 'simple',
  DETAIL = 'detail'
}

export const TABLE_VIEWS = Object.values(ETableView);

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

export const isColumnPin = (value: string): value is TColumnPin =>
  value === 'start' || value === 'end';

const buildColumnPin = (
  { key, fixed }: IDataTableColumnMeta,
  columnPinning: TColumnPinning
): TColumnPin | undefined => {
  const pin = columnPinning[key];
  if (pin === undefined) return fixed;

  return pin || undefined;
};

/**
 * Columns with `fixed` resolved through `columnPinning`, ordered so the
 * `start` pins lead and the `end` pins trail.
 */
export const buildPinnedColumns = <TColumn extends IDataTableColumnMeta>(
  columns: readonly TColumn[],
  columnPinning: TColumnPinning
): TColumn[] => {
  const resolvedColumns = columns.map(column => ({
    ...column,
    fixed: buildColumnPin(column, columnPinning)
  }));

  const startColumns = resolvedColumns.filter(({ fixed }) => fixed === 'start');
  const centerColumns = resolvedColumns.filter(({ fixed }) => !fixed);
  const endColumns = resolvedColumns.filter(({ fixed }) => fixed === 'end');

  return [...startColumns, ...centerColumns, ...endColumns];
};

/**
 * Sticky offset in pixels of every pinned column, measured from its own edge
 * as the sum of the widths of the pinned columns between it and that edge,
 * minus the `scrollPadding` on that edge.
 */
export const buildPinOffsets = (
  columns: readonly IDataTableColumnMeta[],
  widths: TColumnWidths,
  scrollPadding: TScrollPaddingX
): Record<string, number> => {
  const { start: startPadding, end: endPadding } = scrollPadding;
  const startColumns = columns.filter(({ fixed }) => fixed === 'start');
  const endColumns = columns.filter(({ fixed }) => fixed === 'end');
  const reversedEndColumns = endColumns.toReversed();

  const buildEdgeOffsets = (edgeColumns: readonly IDataTableColumnMeta[], padding: number) =>
    edgeColumns.map(({ key }, index) => {
      const precedingColumns = edgeColumns.slice(0, index);
      const precedingWidth = precedingColumns.reduce(
        (total, { key: precedingKey }) => total + (widths[precedingKey] ?? 0),
        0
      );
      const offset = precedingWidth - padding;

      return [key, offset] as const;
    });

  const startOffsets = buildEdgeOffsets(startColumns, startPadding);
  const endOffsets = buildEdgeOffsets(reversedEndColumns, endPadding);

  return Object.fromEntries([...startOffsets, ...endOffsets]);
};

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
