import PasswordInput, { type TPasswordInputProps } from '~/components/PasswordInput';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { useFieldContext } from '~/forms/form-context';

export interface IPasswordFieldProps extends Omit<
  TPasswordInputProps,
  'value' | 'onChange' | 'onBlur' | 'name' | 'id'
> {
  label: string;
}

const PasswordField = ({ label, ...inputProps }: IPasswordFieldProps) => {
  const field = useFieldContext<string>();

  const { errors, isTouched } = field.state.meta;
  const isInvalid = isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <PasswordInput
        id={field.name}
        name={field.name}
        value={field.state.value}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        onChange={event => {
          field.handleChange(event.target.value);
        }}
        {...inputProps}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

export default PasswordField;
