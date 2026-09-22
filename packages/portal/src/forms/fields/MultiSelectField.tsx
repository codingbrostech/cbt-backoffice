import Combobox from '~/components/Combobox';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { useFieldContext } from '~/forms/form-context';
import type { ISelectOption } from '~/table/types';

export interface IMultiSelectFieldProps {
  label: string;
  options: ISelectOption[];
  searchText?: Record<string, string>;
  placeholder?: string;
  isDisabled?: boolean;
}

const MultiSelectField = ({
  label,
  options,
  searchText,
  placeholder,
  isDisabled
}: IMultiSelectFieldProps) => {
  const field = useFieldContext<string[]>();

  const { errors, isTouched } = field.state.meta;
  const isInvalid = isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Combobox
        id={field.name}
        isMulti
        options={options}
        searchText={searchText}
        placeholder={placeholder}
        isDisabled={isDisabled}
        value={field.state.value}
        onChange={field.handleChange}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

export default MultiSelectField;
