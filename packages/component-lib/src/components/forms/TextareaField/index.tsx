import type { ComponentProps } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import { Textarea } from '@cbt-bo/component-lib/components/ui/textarea';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ITextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<
  ComponentProps<typeof Textarea>,
  'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'rows'
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  /**
   * Rows the textarea shows before it scrolls. Defaults to 3.
   */
  rows?: number;
}

const DEFAULT_ROWS = 3;

/**
 * Multi-line text input bound to the given `control`/`name`. Shows the field
 * errors once the field has been touched.
 */
const TextareaField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  rows = DEFAULT_ROWS,
  className,
  ...textareaProps
}: ITextareaFieldProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ name, control });

  const isInvalid = Boolean(fieldState.error);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Textarea
        id={field.name}
        rows={rows}
        aria-invalid={isInvalid}
        className={cn('rounded-sm text-sm focus-visible:ring-0', className)}
        {...field}
        {...textareaProps}
      />
      {isInvalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

export default TextareaField;
