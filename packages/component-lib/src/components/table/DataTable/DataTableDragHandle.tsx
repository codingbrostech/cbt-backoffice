import { GripVerticalIcon } from 'lucide-react';

import { useDataTableRow } from '@cbt-bo/component-lib/components/table/DataTable/data-table-row-context';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IDataTableDragHandleProps {
  /**
   * Accessible name of the handle, such as "Drag to reorder".
   */
  label: string;
  isDisabled?: boolean;
  className?: string;
}

/**
 * Grip that starts a row drag, exposed as `DataTable.DragHandle`. Render it
 * from a column's `render` inside a table whose root has `onRowReorder`.
 *
 * @example
 * { key: 'drag', title: '', render: () => <DataTable.DragHandle label={t('common.dragToReorder')} /> }
 */
const DataTableDragHandle = ({
  label,
  isDisabled = false,
  className
}: IDataTableDragHandleProps) => {
  const { attributes, listeners } = useDataTableRow();

  return (
    <button
      type="button"
      aria-label={label}
      disabled={isDisabled}
      className={cn(
        'flex size-6 items-center justify-center rounded-sm text-muted-foreground transition-colors',
        'hover:bg-muted hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-grab active:cursor-grabbing',
        className
      )}
      {...attributes}
      {...(isDisabled ? {} : listeners)}
    >
      <GripVerticalIcon className="size-4" />
    </button>
  );
};

export default DataTableDragHandle;
