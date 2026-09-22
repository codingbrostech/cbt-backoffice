import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '~/components/ui/select';
import { useFieldContext } from '~/forms/form-context';
import type { ISelectOption } from '~/table/types';

export interface ISelectFieldProps {
  label: string;
  options: ISelectOption[];
  placeholder?: string;
  isDisabled?: boolean;
}

const SelectField = ({ label, options, placeholder, isDisabled }: ISelectFieldProps) => {
  const field = useFieldContext<string>();

  const { errors, isTouched } = field.state.meta;
  const isInvalid = isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Select
        value={field.state.value}
        disabled={isDisabled}
        onValueChange={value => {
          field.handleChange(value);
        }}
      >
        <SelectTrigger id={field.name} aria-invalid={isInvalid} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

export default SelectField;
