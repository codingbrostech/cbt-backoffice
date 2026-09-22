import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { changePassword } from '~/actions/auth';
import LoadingOverlay from '~/components/LoadingOverlay';
import { Button } from '~/components/ui/button';
import { FieldGroup } from '~/components/ui/field';
import { useAppForm } from '~/forms/use-app-form';
import { useNotification } from '~/hooks/use-notification';

export interface IChangePasswordFormProps {
  onRequestClose: () => void;
  onUpdateSuccess: () => void;
}

const buildErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : String(err);

const ChangePasswordForm = ({ onRequestClose, onUpdateSuccess }: IChangePasswordFormProps) => {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const schema = z
    .object({
      oldPwd: z.string().min(1, t('changePw.oldPwd.required')),
      newPwd: z.string().min(1, t('changePw.newPwd.required')),
      confirmPwd: z.string().min(1, t('changePw.confirmPwd.required'))
    })
    .refine(({ newPwd, confirmPwd }) => newPwd === confirmPwd, {
      path: ['confirmPwd'],
      message: t('changePw.confirmPwd.notEqual')
    });

  const form = useAppForm({
    defaultValues: { oldPwd: '', newPwd: '', confirmPwd: '' },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      try {
        await changePassword({ oldPwd: value.oldPwd, newPwd: value.newPwd });
        onUpdateSuccess();
      } catch (err) {
        showErrorNotification({ title: t('error.changePwFail'), message: buildErrorMessage(err) });
      }
    }
  });

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
      <FieldGroup>
        <form.AppField name="oldPwd">
          {field => (
            <field.PasswordField label={t('changePw.oldPwd')} autoComplete="current-password" />
          )}
        </form.AppField>
        <form.AppField name="newPwd">
          {field => (
            <field.PasswordField label={t('changePw.newPwd')} autoComplete="new-password" />
          )}
        </form.AppField>
        <form.AppField name="confirmPwd">
          {field => (
            <field.PasswordField label={t('changePw.confirmPwd')} autoComplete="new-password" />
          )}
        </form.AppField>
      </FieldGroup>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onRequestClose}>
          {t('common.cancel')}
        </Button>
        <form.AppForm>
          <form.SubmitButton label={t('common.confirm')} />
        </form.AppForm>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
