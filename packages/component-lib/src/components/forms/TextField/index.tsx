import type { ComponentProps, ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import { Input } from '@cbt-bo/component-lib/components/ui/input';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ITextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<
  ComponentProps<typeof Input>,
  'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'prefix'
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  /**
   * Node rendered inside the input at its start, such as an icon.
   */
  prefix?: ReactNode;
  /**
   * Node rendered inside the input at its end, such as a toggle button.
   */
  suffix?: ReactNode;
}

/**
 * Text input bound to the given `control`/`name`. Shows the field errors
 * once the field has been touched.
 */
const TextField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  prefix,
  suffix,
  className,
  ...inputProps
}: ITextFieldProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ name, control });

  const isInvalid = Boolean(fieldState.error);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground [&_svg]:size-4.5">
            {prefix}
          </span>
        )}
        <Input
          id={field.name}
          aria-invalid={isInvalid}
          className={cn(
            prefix && 'pl-12',
            suffix && 'pr-12',
            'rounded-sm focus-visible:ring-0',
            className
          )}
          {...field}
          {...inputProps}
        />
        {suffix && <span className="absolute inset-y-0 right-4 flex items-center">{suffix}</span>}
      </div>
      {isInvalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

export default TextField;
