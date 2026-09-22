import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import Page from '~/components/Page';
import { Card, CardContent } from '~/components/ui/card';
import { FieldGroup } from '~/components/ui/field';
import { useAppForm } from '~/forms/use-app-form';
import { useApp } from '~/hooks/use-app';

const LoginPage = () => {
  const { userLogin } = useApp();
  const { t } = useTranslation();

  const schema = z.object({
    username: z.string().min(1, t('login.name.required')),
    password: z.string().min(1, t('login.password.required'))
  });

  const form = useAppForm({
    defaultValues: { username: '', password: '' },
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => userLogin(value)
  });

  return (
    <Page title="login">
      <div className="flex flex-1 items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-sm">
          <CardContent>
            <form
              onSubmit={event => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.AppField name="username">
                  {field => <field.TextField label={t('login.name')} autoComplete="username" />}
                </form.AppField>
                <form.AppField name="password">
                  {field => (
                    <field.PasswordField
                      label={t('login.password')}
                      autoComplete="current-password"
                    />
                  )}
                </form.AppField>
              </FieldGroup>
              <form.AppForm>
                <form.SubmitButton label={t('login')} className="mt-8 w-full" />
              </form.AppForm>
            </form>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default LoginPage;
