import RichTextEditor from '~/components/rich-text-editor/RichTextEditor';
import { useFieldContext } from '~/forms/form-context';

export interface IRichTextFieldProps {
  label: string;
  description?: string;
}

const RichTextField = ({ label, description }: IRichTextFieldProps) => {
  const field = useFieldContext<string>();

  const { errors, isTouched } = field.state.meta;

  return (
    <RichTextEditor
      id={field.name}
      label={label}
      description={description}
      value={field.state.value}
      errors={isTouched ? errors : []}
      onChange={field.handleChange}
    />
  );
};

export default RichTextField;
