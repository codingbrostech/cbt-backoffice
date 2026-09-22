import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Textarea } from '~/components/ui/textarea';
import { useFieldContext } from '~/forms/form-context';

export interface ITextareaFieldProps extends Omit<
  React.ComponentProps<typeof Textarea>,
  'value' | 'onChange' | 'onBlur' | 'name' | 'id'
> {
  label: string;
}

const TextareaField = ({ label, ...textareaProps }: ITextareaFieldProps) => {
  const field = useFieldContext<string>();

  const { errors, isTouched } = field.state.meta;
  const isInvalid = isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        aria-invalid={isInvalid}
        onBlur={field.handleBlur}
        onChange={event => {
          field.handleChange(event.target.value);
        }}
        {...textareaProps}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

export default TextareaField;
