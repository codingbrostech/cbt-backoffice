import {
  type PaginationState,
  type RowData,
  type RowSelectionState,
  type Updater,
  useTable
} from '@tanstack/react-table';

import type { TColumnDef } from '~/table/build-column-defs';
import { TABLE_FEATURES, type TPortalTable, selectTableState } from '~/table/features';
import type { IListParams } from '~/table/types';

export interface IListSelection<TRow extends RowData> {
  rowSelection: RowSelectionState;
  onRowSelectionChange: (rowSelection: RowSelectionState) => void;
  getRowId: (row: TRow) => string;
  /**
   * Rows failing the check render a disabled checkbox. Defaults to every
   * row being selectable.
   */
  isRowSelectable?: (row: TRow) => boolean;
}

export interface IUseListTableOptions<TRow extends RowData> {
  columns: TColumnDef<TRow>[];
  data: TRow[];
  total: number;
  params: IListParams;
  onParamsChange: (params: IListParams) => void;
  /**
   * Enables the checkbox column with the given controlled selection.
   */
  selection?: IListSelection<TRow>;
}

const EMPTY_SELECTION: RowSelectionState = {};

const isRowWithId = (row: unknown): row is { id: string | number } =>
  typeof row === 'object' &&
  row !== null &&
  'id' in row &&
  (typeof row.id === 'string' || typeof row.id === 'number');

/**
 * Row id for lists without an explicit `getRowId`: the record `id` when the
 * row has one, so per-row state follows the record across pages, and the
 * row index otherwise.
 */
export const buildDefaultRowId = (row: RowData, index: number): string =>
  isRowWithId(row) ? String(row.id) : String(index);

/**
 * Table instance for a server-paginated list. Pagination state mirrors
 * `params`, and page changes are reported through `onParamsChange`.
 */
export const useListTable = <TRow extends RowData>({
  columns,
  data,
  total,
  params,
  onParamsChange,
  selection
}: IUseListTableOptions<TRow>): TPortalTable<TRow> => {
  const pagination: PaginationState = { pageIndex: params.page - 1, pageSize: params.pageSize };
  const rowSelection = selection?.rowSelection ?? EMPTY_SELECTION;

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
    const next = typeof updater === 'function' ? updater(pagination) : updater;

    onParamsChange({ page: next.pageIndex + 1, pageSize: next.pageSize });
  };

  const handleRowSelectionChange = (updater: Updater<RowSelectionState>) => {
    const next = typeof updater === 'function' ? updater(rowSelection) : updater;

    selection?.onRowSelectionChange(next);
  };

  return useTable(
    {
      features: TABLE_FEATURES,
      columns,
      data,
      rowCount: total,
      manualPagination: true,
      state: { pagination, rowSelection },
      onPaginationChange: handlePaginationChange,
      getRowId: selection ? selection.getRowId : buildDefaultRowId,
      ...(selection && {
        enableRowSelection: row =>
          selection.isRowSelectable ? selection.isRowSelectable(row.original) : true,
        onRowSelectionChange: handleRowSelectionChange
      })
    },
    selectTableState
  );
};
