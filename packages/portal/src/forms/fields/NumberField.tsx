import { Field, FieldDescription, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '~/forms/form-context';

export interface INumberFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'type'
> {
  label: string;
  description?: string;
}

/**
 * Numeric input bound to a `number | undefined` field. Empty input clears
 * the value. Accepts decimals unless a `step` is given.
 */
const NumberField = ({ label, description, ...inputProps }: INumberFieldProps) => {
  const field = useFieldContext<number | undefined>();

  const { errors, isTouched } = field.state.meta;
  const isInvalid = isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Input
        id={field.name}
        name={field.name}
        type="number"
        step="any"
        value={field.state.value ?? ''}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        onChange={event => {
          const { value } = event.target;
          field.handleChange(value === '' ? undefined : Number(value));
        }}
        {...inputProps}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

export default NumberField;
