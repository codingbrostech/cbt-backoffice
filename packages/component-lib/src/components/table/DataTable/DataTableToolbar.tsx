import type { ReactNode } from 'react';

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
const DataTableToolbar = ({ children, className }: IDataTableToolbarProps) => (
  <div
    data-slot="data-table-toolbar"
    className={cn('flex shrink-0 items-center justify-between gap-2 pb-4', className)}
  >
    {children}
  </div>
);

export default DataTableToolbar;
