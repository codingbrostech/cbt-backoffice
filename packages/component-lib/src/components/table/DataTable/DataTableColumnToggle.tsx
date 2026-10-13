import { ChevronDownIcon } from 'lucide-react';

import { useDataTable } from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { Checkbox } from '@cbt-bo/component-lib/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@cbt-bo/component-lib/components/ui/dropdown-menu';

export interface IDataTableColumnToggleLabels {
  columns: string;
}

/**
 * Dropdown to show or hide table columns. The last visible column cannot be
 * hidden.
 */
const DataTableColumnToggle = () => {
  const { labels, columns, columnVisibility, onColumnVisibilityChange } = useDataTable();

  const visibleCount = columns.filter(({ key }) => columnVisibility[key] !== false).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="group gap-1">
          {labels.columns}
          <ChevronDownIcon className="opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {labels.columns}
        </DropdownMenuLabel>
        {columns.map(({ key, title }) => {
          const isVisible = columnVisibility[key] !== false;

          return (
            <DropdownMenuCheckboxItem
              key={key}
              checked={isVisible}
              disabled={isVisible && visibleCount === 1}
              className="gap-2 pl-2 [&>span:first-child]:hidden"
              onCheckedChange={checked => {
                onColumnVisibilityChange({ ...columnVisibility, [key]: checked });
              }}
              onSelect={event => {
                event.preventDefault();
              }}
            >
              <Checkbox
                checked={isVisible}
                tabIndex={-1}
                aria-hidden
                className="pointer-events-none"
              />
              <span className="truncate">{title}</span>
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableColumnToggle;
