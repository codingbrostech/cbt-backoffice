import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ReactNode } from 'react';

import { DataTableRowContext } from '@cbt-bo/component-lib/components/table/DataTable/data-table-row-context';
import { TableRow } from '@cbt-bo/component-lib/components/ui/table';

export interface IDataTableSortableRowProps {
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * One row that can be dragged to a new position. Publishes its drag bindings
 * so a `DataTable.DragHandle` inside any of its cells can attach them.
 */
const DataTableSortableRow = ({ id, children, className }: IDataTableSortableRowProps) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id
  });

  const style = { transform: CSS.Translate.toString(transform), transition };

  return (
    <DataTableRowContext value={{ attributes, listeners, isDragging }}>
      <TableRow
        ref={setNodeRef}
        style={style}
        className={className}
        data-dragging={isDragging ? '' : undefined}
      >
        {children}
      </TableRow>
    </DataTableRowContext>
  );
};

export default DataTableSortableRow;
