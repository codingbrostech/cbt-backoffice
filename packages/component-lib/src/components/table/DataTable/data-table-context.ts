import { createContext, useContext } from 'react';

import type { IDataTableColumnMenuLabels } from '@cbt-bo/component-lib/components/table/DataTable/DataTableColumnMenu';
import type { IDataTableColumnToggleLabels } from '@cbt-bo/component-lib/components/table/DataTable/DataTableColumnToggle';
import type { IDataTableGridLabels } from '@cbt-bo/component-lib/components/table/DataTable/DataTableGrid';
import type { IDataTablePaginationLabels } from '@cbt-bo/component-lib/components/table/DataTable/DataTablePagination';
import type {
  IDataTableColumnMeta,
  IDataTableRow,
  IListParams,
  TColumnPinning,
  TColumnVisibility
} from '@cbt-bo/component-lib/components/table/DataTable/list-table';

/**
 * Every string the table parts render, resolved by the caller and given to
 * `DataTable.Root` once.
 */
export type TDataTableLabels = IDataTableGridLabels &
  IDataTablePaginationLabels &
  IDataTableColumnToggleLabels &
  IDataTableColumnMenuLabels;

export interface IDataTableContext {
  labels: TDataTableLabels;
  columns: readonly IDataTableColumnMeta[];
  rows: readonly IDataTableRow[];
  total: number;
  params: IListParams;
  onParamsChange: (params: IListParams) => void;
  columnVisibility: TColumnVisibility;
  onColumnVisibilityChange: (columnVisibility: TColumnVisibility) => void;
  columnPinning: TColumnPinning;
  onColumnPinningChange: (columnPinning: TColumnPinning) => void;
  isColumnPinnable: boolean;
  /**
   * Set when rows can be dragged into a new order. Receives the dragged row's
   * id and the id of the row it was dropped on.
   */
  onRowReorder?: (activeId: string, overId: string) => void;
  /**
   * Id of the row to mark as the one being worked on, for example while a
   * dialog edits it.
   */
  highlightedRowId?: string;
  isLoading: boolean;
  isError: boolean;
  isPageScroll: boolean;
}

export const DataTableContext = createContext<IDataTableContext | undefined>(undefined);

/**
 * Reads the columns, rows, list params and column visibility shared by the
 * parts inside `DataTable`. Throws when called outside a `DataTable`.
 */
export const useDataTable = (): IDataTableContext => {
  const context = useContext(DataTableContext);
  if (!context) throw new Error('useDataTable must be used within DataTable');

  return context;
};
