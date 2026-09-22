import ImagesInput, { type IImageItem } from '~/components/ImagesInput';
import { FieldError } from '~/components/ui/field';
import { useFieldContext } from '~/forms/form-context';

export interface IImagesFieldProps {
  label: string;
  addLabel: string;
  keyOrder?: readonly string[];
  isCustomKeyAllowed?: boolean;
  isShowingAllKeys?: boolean;
}

const ImagesField = ({
  label,
  addLabel,
  keyOrder,
  isCustomKeyAllowed,
  isShowingAllKeys
}: IImagesFieldProps) => {
  const field = useFieldContext<IImageItem[]>();

  const { errors, isTouched } = field.state.meta;

  return (
    <div className="flex flex-col gap-1">
      <ImagesInput
        label={label}
        addLabel={addLabel}
        keyOrder={keyOrder}
        isCustomKeyAllowed={isCustomKeyAllowed}
        isShowingAllKeys={isShowingAllKeys}
        value={field.state.value}
        onChange={field.handleChange}
      />
      {isTouched && errors.length > 0 && <FieldError errors={errors} />}
    </div>
  );
};

export default ImagesField;
