import type { ComponentProps } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Field, FieldError, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@cbt-bo/component-lib/components/ui/select';
import { cn } from '@cbt-bo/component-lib/lib/utils';

const EMPTY_OPTION_VALUE = '__empty__';

export interface ISelectOption {
  value: string;
  label: string;
}

export interface ISelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  options: readonly ISelectOption[];
  placeholder?: string;
  /**
   * Label of an extra first option that clears the value, such as `All`.
   * An empty value shows it as the selected option.
   */
  emptyLabel?: string;
  size?: ComponentProps<typeof SelectTrigger>['size'];
  disabled?: boolean;
  className?: string;
}

/**
 * Select bound to a string field at the given `control`/`name`. An empty
 * value shows `emptyLabel` when given and `placeholder` otherwise. Shows the field errors once the field has been
 * touched.
 */
const SelectField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  options,
  placeholder,
  emptyLabel,
  size,
  disabled,
  className
}: ISelectFieldProps<TFieldValues, TName>) => {
  const { field, fieldState } = useController({ name, control });

  const isInvalid = Boolean(fieldState.error);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      <Select
        name={field.name}
        value={emptyLabel && !field.value ? EMPTY_OPTION_VALUE : field.value}
        disabled={disabled}
        onValueChange={value => {
          field.onChange(value === EMPTY_OPTION_VALUE ? '' : value);
        }}
      >
        <SelectTrigger
          id={field.name}
          size={size}
          aria-invalid={isInvalid}
          className={cn('w-full data-[size=default]:h-9', className)}
          onBlur={field.onBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {emptyLabel && <SelectItem value={EMPTY_OPTION_VALUE}>{emptyLabel}</SelectItem>}
          {options.map(({ value, label: optionLabel }) => (
            <SelectItem key={value} value={value}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
};

export default SelectField;
