import type { ReactNode } from 'react';

import { useDataTable } from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IDataTableToolbarProps {
  /**
   * Content of the bar, for example a title and `DataTable.ColumnToggle`.
   */
  children: ReactNode;
  className?: string;
}

/**
 * Row above the grid, exposed as `DataTable.Toolbar`. Spreads its children
 * between the two ends.
 */
const DataTableToolbar = ({ children, className }: IDataTableToolbarProps) => {
  const { isPageScroll } = useDataTable();

  return (
    <div
      data-slot="data-table-toolbar"
      className={cn(
        'flex shrink-0 items-center justify-between gap-2 pb-4',
        isPageScroll && 'sticky left-0 w-[100cqw]',
        className
      )}
    >
      {children}
    </div>
  );
};

export default DataTableToolbar;
