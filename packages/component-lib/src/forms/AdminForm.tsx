import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import PasswordField from '@cbt-bo/component-lib/components/forms/PasswordField';
import SelectField, {
  type ISelectOption
} from '@cbt-bo/component-lib/components/forms/SelectField';
import SubmitButton from '@cbt-bo/component-lib/components/forms/SubmitButton';
import TextField from '@cbt-bo/component-lib/components/forms/TextField';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { FieldGroup } from '@cbt-bo/component-lib/components/ui/field';

export type TAdminFormValues = z.infer<ReturnType<typeof buildSchema>>;

export interface IAdminFormLabels {
  code: string;
  name: string;
  secret: string;
  role: string;
  rolePlaceholder: string;
  state: string;
  secretPlaceholder: string;
  submit: string;
  cancel: string;
  showPassword: string;
  hidePassword: string;
  codeRequiredError: string;
  secretRequiredError: string;
  roleRequiredError: string;
}

export interface IAdminFormProps {
  labels: IAdminFormLabels;
  roleOptions: readonly ISelectOption[];
  stateOptions?: readonly ISelectOption[];
  isEdit?: boolean;
  defaultValues?: Partial<TAdminFormValues>;
  isPending?: boolean;
  className?: string;
  onSubmit: (values: TAdminFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

const buildSchema = (labels: IAdminFormLabels, isEdit: boolean) =>
  z.object({
    code: z.string().min(1, labels.codeRequiredError),
    name: z.string(),
    secret: isEdit ? z.string() : z.string().min(1, labels.secretRequiredError),
    role: z.string().min(1, labels.roleRequiredError),
    state: z.string()
  });

/**
 * Create or edit form for an admin. While editing, the login is read-only and
 * the password may stay blank.
 */
const AdminForm = ({
  labels,
  roleOptions,
  stateOptions,
  isEdit = false,
  defaultValues,
  isPending = false,
  className,
  onSubmit,
  onCancel
}: IAdminFormProps) => {
  const { code = '', name = '', secret = '', role = '', state = '' } = defaultValues ?? {};

  const schema = buildSchema(labels, isEdit);

  const form = useForm<TAdminFormValues>({
    defaultValues: { code, name, secret, role, state },
    resolver: zodResolver(schema)
  });

  return (
    <form
      noValidate
      className={className}
      onSubmit={event => {
        event.stopPropagation();
        void form.handleSubmit(values => onSubmit(values))(event);
      }}
    >
      <FieldGroup>
        <TextField
          control={form.control}
          name="code"
          label={labels.code}
          autoComplete="off"
          disabled={isPending || isEdit}
        />
        <TextField
          control={form.control}
          name="name"
          label={labels.name}
          autoComplete="off"
          disabled={isPending}
        />
        <PasswordField
          control={form.control}
          name="secret"
          label={labels.secret}
          autoComplete="new-password"
          placeholder={isEdit ? labels.secretPlaceholder : undefined}
          disabled={isPending}
          showLabel={labels.showPassword}
          hideLabel={labels.hidePassword}
        />
        <SelectField
          control={form.control}
          name="role"
          label={labels.role}
          options={roleOptions}
          placeholder={labels.rolePlaceholder}
          disabled={isPending}
        />
        {stateOptions && (
          <SelectField
            control={form.control}
            name="state"
            label={labels.state}
            options={stateOptions}
            disabled={isPending}
          />
        )}
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
              {labels.cancel}
            </Button>
          )}
          <SubmitButton control={form.control} label={labels.submit} disabled={isPending} />
        </div>
      </FieldGroup>
    </form>
  );
};

export default AdminForm;
