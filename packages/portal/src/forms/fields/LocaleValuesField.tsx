import LocaleValuesInput from '~/components/LocaleValuesInput';
import { FieldError } from '~/components/ui/field';
import { useFieldContext } from '~/forms/form-context';
import type { ILocaleEntry } from '~/utils/site-locales';

export interface ILocaleValuesFieldProps {
  label: string;
  addLabel: string;
}

const LocaleValuesField = ({ label, addLabel }: ILocaleValuesFieldProps) => {
  const field = useFieldContext<ILocaleEntry[]>();

  const { errors, isTouched } = field.state.meta;

  return (
    <div className="flex flex-col gap-1">
      <LocaleValuesInput
        label={label}
        addLabel={addLabel}
        value={field.state.value}
        onChange={field.handleChange}
      />
      {isTouched && errors.length > 0 && <FieldError errors={errors} />}
    </div>
  );
};

export default LocaleValuesField;
