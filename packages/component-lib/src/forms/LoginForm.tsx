import { zodResolver } from '@hookform/resolvers/zod';
import { LockIcon, UserIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CheckboxField from '@cbt-bo/component-lib/components/forms/CheckboxField';
import PasswordField from '@cbt-bo/component-lib/components/forms/PasswordField';
import SubmitButton from '@cbt-bo/component-lib/components/forms/SubmitButton';
import TextField from '@cbt-bo/component-lib/components/forms/TextField';
import { Card, CardContent } from '@cbt-bo/component-lib/components/ui/card';
import { FieldGroup } from '@cbt-bo/component-lib/components/ui/field';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export interface ILoginFormValues {
  username: string;
  password: string;
  isRememberMe: boolean;
}

export interface ILoginFormLabels {
  account: string;
  password: string;
  remember: string;
  submit: string;
  showPassword: string;
  hidePassword: string;
  accountRequiredError: string;
  passwordRequiredError: string;
}

export interface ILoginFormProps {
  labels: ILoginFormLabels;
  header?: ReactNode;
  defaultValues?: Partial<ILoginFormValues>;
  isPending?: boolean;
  className?: string;
  onSubmit: (values: ILoginFormValues) => Promise<void> | void;
}

const INPUT_CLASS_NAME = 'h-10';
const DEFAULT_TITLE = 'Backoffice';

const buildSchema = (labels: ILoginFormLabels) =>
  z.object({
    username: z.string().min(1, labels.accountRequiredError),
    password: z.string().min(1, labels.passwordRequiredError),
    isRememberMe: z.boolean()
  });

const LoginForm = ({
  labels,
  header,
  defaultValues,
  isPending = false,
  className,
  onSubmit
}: ILoginFormProps) => {
  const { username = '', password = '', isRememberMe = false } = defaultValues ?? {};

  const schema = buildSchema(labels);

  const form = useForm<ILoginFormValues>({
    defaultValues: { username, password, isRememberMe },
    resolver: zodResolver(schema)
  });

  return (
    <Card
      className={cn(
        'w-full max-w-[540px] gap-0 rounded-sm border-0 px-11 py-12 shadow-[0_8px_32px_rgba(17,17,17,0.08)]',
        className
      )}
    >
      <CardContent className="px-0">
        {header ?? (
          <h1 className="mb-10 text-center text-2xl leading-none font-semibold text-foreground">
            {DEFAULT_TITLE}
          </h1>
        )}
        <form
          noValidate
          onSubmit={event => {
            event.stopPropagation();
            void form.handleSubmit(values => onSubmit(values))(event);
          }}
        >
          <FieldGroup className="gap-5">
            <TextField
              control={form.control}
              name="username"
              label={labels.account}
              placeholder={labels.account}
              prefix={<UserIcon />}
              className={INPUT_CLASS_NAME}
              autoComplete="username"
              disabled={isPending}
            />
            <PasswordField
              control={form.control}
              name="password"
              label={labels.password}
              placeholder={labels.password}
              prefix={<LockIcon />}
              className={INPUT_CLASS_NAME}
              autoComplete="current-password"
              disabled={isPending}
              showLabel={labels.showPassword}
              hideLabel={labels.hidePassword}
            />
            <CheckboxField
              control={form.control}
              name="isRememberMe"
              label={labels.remember}
              disabled={isPending}
            />
            <SubmitButton
              control={form.control}
              label={labels.submit}
              className="h-10 w-full text-lg"
              disabled={isPending}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
