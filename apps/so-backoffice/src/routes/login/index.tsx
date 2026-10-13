import { sessionQueryOptions } from '@cbt-bo/api/auth/queries';
import { PageSpinner } from '@cbt-bo/component-lib/components/layout';
import LoginForm, { type ILoginFormValues } from '@cbt-bo/component-lib/forms/LoginForm';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useSearchParams } from 'react-router';

import brandIcon from '#/assets/brand-icon.webp';
import { LOGIN_REDIRECT_PARAM, buildPostLoginHref } from '#/constants/path';
import { useLogin } from '#/routes/login/hooks/use-login';
import { readRememberedUsername, writeRememberedUsername } from '#/utils/remember-me';

/**
 * Login page. Shows PageSpinner until the session resolves, sends a signed-in
 * visitor on to the post-login target and otherwise renders the login form.
 */
const LoginPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const { data: user, isPending } = useQuery(sessionQueryOptions());
  const { login, isPending: isLoggingIn } = useLogin();
  const [rememberedUsername] = useState(readRememberedUsername);

  const redirect = searchParams.get(LOGIN_REDIRECT_PARAM) ?? undefined;
  const postLoginHref = buildPostLoginHref(redirect);
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

  if (isPending) return <PageSpinner />;
  if (user) return <Navigate to={postLoginHref} replace />;

  return (
    <main className="flex min-h-dvh items-center justify-center bg-page-background p-6">
      <LoginForm
        labels={labels}
        header={header}
        defaultValues={defaultValues}
        isPending={isLoggingIn}
        onSubmit={handleSubmit}
      />
    </main>
  );
};

export default LoginPage;
