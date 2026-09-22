import Combobox from '~/components/Combobox';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { useFieldContext } from '~/forms/form-context';
import type { ISelectOption } from '~/table/types';

export interface IComboboxFieldProps {
  label: string;
  options: ISelectOption[];
  searchText?: Record<string, string>;
  placeholder?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
}

/**
 * Searchable single select bound to a string field. Clearing stores ''.
 */
const ComboboxField = ({
  label,
  options,
  searchText,
  placeholder,
  isDisabled,
  isClearable = true
}: IComboboxFieldProps) => {
  const field = useFieldContext<string>();

  const { errors, isTouched } = field.state.meta;
  const isInvalid = isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <Combobox
        id={field.name}
        options={options}
        searchText={searchText}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable={isClearable}
        value={field.state.value || null}
        onChange={value => {
          field.handleChange(value ?? '');
        }}
      />
      {isInvalid && <FieldError errors={errors} />}
    </Field>
  );
};

export default ComboboxField;
