import type { ComponentProps } from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { Spinner } from '@cbt-bo/component-lib/components/ui/spinner';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ISubmitButtonProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  ComponentProps<typeof Button>,
  'type'
> {
  control: Control<TFieldValues>;
  label: string;
  isLoading?: boolean;
}

/**
 * Submit button bound to the given `control`. Disabled and showing a
 * centered spinner over the hidden label while the form is submitting or
 * `isLoading` is set, so the button width stays fixed.
 */
const SubmitButton = <TFieldValues extends FieldValues = FieldValues>({
  control,
  label,
  isLoading = false,
  disabled,
  ...buttonProps
}: ISubmitButtonProps<TFieldValues>) => {
  const { isSubmitting } = useFormState({ control });

  const isPending = isSubmitting || isLoading;

  return (
    <Button
      type="submit"
      disabled={isPending || disabled}
      {...buttonProps}
      className={cn('relative', buttonProps.className)}
    >
      <span className={cn('inline-flex items-center gap-2', isPending && 'invisible')}>
        {label}
      </span>
      {isPending && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
    </Button>
  );
};

export default SubmitButton;
