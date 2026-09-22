import DateTimePicker, { type TDateTimePickerMode } from '~/components/DateTimePicker';
import { Field, FieldError, FieldLabel } from '~/components/ui/field';
import { useFieldContext } from '~/forms/form-context';
import type { DateType } from '~/utils/date';

export interface IDateTimeFieldProps {
  label: string;
  mode?: TDateTimePickerMode;
  minDate?: DateType;
  maxDate?: DateType;
  isDisabled?: boolean;
  isClearable?: boolean;
}

/**
 * Date picker bound to a string field holding the picker's output format.
 * Clearing stores ''.
 */
const DateTimeField = ({
  label,
  mode,
  minDate,
  maxDate,
  isDisabled,
  isClearable
}: IDateTimeFieldProps) => {
  const field = useFieldContext<string>();

  const { errors, isTouched } = field.state.meta;
  const isInvalid = isTouched && errors.length > 0;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
      <DateTimePicker
        id={field.name}
        mode={mode}
        minDate={minDate}
        maxDate={maxDate}
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

export default DateTimeField;
