import type { AdminResult } from '@cbt-bo/api-schema/bo/models';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@cbt-bo/component-lib/components/ui/dialog';
import AdminForm, { type TAdminFormValues } from '@cbt-bo/component-lib/forms/AdminForm';
import { useTranslation } from 'react-i18next';

import { useCreateAdmin } from '#/routes/app/admins/hooks/use-create-admin';
import { useUpdateAdmin } from '#/routes/app/admins/hooks/use-update-admin';

export interface IAdminFormDialogProps {
  isOpen: boolean;
  /**
   * The admin being edited. The dialog creates a new admin when it is absent.
   */
  admin?: AdminResult;
  roleOptions: readonly ISelectOption[];
  stateOptions: readonly ISelectOption[];
  onOpenChange: (isOpen: boolean) => void;
}

/**
 * Dialog around AdminForm that creates an admin, or edits `admin` when one
 * is given. It closes once the request succeeds.
 */
const AdminFormDialog = ({
  isOpen,
  admin,
  roleOptions,
  stateOptions,
  onOpenChange
}: IAdminFormDialogProps) => {
  const { t } = useTranslation();
  const { createAdmin, isPending: isCreating } = useCreateAdmin();
  const { updateAdmin, isPending: isUpdating } = useUpdateAdmin();

  const { id, code = '', name = '', role = '', state = '' } = admin ?? {};
  const isEdit = Boolean(id);
  const labels = {
    code: t('admins.code'),
    name: t('admins.name'),
    secret: t('admins.secret'),
    role: t('admins.role'),
    rolePlaceholder: t('admins.rolePlaceholder'),
    state: t('admins.state'),
    secretPlaceholder: t('admins.secretPlaceholder'),
    submit: isEdit ? t('admins.save') : t('admins.create'),
    cancel: t('common.cancel'),
    showPassword: t('common.showPassword'),
    hidePassword: t('common.hidePassword'),
    noResults: t('common.noResultFound'),
    codeRequiredError: t('admins.validation.codeRequired'),
    secretRequiredError: t('admins.validation.secretRequired'),
    roleRequiredError: t('admins.validation.roleRequired')
  };

  const handleSubmit = async (values: TAdminFormValues) => {
    const isSaved = id
      ? await updateAdmin({
          id,
          name: values.name,
          role: values.role,
          state: values.state,
          ...(values.secret && { secret: values.secret })
        })
      : await createAdmin({
          code: values.code,
          secret: values.secret,
          role: values.role,
          ...(values.name && { name: values.name })
        });

    if (isSaved) onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{isEdit ? t('admins.edit') : t('admins.create')}</DialogTitle>
        </DialogHeader>
        <AdminForm
          key={id ?? 'create'}
          labels={labels}
          roleOptions={roleOptions}
          stateOptions={isEdit ? stateOptions : undefined}
          isEdit={isEdit}
          defaultValues={{ code, name, role, state }}
          isPending={isCreating || isUpdating}
          onSubmit={handleSubmit}
          onCancel={() => {
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminFormDialog;
