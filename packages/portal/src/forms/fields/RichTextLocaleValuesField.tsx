import RichTextLocaleValuesInput from '~/components/RichTextLocaleValuesInput';
import { FieldError } from '~/components/ui/field';
import { useFieldContext } from '~/forms/form-context';
import type { ILocaleEntry } from '~/utils/site-locales';

export interface IRichTextLocaleValuesFieldProps {
  label: string;
  addLabel: string;
  resetKey?: string;
}

const RichTextLocaleValuesField = ({
  label,
  addLabel,
  resetKey
}: IRichTextLocaleValuesFieldProps) => {
  const field = useFieldContext<ILocaleEntry[]>();

  const { errors, isTouched } = field.state.meta;

  return (
    <div className="flex flex-col gap-1">
      <RichTextLocaleValuesInput
        label={label}
        addLabel={addLabel}
        resetKey={resetKey}
        value={field.state.value}
        onChange={field.handleChange}
      />
      {isTouched && errors.length > 0 && <FieldError errors={errors} />}
    </div>
  );
};

export default RichTextLocaleValuesField;
