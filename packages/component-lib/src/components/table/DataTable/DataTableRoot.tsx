import type { ReactNode } from 'react';

import {
  DataTableContext,
  type TDataTableLabels
} from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
import {
  type IDataTableColumn,
  type IListParams,
  type TColumnVisibility,
  buildDataTableRows,
  buildDefaultRowId
} from '@cbt-bo/component-lib/components/table/DataTable/list-table';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IDataTableRootProps<TRow> {
  columns: readonly IDataTableColumn<TRow>[];
  data: readonly TRow[];
  total: number;
  labels: TDataTableLabels;
  params: IListParams;
  onParamsChange: (params: IListParams) => void;
  columnVisibility?: TColumnVisibility;
  onColumnVisibilityChange?: (columnVisibility: TColumnVisibility) => void;
  getRowId?: (row: TRow, index: number) => string;
  isLoading?: boolean;
  isError?: boolean;
  /**
   * The table's parts, usually `DataTable.Toolbar`, `DataTable.Grid` and
   * `DataTable.Pagination`.
   */
  children: ReactNode;
  className?: string;
}

const IGNORE_VISIBILITY_CHANGE = (): void => undefined;

/**
 * Root of a server-paginated list table, exposed as `DataTable.Root`. Shares
 * the caller's params and column visibility with the other parts.
 *
 * @example
 * <DataTable.Root columns={columns} data={rows} total={total} labels={labels} params={params} onParamsChange={setParams}>
 *   <DataTable.Grid />
 *   <DataTable.Pagination />
 * </DataTable.Root>
 */
const DataTableRoot = <TRow,>({
  columns,
  data,
  total,
  labels,
  params,
  onParamsChange,
  columnVisibility = {},
  onColumnVisibilityChange = IGNORE_VISIBILITY_CHANGE,
  getRowId = buildDefaultRowId,
  isLoading = false,
  isError = false,
  children,
  className
}: IDataTableRootProps<TRow>) => {
  const rows = buildDataTableRows(columns, data, getRowId);

  return (
    <DataTableContext.Provider
      value={{
        columns,
        labels,
        rows,
        total,
        params,
        onParamsChange,
        columnVisibility,
        onColumnVisibilityChange,
        isLoading,
        isError
      }}
    >
      <div data-slot="data-table" className={cn('flex min-h-0 flex-1 flex-col', className)}>
        {children}
      </div>
    </DataTableContext.Provider>
  );
};

export default DataTableRoot;
