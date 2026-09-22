import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { useFieldContext } from '~/forms/form-context';
import { cn } from '~/lib/utils';

export interface ITextFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'onBlur' | 'name' | 'id'
> {
  label: string;
  /**
   * Static text rendered inside the input before the value, such as a
   * dial code.
   */
  leadingText?: string;
}

const TextField = ({ label, leadingText, className, ...inputProps }: ITextFieldProps) => {
  const field = useFieldContext<string>();

  const { errors, isTouched } = field.state.meta;
  const isInvalid = isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <div className="relative">
        {leadingText && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
            {leadingText}
          </span>
        )}
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          aria-invalid={isInvalid}
          className={cn(leadingText && 'pl-12', className)}
          onBlur={field.handleBlur}
          onChange={event => {
            field.handleChange(event.target.value);
          }}
          {...inputProps}
        />
      </div>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

export default TextField;
