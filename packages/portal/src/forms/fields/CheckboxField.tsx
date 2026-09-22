import { Checkbox } from '~/components/ui/checkbox';
import { Field, FieldLabel } from '~/components/ui/field';
import { useFieldContext } from '~/forms/form-context';

export interface ICheckboxFieldProps {
  label: string;
  isDisabled?: boolean;
}

const CheckboxField = ({ label, isDisabled }: ICheckboxFieldProps) => {
  const field = useFieldContext<boolean>();

  return (
    <Field orientation="horizontal">
      <Checkbox
        id={field.name}
        checked={field.state.value}
        disabled={isDisabled}
        onCheckedChange={checked => {
          field.handleChange(checked === true);
        }}
      />
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
    </Field>
  );
};

export default CheckboxField;
