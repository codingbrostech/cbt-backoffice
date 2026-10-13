import { useDataTable } from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
import {
  type IDataTableColumnMeta,
  buildVisibleColumns
} from '@cbt-bo/component-lib/components/table/DataTable/list-table';
import { useIsOverflowingX } from '@cbt-bo/component-lib/components/table/DataTable/use-is-overflowing-x';
import { Spinner } from '@cbt-bo/component-lib/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@cbt-bo/component-lib/components/ui/table';
import { cn } from '@cbt-bo/component-lib/lib/utils';

const MIN_COLUMN_WIDTH = 120;

export interface IDataTableGridLabels {
  noData: string;
  loading: string;
  loadFailed: string;
}

export interface IDataTableGridProps {
  className?: string;
}

const FIXED_CELL_CLASS_NAMES = {
  start: 'sticky left-0 z-[1]',
  end: 'sticky right-0 z-[1]'
} as const satisfies Record<NonNullable<IDataTableColumnMeta['fixed']>, string>;

const FIXED_BODY_CELL_CLASS_NAME =
  'bg-background [tr:hover>&]:bg-[color-mix(in_oklab,var(--background),var(--muted)_50%)]';

const buildEmptyLabel = (
  labels: IDataTableGridLabels,
  isLoading: boolean,
  isError: boolean
): string => {
  if (isLoading) return labels.loading;
  if (isError) return labels.loadFailed;

  return labels.noData;
};

/**
 * The table body with a sticky header, exposed as `DataTable.Grid`. Shows a
 * message row while the list is empty, loading or failed.
 */
const DataTableGrid = ({ className }: IDataTableGridProps) => {
  const { labels, columns, rows, columnVisibility, isLoading, isError } = useDataTable();

  const { ref: tableRef, isOverflowing } = useIsOverflowingX<HTMLTableElement>();

  const visibleColumns = buildVisibleColumns(columns, columnVisibility);
  const emptyLabel = buildEmptyLabel(labels, isLoading, isError);

  return (
    <div className={cn('relative flex min-h-0 flex-1 flex-col', className)}>
      {isLoading && (
        <div
          aria-busy="true"
          className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[1px]"
        >
          <Spinner className="size-6" />
        </div>
      )}
      <Table
        ref={tableRef}
        className="table-fixed"
        style={{ minWidth: visibleColumns.length * MIN_COLUMN_WIDTH }}
        containerClassName="min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]"
      >
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow>
            {visibleColumns.map(({ key, title, width, fixed }) => (
              <TableHead
                key={key}
                style={{ width }}
                className={cn(isOverflowing && fixed && [FIXED_CELL_CLASS_NAMES[fixed], 'bg-card'])}
              >
                {title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map(({ id, cells }) => (
              <TableRow key={id}>
                {visibleColumns.map(({ key, fixed }) => (
                  <TableCell
                    key={key}
                    className={cn(
                      isOverflowing &&
                        fixed && [FIXED_CELL_CLASS_NAMES[fixed], FIXED_BODY_CELL_CLASS_NAME]
                    )}
                  >
                    {cells[key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyLabel}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTableGrid;
