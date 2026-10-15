import { XIcon } from 'lucide-react';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IFieldClearButtonProps {
  label: string;
  className?: string;
  onClick: () => void;
}

/**
 * Small round clear button for a field that holds a value. It carries no
 * placement of its own, so the caller positions it through `className`,
 * usually over the trailing icon of the field's trigger.
 */
const FieldClearButton = ({ label, className, onClick }: IFieldClearButtonProps) => (
  <button
    type="button"
    aria-label={label}
    className={cn(
      'flex size-3 cursor-pointer items-center justify-center rounded-full bg-muted-foreground/50 text-background transition-[background-color] outline-none hover:bg-muted-foreground/80 focus-visible:ring-2 focus-visible:ring-ring/50',
      className
    )}
    onClick={onClick}
  >
    <XIcon className="size-2" strokeWidth={3} aria-hidden />
  </button>
);

export default FieldClearButton;
