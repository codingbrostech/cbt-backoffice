import type { ComponentProps } from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { Spinner } from '@cbt-bo/component-lib/components/ui/spinner';

export interface ISubmitButtonProps<TFieldValues extends FieldValues = FieldValues> extends Omit<
  ComponentProps<typeof Button>,
  'type'
> {
  control: Control<TFieldValues>;
  label: string;
}

/**
 * Submit button bound to the given `control`. Disabled with a spinner
 * while the form is submitting.
 */
const SubmitButton = <TFieldValues extends FieldValues = FieldValues>({
  control,
  label,
  disabled,
  ...buttonProps
}: ISubmitButtonProps<TFieldValues>) => {
  const { isSubmitting } = useFormState({ control });

  return (
    <Button type="submit" disabled={isSubmitting || disabled} {...buttonProps}>
      {isSubmitting && <Spinner />}
      {label}
    </Button>
  );
};

export default SubmitButton;
