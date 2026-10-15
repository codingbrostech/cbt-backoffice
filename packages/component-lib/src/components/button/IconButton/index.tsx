import type { ComponentProps } from 'react';

import { Button } from '@cbt-bo/component-lib/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@cbt-bo/component-lib/components/ui/tooltip';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface IIconButtonProps extends Omit<ComponentProps<typeof Button>, 'aria-label'> {
  /**
   * Accessible name of the button, also shown in the tooltip.
   */
  label: string;
  /**
   * Side of the button the tooltip opens on. Defaults to `top`.
   */
  side?: ComponentProps<typeof TooltipContent>['side'];
}

/**
 * Icon-only `Button` named by `label`, which shows in a tooltip on hover and
 * focus, also while the button is disabled. Needs a Radix `TooltipProvider`
 * above it.
 *
 * @example
 * <IconButton type="button" label={t('common.edit')} onClick={startEdit}>
 *   <PencilIcon />
 * </IconButton>
 */
const IconButton = ({
  label,
  side = 'top',
  size = 'icon',
  disabled,
  className,
  children,
  ...buttonProps
}: IIconButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <span className={cn('inline-flex', disabled && 'cursor-not-allowed')}>
        <Button
          aria-label={label}
          size={size}
          disabled={disabled}
          className={cn('disabled:pointer-events-none', className)}
          {...buttonProps}
        >
          {children}
        </Button>
      </span>
    </TooltipTrigger>
    <TooltipContent side={side}>{label}</TooltipContent>
  </Tooltip>
);

export default IconButton;
