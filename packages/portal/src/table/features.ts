import {
  type PaginationState,
  type ReactTable,
  type RowData,
  type RowSelectionState,
  type TableState,
  columnSizingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures
} from '@tanstack/react-table';

export const TABLE_FEATURES = tableFeatures({
  rowPaginationFeature,
  columnSizingFeature,
  rowSelectionFeature
});

export type TTableFeatures = typeof TABLE_FEATURES;

export interface ISelectedTableState {
  pagination: PaginationState;
  rowSelection: RowSelectionState;
}

export type TPortalTable<TRow extends RowData> = ReactTable<
  TTableFeatures,
  TRow,
  ISelectedTableState
>;

export const selectTableState = ({
  pagination,
  rowSelection
}: TableState<TTableFeatures>): ISelectedTableState => ({ pagination, rowSelection });
