import type { ReactNode } from 'react';

import StateBadge, {
  type TStateBadgeVariants
} from '@cbt-bo/component-lib/components/badge/StateBadge';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms/SelectField';
import { Badge } from '@cbt-bo/component-lib/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@cbt-bo/component-lib/components/ui/select';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IStateSelectBadgeProps {
  state: string;
  children: ReactNode;
  options: readonly ISelectOption[];
  variants?: TStateBadgeVariants;
  placeholder?: ReactNode;
  className?: string;
  onStateChange: (state: string) => void;
}

/**
 * `StateBadge` that opens a list of states on click, for editing a record
 * state in place. Each option renders as a `StateBadge` of its own state.
 * While `state` is blank and `placeholder` is given, the trigger shows the
 * placeholder instead and no option is checked.
 *
 * @example
 * <StateSelectBadge state={state} options={stateOptions} onStateChange={setState}>
 *   {t(`state.${state}`, { defaultValue: state })}
 * </StateSelectBadge>
 */
const StateSelectBadge = ({
  state,
  children,
  options,
  variants,
  placeholder,
  className,
  onStateChange
}: IStateSelectBadgeProps) => {
  const isPlaceholderShown = !state && placeholder !== undefined;

  const handleValueChange = (value: string) => {
    if (value !== state) onStateChange(value);
  };

  return (
    <Select value={state} onValueChange={handleValueChange}>
      <SelectTrigger
        data-slot="state-select-badge"
        className={cn(
          'h-auto gap-1 rounded-full border-0 p-0 pr-1 shadow-none hover:bg-muted/50 data-[size=default]:h-auto dark:bg-transparent dark:hover:bg-muted/50',
          className
        )}
      >
        {isPlaceholderShown ? (
          <Badge variant="outline" className="border-dashed text-muted-foreground">
            {placeholder}
          </Badge>
        ) : (
          <StateBadge state={state} variants={variants}>
            {children}
          </StateBadge>
        )}
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            <StateBadge state={value} variants={variants}>
              {label}
            </StateBadge>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StateSelectBadge;
