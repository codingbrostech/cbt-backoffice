import { Button } from '~/components/ui/button';
import { Spinner } from '~/components/ui/spinner';
import { useFormContext } from '~/forms/form-context';

export interface ISubmitButtonProps extends Omit<React.ComponentProps<typeof Button>, 'type'> {
  label: string;
}

const SubmitButton = ({ label, disabled, ...buttonProps }: ISubmitButtonProps) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={state => state.isSubmitting}>
      {isSubmitting => (
        <Button type="submit" disabled={disabled ?? isSubmitting} {...buttonProps}>
          {isSubmitting && <Spinner />}
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
};

export default SubmitButton;
