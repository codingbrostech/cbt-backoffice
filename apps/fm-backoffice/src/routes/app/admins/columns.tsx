import type { AdminResult } from '@cbt-bo/api-schema/bo/models';
import { StateBadge } from '@cbt-bo/component-lib/components/badge';
import { IconButton } from '@cbt-bo/component-lib/components/button';
import type { IDataTableColumn } from '@cbt-bo/component-lib/components/table';
import type { TFunction } from 'i18next';
import { PencilIcon } from 'lucide-react';

const EMPTY_VALUE = '-';
const ACTION_COLUMN_WIDTH_PX = 80;

export interface IAdminColumnOptions {
  roleNameByCode: Readonly<Record<string, string>>;
  onEdit: (admin: AdminResult) => void;
  isUpdateAllowed: boolean;
}

const buildRoleLabel = (
  roleNameByCode: Readonly<Record<string, string>>,
  role?: string
): string => {
  if (!role) return EMPTY_VALUE;

  return roleNameByCode[role] ?? role;
};

/**
 * Columns of the admins list, labelled through `t`. A blank value renders
 * as EMPTY_VALUE. `role` shows its name from `roleNameByCode`, or the code
 * when no name is known. `state` renders as a `StateBadge` and translates
 * through `state.<value>` with the raw value as the fallback. The last
 * column holds the row actions under an empty header.
 */
export const buildAdminColumns = (
  t: TFunction,
  { roleNameByCode, onEdit, isUpdateAllowed }: IAdminColumnOptions
): IDataTableColumn<AdminResult>[] => [
  {
    key: 'code',
    title: t('admins.code'),
    fixed: 'start',
    render: ({ code }) => code ?? EMPTY_VALUE
  },
  { key: 'name', title: t('admins.name'), render: ({ name }) => name ?? EMPTY_VALUE },
  {
    key: 'role',
    title: t('admins.role'),
    render: ({ role }) => buildRoleLabel(roleNameByCode, role)
  },
  {
    key: 'state',
    title: t('admins.state'),
    render: ({ state }) =>
      state ? (
        <StateBadge state={state}>{t(`state.${state}`, { defaultValue: state })}</StateBadge>
      ) : (
        EMPTY_VALUE
      )
  },
  {
    key: 'action',
    title: '',
    width: ACTION_COLUMN_WIDTH_PX,
    render: admin => (
      <IconButton
        type="button"
        label={t('common.edit')}
        variant="muted"
        size="icon-xs"
        disabled={!isUpdateAllowed}
        onClick={() => {
          onEdit(admin);
        }}
      >
        <PencilIcon />
      </IconButton>
    )
  }
];
