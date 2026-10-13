import { DEFAULT_ADMIN_LIST_FILTER } from '@cbt-bo/api/admin/queries';
import { adminRoleListQueryOptions } from '@cbt-bo/api/admin-role/queries';
import { ACTIVATION_STATES } from '@cbt-bo/api/common/constants';
import type { AdminResult, AdminRoleResult } from '@cbt-bo/api-schema/bo/models';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms';
import { SearchBar } from '@cbt-bo/component-lib/components/search';
import { DataTable } from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePagePermission } from '#/hooks/use-page-permission';
import { useTableLabels } from '#/hooks/use-table-labels';
import AdminFormDialog from '#/routes/app/admins/components/AdminFormDialog';
import { buildAdminColumns } from '#/routes/app/admins/data-type';
import { useAdminList } from '#/routes/app/admins/hooks/use-admin-list';

const buildRoleOptions = (roles: AdminRoleResult[]): ISelectOption[] =>
  roles.flatMap(({ code, name }) => (code ? [{ value: code, label: name ?? code }] : []));

const AdminsPage = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminResult>();
  const { filter, pageParams, rows, total, isFetching, isError, search, setPageParams } =
    useAdminList();
  const { data: roles = [] } = useQuery(adminRoleListQueryOptions());
  const tableLabels = useTableLabels();
  const { isCreateAllowed, isUpdateAllowed } = usePagePermission();

  const roleOptions = buildRoleOptions(roles);
  const stateOptions = ACTIVATION_STATES.map(state => ({
    value: state,
    label: t(`state.${state}`)
  }));

  const openCreate = () => {
    setEditingAdmin(undefined);
    setIsDialogOpen(true);
  };

  const openEdit = (admin: AdminResult) => {
    setEditingAdmin(admin);
    setIsDialogOpen(true);
  };

  const columns = buildAdminColumns(t, { onEdit: openEdit, isUpdateAllowed });

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-4">
      <SearchBar.Root defaultValues={DEFAULT_ADMIN_LIST_FILTER} values={filter} onSubmit={search}>
        <SearchBar.Header title={t('nav.admins')}>
          <Button type="button" disabled={!isCreateAllowed} onClick={openCreate}>
            <PlusIcon />
            {t('admins.create')}
          </Button>
        </SearchBar.Header>
        <SearchBar.Fields>
          <SearchBar.TextField name="code" label={t('admins.code')} />
          <SearchBar.SelectField
            name="state"
            label={t('admins.state')}
            options={stateOptions}
            allLabel={t('common.all')}
          />
          <SearchBar.SelectField
            name="role"
            label={t('admins.role')}
            options={roleOptions}
            allLabel={t('common.all')}
          />
          <SearchBar.Actions
            resetLabel={t('common.reset')}
            submitLabel={t('common.search')}
            isLoading={isFetching}
          />
        </SearchBar.Fields>
      </SearchBar.Root>
      <DataTable.Root
        columns={columns}
        data={rows}
        total={total}
        labels={tableLabels}
        params={pageParams}
        onParamsChange={setPageParams}
        isLoading={isFetching}
        isError={isError}
      >
        <DataTable.Grid />
        <DataTable.Pagination />
      </DataTable.Root>
      <AdminFormDialog
        isOpen={isDialogOpen}
        admin={editingAdmin}
        roleOptions={roleOptions}
        stateOptions={stateOptions}
        onOpenChange={setIsDialogOpen}
      />
    </main>
  );
};

export default AdminsPage;
