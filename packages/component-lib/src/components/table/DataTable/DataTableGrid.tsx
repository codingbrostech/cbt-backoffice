import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import DataTableColumnMenu from '@cbt-bo/component-lib/components/table/DataTable/DataTableColumnMenu';
import DataTableSortableRow from '@cbt-bo/component-lib/components/table/DataTable/DataTableSortableRow';
import { useDataTable } from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
import {
  type IDataTableColumnMeta,
  type IDataTableRow,
  buildPinOffsets,
  buildPinnedColumns,
  buildVisibleColumns
} from '@cbt-bo/component-lib/components/table/DataTable/list-table';
import { useColumnWidths } from '@cbt-bo/component-lib/components/table/DataTable/use-column-widths';
import { useIsOverflowingX } from '@cbt-bo/component-lib/components/table/DataTable/use-is-overflowing-x';
import { useScrollPaddingX } from '@cbt-bo/component-lib/components/table/DataTable/use-scroll-padding-x';
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

type TFixedEdge = NonNullable<IDataTableColumnMeta['fixed']>;

const COLUMN_CELL_CLASS_NAME = 'px-4 first:pl-2 last:pr-2';

const FIXED_CELL_CLASS_NAME = 'sticky z-[1]';

const FIXED_EDGE_CLASS_NAMES = {
  start: 'shadow-[inset_-1px_0_0_var(--color-border)]',
  end: 'shadow-[inset_1px_0_0_var(--color-border)]'
} as const satisfies Record<TFixedEdge, string>;

const FIXED_OFFSET_PROPERTIES = {
  start: 'left',
  end: 'right'
} as const satisfies Record<TFixedEdge, string>;

const FIXED_BODY_CELL_CLASS_NAME =
  'bg-background [tr:hover>&]:bg-[color-mix(in_oklab,var(--background),var(--muted)_50%)]';

const HIGHLIGHTED_ROW_CLASS_NAME =
  'bg-primary/10 shadow-[inset_2px_0_0_0_var(--color-primary)] hover:bg-primary/15';

const HIGHLIGHTED_FIXED_CELL_CLASS_NAME =
  'bg-[color-mix(in_oklab,var(--background),var(--primary)_10%)] [tr:hover>&]:bg-[color-mix(in_oklab,var(--background),var(--primary)_15%)]';

const buildEdgeKeys = (columns: readonly IDataTableColumnMeta[]): Record<TFixedEdge, string> => {
  const startColumns = columns.filter(({ fixed }) => fixed === 'start');
  const endColumns = columns.filter(({ fixed }) => fixed === 'end');

  const { key: start = '' } = startColumns.at(-1) ?? {};
  const { key: end = '' } = endColumns.at(0) ?? {};

  return { start, end };
};

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
  const {
    labels,
    columns,
    rows,
    columnVisibility,
    columnPinning,
    isColumnPinnable,
    onRowReorder,
    highlightedRowId,
    isLoading,
    isError,
    isPageScroll
  } = useDataTable();

  const shownColumns = buildVisibleColumns(columns, columnVisibility);
  const visibleColumns = buildPinnedColumns(shownColumns, columnPinning);
  const visibleKeys = visibleColumns.map(({ key }) => key);

  const { ref: tableRef, isOverflowing } = useIsOverflowingX<HTMLTableElement>();
  const { ref: headerRowRef, widths } = useColumnWidths<HTMLTableRowElement>(visibleKeys);
  const scrollPadding = useScrollPaddingX(tableRef);

  const pinOffsets = buildPinOffsets(visibleColumns, widths, scrollPadding);
  const edgeKeys = buildEdgeKeys(visibleColumns);
  const emptyLabel = buildEmptyLabel(labels, isLoading, isError);
  const rowIds = rows.map(({ id }) => id);

  const buildCellProps = ({ key, fixed }: IDataTableColumnMeta, fixedClassName: string) =>
    isOverflowing && fixed
      ? {
          className: cn(
            COLUMN_CELL_CLASS_NAME,
            FIXED_CELL_CLASS_NAME,
            edgeKeys[fixed] === key && FIXED_EDGE_CLASS_NAMES[fixed],
            fixedClassName
          ),
          style: { [FIXED_OFFSET_PROPERTIES[fixed]]: pinOffsets[key] ?? 0 }
        }
      : { className: COLUMN_CELL_CLASS_NAME };

  const renderCells = ({ cells }: IDataTableRow, isHighlighted: boolean) =>
    visibleColumns.map(column => (
      <TableCell
        key={column.key}
        {...buildCellProps(
          column,
          isHighlighted ? HIGHLIGHTED_FIXED_CELL_CLASS_NAME : FIXED_BODY_CELL_CLASS_NAME
        )}
      >
        {cells[column.key]}
      </TableCell>
    ));

  const renderRows = () =>
    rows.map(row => {
      const isHighlighted = row.id === highlightedRowId;
      const rowClassName = isHighlighted ? HIGHLIGHTED_ROW_CLASS_NAME : undefined;

      return onRowReorder ? (
        <DataTableSortableRow key={row.id} id={row.id} className={rowClassName}>
          {renderCells(row, isHighlighted)}
        </DataTableSortableRow>
      ) : (
        <TableRow key={row.id} className={rowClassName}>
          {renderCells(row, isHighlighted)}
        </TableRow>
      );
    });

  return (
    <div className={cn('relative flex flex-col', !isPageScroll && 'min-h-0 flex-1', className)}>
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
        containerClassName={cn(
          isPageScroll
            ? 'overflow-x-visible'
            : 'min-h-0 flex-1 overflow-y-auto [scrollbar-color:var(--color-border)_transparent] [scrollbar-width:thin]'
        )}
      >
        <TableHeader className="sticky top-0 z-10 bg-card">
          <TableRow ref={headerRowRef}>
            {visibleColumns.map(column => {
              const { key, title, width, fixed } = column;
              const { className: headClassName, style } = buildCellProps(column, 'bg-card');

              return (
                <TableHead
                  key={key}
                  data-column-key={key}
                  style={{ width, ...style }}
                  className={headClassName}
                >
                  {isColumnPinnable ? (
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate">{title}</span>
                      <DataTableColumnMenu columnKey={key} title={title} pin={fixed} />
                    </div>
                  ) : (
                    title
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? (
            <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
              {renderRows()}
            </SortableContext>
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
