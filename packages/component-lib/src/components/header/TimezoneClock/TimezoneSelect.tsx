import type { ITimezoneOption } from '@cbt-bo/component-lib/components/header/TimezoneClock/types';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@cbt-bo/component-lib/components/ui/select';

export interface ITimezoneSelectProps {
  value: number;
  options: ITimezoneOption[];
  onChange: (value: number) => void;
}

const TimezoneSelect = ({ value, options, onChange }: ITimezoneSelectProps) => (
  <Select
    value={String(value)}
    onValueChange={next => {
      onChange(Number(next));
    }}
  >
    <SelectTrigger
      size="sm"
      className="h-auto w-fit min-w-32 shrink-0 border-sidebar-border bg-transparent px-2 py-1 text-sidebar-foreground hover:bg-sidebar-accent"
    >
      <SelectValue />
    </SelectTrigger>
    <SelectContent position="popper" align="end" sideOffset={10}>
      <SelectGroup>
        {options.map(option => (
          <SelectItem key={option.value} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default TimezoneSelect;
