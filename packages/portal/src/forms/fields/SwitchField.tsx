import { Field, FieldDescription, FieldLabel } from '~/components/ui/field';
import { Switch } from '~/components/ui/switch';
import { useFieldContext } from '~/forms/form-context';

export interface ISwitchFieldProps {
  label: string;
  description?: string;
  isDisabled?: boolean;
}

const SwitchField = ({ label, description, isDisabled }: ISwitchFieldProps) => {
  const field = useFieldContext<boolean>();

  return (
    <Field orientation="horizontal">
      <Switch
        id={field.name}
        checked={field.state.value}
        disabled={isDisabled}
        onCheckedChange={field.handleChange}
      />
      <div className="flex flex-col gap-1">
        {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
        {description && <FieldDescription>{description}</FieldDescription>}
      </div>
    </Field>
  );
};

export default SwitchField;
