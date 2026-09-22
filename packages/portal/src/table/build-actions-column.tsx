import { type RowData, createColumnHelper } from '@tanstack/react-table';

import { Button } from '~/components/ui/button';
import type { TColumnDef } from '~/table/build-column-defs';
import { type TABLE_FEATURES } from '~/table/features';

export interface IRowAction<TRow extends RowData> {
  label: string;
  onClick: (row: TRow) => void;
  isDisabled?: (row: TRow) => boolean;
  isHidden?: (row: TRow) => boolean;
  variant?: React.ComponentProps<typeof Button>['variant'];
}

export interface IBuildActionsColumnOptions<TRow extends RowData> {
  header: string;
  actions: IRowAction<TRow>[];
  size?: number;
}

const DEFAULT_ACTION_WIDTH = 90;

/**
 * Display column rendering one small button per action.
 */
export const buildActionsColumn = <TRow extends RowData>({
  header,
  actions,
  size
}: IBuildActionsColumnOptions<TRow>): TColumnDef<TRow> => {
  const helper = createColumnHelper<typeof TABLE_FEATURES, TRow>();

  return helper.display({
    id: 'actions',
    header,
    size: size ?? actions.length * DEFAULT_ACTION_WIDTH,
    cell: ({ row }) => (
      <div className="flex flex-wrap justify-center gap-1">
        {actions
          .filter(action => !action.isHidden?.(row.original))
          .map(action => (
            <Button
              key={action.label}
              size="xs"
              variant={action.variant}
              disabled={action.isDisabled?.(row.original)}
              onClick={() => {
                action.onClick(row.original);
              }}
            >
              {action.label}
            </Button>
          ))}
      </div>
    )
  });
};
