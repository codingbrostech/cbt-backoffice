import type { ComponentProps, ReactNode } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import FieldClearButton from '@cbt-bo/component-lib/components/forms/FieldClearButton';
import { Field, FieldError, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import { Input } from '@cbt-bo/component-lib/components/ui/input';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ITextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<
  ComponentProps<typeof Input>,
  'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'prefix' | 'size'
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
  clearLabel?: string;
  /**
   * Height of the input. `sm` fits compact rows such as filters.
   */
  size?: 'sm' | 'default';
}

/**
 * Text input bound to the given `control`/`name`. A filled value shows a
 * clear button when `clearLabel` is given. Shows the field errors once the
 * field has been touched.
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
  clearLabel,
  size = 'default',
  disabled,
  className,
  ...inputProps
}: ITextFieldProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ name, control });

  const value: string = field.value ?? '';
  const isInvalid = Boolean(fieldState.error);
  const isSmall = size === 'sm';
  const isClearable = Boolean(clearLabel);
  const isClearShown = isClearable && Boolean(value) && !disabled;

  const clear = () => {
    field.onChange('');
  };

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
            isSmall ? 'h-8' : 'h-9',
            prefix && 'pl-12',
            suffix && 'pr-12',
            isClearable && (suffix ? 'pr-15' : 'pr-8'),
            'rounded-sm focus-visible:ring-0',
            className
          )}
          disabled={disabled}
          {...field}
          {...inputProps}
        />
        {isClearShown && clearLabel && (
          <FieldClearButton
            label={clearLabel}
            className={cn('absolute top-1/2 -translate-y-1/2', suffix ? 'right-10' : 'right-3')}
            onClick={clear}
          />
        )}
        {suffix && <span className="absolute inset-y-0 right-4 flex items-center">{suffix}</span>}
      </div>
      {isInvalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

export default TextField;
