import { DEFAULT_ADMIN_LIST_FILTER } from '@cbt-bo/api/admin/queries';
import { adminRoleListQueryOptions } from '@cbt-bo/api/admin-role/queries';
import { ACTIVATION_STATES } from '@cbt-bo/api/common/constants';
import type { AdminResult, AdminRoleResult } from '@cbt-bo/api-schema/bo/models';
import type { ISelectOption } from '@cbt-bo/component-lib/components/forms';
import { Page } from '@cbt-bo/component-lib/components/layout';
import { SearchBar } from '@cbt-bo/component-lib/components/search';
import { DataTable, type TColumnPinning } from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import { buildOptions } from '@cbt-bo/component-lib/lib/options';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePagePermission } from '#/hooks/use-page-permission';
import { useTableLabels } from '#/hooks/use-table-labels';
import { buildAdminColumns } from '#/routes/app/admins/columns';
import AdminFormDialog from '#/routes/app/admins/components/AdminFormDialog';
import { useAdminList } from '#/routes/app/admins/hooks/use-admin-list';

const buildRoleOptions = (roles: AdminRoleResult[]): ISelectOption[] =>
  roles.flatMap(({ code, name }) => (code ? [{ value: code, label: name ?? code }] : []));

const AdminsPage = () => {
  const { t } = useTranslation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminResult>();
  const [columnPinning, setColumnPinning] = useState<TColumnPinning>({});
  const { filter, pageParams, rows, total, isFetching, isError, search, setPageParams } =
    useAdminList();
  const { data: roles = [] } = useQuery(adminRoleListQueryOptions());
  const tableLabels = useTableLabels();
  const { isCreateAllowed, isUpdateAllowed } = usePagePermission();

  const roleOptions = buildRoleOptions(roles);
  const stateOptions = buildOptions(ACTIVATION_STATES, state => t(`state.${state}`));

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
    <Page.Root>
      <Page.Header>
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
              noResultsLabel={t('common.noResultFound')}
            />
            <SearchBar.SelectField
              name="role"
              label={t('admins.role')}
              options={roleOptions}
              allLabel={t('common.all')}
              noResultsLabel={t('common.noResultFound')}
            />
            <SearchBar.Actions
              resetLabel={t('common.reset')}
              submitLabel={t('common.search')}
              isLoading={isFetching}
            />
          </SearchBar.Fields>
        </SearchBar.Root>
      </Page.Header>
      <DataTable.Root
        columns={columns}
        data={rows}
        total={total}
        labels={tableLabels}
        params={pageParams}
        onParamsChange={setPageParams}
        columnPinning={columnPinning}
        onColumnPinningChange={setColumnPinning}
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
    </Page.Root>
  );
};

export default AdminsPage;
