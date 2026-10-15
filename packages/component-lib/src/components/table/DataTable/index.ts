import DataTableColumnToggle from '@cbt-bo/component-lib/components/table/DataTable/DataTableColumnToggle';
import DataTableGrid from '@cbt-bo/component-lib/components/table/DataTable/DataTableGrid';
import DataTablePagination from '@cbt-bo/component-lib/components/table/DataTable/DataTablePagination';
import DataTableRoot from '@cbt-bo/component-lib/components/table/DataTable/DataTableRoot';
import DataTableToolbar from '@cbt-bo/component-lib/components/table/DataTable/DataTableToolbar';

export type {
  IDataTableColumnMenuLabels,
  IDataTableColumnMenuProps
} from '@cbt-bo/component-lib/components/table/DataTable/DataTableColumnMenu';
export type { IDataTableColumnToggleLabels } from '@cbt-bo/component-lib/components/table/DataTable/DataTableColumnToggle';
export type {
  IDataTableGridLabels,
  IDataTableGridProps
} from '@cbt-bo/component-lib/components/table/DataTable/DataTableGrid';
export type { IDataTablePaginationLabels } from '@cbt-bo/component-lib/components/table/DataTable/DataTablePagination';
export type { TDataTableLabels } from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
export type { IDataTableRootProps } from '@cbt-bo/component-lib/components/table/DataTable/DataTableRoot';
export type { IDataTableToolbarProps } from '@cbt-bo/component-lib/components/table/DataTable/DataTableToolbar';

/**
 * Compound server-paginated list table. The data and labels go on `Root`.
 *
 * @example
 * <DataTable.Root columns={columns} data={rows} total={total} labels={labels} params={params} onParamsChange={setParams}>
 *   <DataTable.Toolbar>
 *     <DataTable.ColumnToggle />
 *   </DataTable.Toolbar>
 *   <DataTable.Grid />
 *   <DataTable.Pagination />
 * </DataTable.Root>
 */
const DataTable = {
  Root: DataTableRoot,
  Toolbar: DataTableToolbar,
  ColumnToggle: DataTableColumnToggle,
  Grid: DataTableGrid,
  Pagination: DataTablePagination
};

export default DataTable;
