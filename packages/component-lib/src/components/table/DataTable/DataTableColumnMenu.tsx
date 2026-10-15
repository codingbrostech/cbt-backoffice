import { EllipsisVerticalIcon, PinIcon } from 'lucide-react';

import { useDataTable } from '@cbt-bo/component-lib/components/table/DataTable/data-table-context';
import {
  type TColumnPin,
  isColumnPin
} from '@cbt-bo/component-lib/components/table/DataTable/list-table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@cbt-bo/component-lib/components/ui/dropdown-menu';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IDataTableColumnMenuLabels {
  columnMenu: string;
  pinColumn: string;
  noPin: string;
  pinLeft: string;
  pinRight: string;
}

export interface IDataTableColumnMenuProps {
  columnKey: string;
  title: string;
  pin?: TColumnPin;
}

const NO_PIN_VALUE = 'none';

const PIN_OPTIONS = [
  { value: NO_PIN_VALUE, labelKey: 'noPin' },
  { value: 'start', labelKey: 'pinLeft' },
  { value: 'end', labelKey: 'pinRight' }
] as const satisfies readonly { value: string; labelKey: keyof IDataTableColumnMenuLabels }[];

/**
 * Header menu of one column, rendered by `DataTable.Grid` while the root has
 * `onColumnPinningChange`. Pins the column to the left, to the right or
 * nowhere.
 */
const DataTableColumnMenu = ({ columnKey, title, pin }: IDataTableColumnMenuProps) => {
  const { labels, columnPinning, onColumnPinningChange } = useDataTable();

  const TriggerIcon = pin ? PinIcon : EllipsisVerticalIcon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`${labels.columnMenu} ${title}`}
          className={cn(
            'size-6 shrink-0 text-muted-foreground data-[state=open]:bg-accent',
            pin && 'text-foreground'
          )}
        >
          <TriggerIcon className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="gap-2">
            <PinIcon />
            {labels.pinColumn}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-36">
            <DropdownMenuRadioGroup
              value={pin ?? NO_PIN_VALUE}
              onValueChange={value => {
                onColumnPinningChange({
                  ...columnPinning,
                  [columnKey]: isColumnPin(value) ? value : false
                });
              }}
            >
              {PIN_OPTIONS.map(({ value, labelKey }) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {labels[labelKey]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataTableColumnMenu;
