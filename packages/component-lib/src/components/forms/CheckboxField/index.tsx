import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { Checkbox } from '@cbt-bo/component-lib/components/ui/checkbox';
import { Field, FieldLabel } from '@cbt-bo/component-lib/components/ui/field';

export interface ICheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Checkbox bound to a boolean field at the given `control`/`name`.
 */
const CheckboxField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  disabled,
  className
}: ICheckboxFieldProps<TFieldValues, TName>) => {
  const { field } = useController({ name, control });

  return (
    <Field orientation="horizontal" className={className}>
      <Checkbox
        id={field.name}
        checked={field.value}
        disabled={disabled}
        onCheckedChange={checked => {
          field.onChange(checked === true);
        }}
      />
      <FieldLabel htmlFor={field.name} className="cursor-pointer text-xs text-muted-foreground">
        {label}
      </FieldLabel>
    </Field>
  );
};

export default CheckboxField;
