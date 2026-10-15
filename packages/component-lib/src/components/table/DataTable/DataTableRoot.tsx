import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { ReactNode } from 'react';

import {
  DataTableContext,
  type TDataTableLabels
} from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
import {
  type IDataTableColumn,
  type IListParams,
  type TColumnPinning,
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
  columnPinning?: TColumnPinning;
  onColumnPinningChange?: (columnPinning: TColumnPinning) => void;
  getRowId?: (row: TRow, index: number) => string;
  /**
   * Set to let rows be dragged into a new order. Receives the dragged row's
   * id and the id of the row it was dropped on, both from `getRowId`.
   */
  onRowReorder?: (activeId: string, overId: string) => void;
  /**
   * Id of the row to mark as the one being worked on, for example while a
   * dialog edits it.
   */
  highlightedRowId?: string;
  isLoading?: boolean;
  isError?: boolean;
  /**
   * Lets the page scroll as a whole instead of the rows scrolling inside the
   * grid. Pass the same flag to `Page.Root`.
   */
  isPageScroll?: boolean;
  /**
   * The table's parts, usually `DataTable.Toolbar`, `DataTable.Grid` and
   * `DataTable.Pagination`.
   */
  children: ReactNode;
  className?: string;
}

const IGNORE_VISIBILITY_CHANGE = (): void => undefined;
const IGNORE_PINNING_CHANGE = (): void => undefined;

const ROW_DRAG_START_DISTANCE_PX = 4;

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
  columnPinning = {},
  onColumnPinningChange,
  getRowId = buildDefaultRowId,
  onRowReorder,
  highlightedRowId,
  isLoading = false,
  isError = false,
  isPageScroll = false,
  children,
  className
}: IDataTableRootProps<TRow>) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: ROW_DRAG_START_DISTANCE_PX } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const rows = buildDataTableRows(columns, data, getRowId);
  const isColumnPinnable = Boolean(onColumnPinningChange);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || over.id === active.id) return;

    onRowReorder?.(String(active.id), String(over.id));
  };

  const table = (
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
        columnPinning,
        onColumnPinningChange: onColumnPinningChange ?? IGNORE_PINNING_CHANGE,
        isColumnPinnable,
        onRowReorder,
        highlightedRowId,
        isLoading,
        isError,
        isPageScroll
      }}
    >
      <div
        data-slot="data-table"
        className={cn('flex flex-col', !isPageScroll && 'min-h-0 flex-1', className)}
      >
        {children}
      </div>
    </DataTableContext.Provider>
  );

  if (!onRowReorder) return table;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      {table}
    </DndContext>
  );
};

export default DataTableRoot;
