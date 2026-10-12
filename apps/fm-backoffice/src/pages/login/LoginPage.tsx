import LoginForm, { type ILoginFormValues } from '@cbt-bo/component-lib/forms/LoginForm';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import brandIcon from '#/assets/brand-icon.webp';
import { useLogin } from '#/pages/login/use-login';
import { readRememberedUsername, writeRememberedUsername } from '#/utils/remember-me';

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, isPending } = useLogin();
  const [rememberedUsername] = useState(readRememberedUsername);

  const defaultValues = { username: rememberedUsername, isRememberMe: Boolean(rememberedUsername) };
  const labels = {
    account: t('login.account'),
    password: t('login.password'),
    remember: t('login.remember'),
    submit: t('login.submit'),
    showPassword: t('common.showPassword'),
    hidePassword: t('common.hidePassword'),
    accountRequiredError: t('login.validation.accountRequired'),
    passwordRequiredError: t('login.validation.passwordRequired')
  };
  const header = (
    <div className="mb-10 flex items-center justify-center gap-3">
      <img src={brandIcon} alt="" className="h-10 w-10 rounded-lg" />
      <div className="flex flex-col items-start text-foreground">
        <span className="text-2xl leading-none font-semibold">{t('login.brandName')}</span>
        <span className="text-sm leading-none">{t('login.title')}</span>
      </div>
    </div>
  );

  const handleSubmit = useCallback(
    async ({ username, password, isRememberMe }: ILoginFormValues) => {
      const isLoggedIn = await login({ username, password });

      if (isLoggedIn) writeRememberedUsername(isRememberMe ? username : undefined);
    },
    [login]
  );

  return (
    <main className="flex min-h-dvh items-center justify-center bg-page-background p-6">
      <LoginForm
        labels={labels}
        header={header}
        defaultValues={defaultValues}
        isPending={isPending}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default LoginPage;
