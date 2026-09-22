import LoadingOverlay from '~/components/LoadingOverlay';
import { FieldGroup } from '~/components/ui/field';
import { useFormContext } from '~/forms/form-context';

export interface IFormShellProps {
  children: React.ReactNode;
  /**
   * Controls rendered below the fields, aligned right.
   */
  footer: React.ReactNode;
}

/**
 * Form element with the submit wiring and loading overlay shared by dialog
 * forms. Renders inside `form.AppForm`.
 *
 * @example
 * <form.AppForm>
 *   <FormShell footer={<form.SubmitButton label="Save" />}>...</FormShell>
 * </form.AppForm>
 */
const FormShell = ({ children, footer }: IFormShellProps) => {
  const form = useFormContext();

  return (
    <form
      className="relative"
      onSubmit={event => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Subscribe selector={state => state.isSubmitting}>
        {isSubmitting => <LoadingOverlay isVisible={isSubmitting} />}
      </form.Subscribe>
      <FieldGroup>{children}</FieldGroup>
      <div className="mt-6 flex justify-end gap-2">{footer}</div>
    </form>
  );
};

export default FormShell;
