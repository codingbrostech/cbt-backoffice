import ExpressionEditor from '~/components/expression-editor/ExpressionEditor';
import { useFieldContext } from '~/forms/form-context';

export interface IExpressionFieldProps {
  label: string;
  description?: string;
  hint?: string;
}

const ExpressionField = ({ label, description, hint }: IExpressionFieldProps) => {
  const field = useFieldContext<string>();

  const { errors, isTouched } = field.state.meta;

  return (
    <ExpressionEditor
      id={field.name}
      label={label}
      description={description}
      hint={hint}
      value={field.state.value}
      errors={isTouched ? errors : []}
      onChange={field.handleChange}
    />
  );
};

export default ExpressionField;
