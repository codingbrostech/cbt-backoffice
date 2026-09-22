import { type RowData, useTable } from '@tanstack/react-table';

import type { TColumnDef } from '~/table/build-column-defs';
import { TABLE_FEATURES, type TPortalTable, selectTableState } from '~/table/features';

export interface IUseStaticTableOptions<TRow extends RowData> {
  columns: TColumnDef<TRow>[];
  data: TRow[];
}

/**
 * Table instance that shows every row of `data` without pagination.
 */
export const useStaticTable = <TRow extends RowData>({
  columns,
  data
}: IUseStaticTableOptions<TRow>): TPortalTable<TRow> =>
  useTable({ features: TABLE_FEATURES, columns, data }, selectTableState);
