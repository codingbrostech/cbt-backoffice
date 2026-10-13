import type { AdminResult } from '@cbt-bo/api-schema/bo/models';
import type { IDataTableColumn } from '@cbt-bo/component-lib/components/table';
import { Button } from '@cbt-bo/component-lib/components/ui/button';
import type { TFunction } from 'i18next';

const EMPTY_VALUE = '-';
const ACTION_COLUMN_WIDTH_PX = 80;

export interface IAdminColumnActions {
  onEdit: (admin: AdminResult) => void;
  isUpdateAllowed: boolean;
}

/**
 * Columns of the admins list, labelled through `t`. A blank value renders
 * as EMPTY_VALUE, and `state` translates through `state.<value>` with the
 * raw value as the fallback. The last column holds the row actions.
 */
export const buildAdminColumns = (
  t: TFunction,
  { onEdit, isUpdateAllowed }: IAdminColumnActions
): IDataTableColumn<AdminResult>[] => [
  {
    key: 'code',
    title: t('admins.code'),
    fixed: 'start',
    render: ({ code }) => code ?? EMPTY_VALUE
  },
  { key: 'name', title: t('admins.name'), render: ({ name }) => name ?? EMPTY_VALUE },
  { key: 'role', title: t('admins.role'), render: ({ role }) => role ?? EMPTY_VALUE },
  {
    key: 'state',
    title: t('admins.state'),
    render: ({ state }) => (state ? t(`state.${state}`, { defaultValue: state }) : EMPTY_VALUE)
  },
  {
    key: 'action',
    title: t('common.action'),
    width: ACTION_COLUMN_WIDTH_PX,
    render: admin => (
      <Button
        type="button"
        variant="muted"
        size="sm"
        disabled={!isUpdateAllowed}
        onClick={() => {
          onEdit(admin);
        }}
      >
        {t('common.edit')}
      </Button>
    )
  }
];
