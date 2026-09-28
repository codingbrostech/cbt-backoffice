import { EyeIcon, EyeOffIcon } from 'lucide-react';

import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IPasswordToggleProps {
  isVisible: boolean;
  disabled?: boolean;
  className?: string;
  showLabel?: string;
  hideLabel?: string;
  onToggle: () => void;
}

const PasswordToggle = ({
  isVisible,
  disabled,
  className,
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  onToggle
}: IPasswordToggleProps) => (
  <button
    type="button"
    className={cn(
      'cursor-pointer text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    disabled={disabled}
    aria-label={isVisible ? hideLabel : showLabel}
    aria-pressed={isVisible}
    onClick={onToggle}
  >
    {isVisible ? (
      <EyeOffIcon className="size-4" aria-hidden />
    ) : (
      <EyeIcon className="size-4" aria-hidden />
    )}
  </button>
);

export default PasswordToggle;
