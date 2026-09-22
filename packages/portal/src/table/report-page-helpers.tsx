import type { RowData } from '@tanstack/react-table';

import TruncateValue from '~/components/TruncateValue';
import type { IFieldOptions } from '~/table/build-column-defs';

/**
 * Field options for long ids: truncated with a copy button in cells, raw
 * with a copy button in the detail pane.
 */
export const buildTruncatedFieldOptions = <TRow extends RowData>(
  getValue: (row: TRow) => string | null | undefined
): IFieldOptions<TRow> => ({
  formatterType: 'custom',
  isCustomCell: true,
  isDetailCopyEnabled: true,
  formatterOptions: {
    customFormatter: row => <TruncateValue value={getValue(row) ?? ''} />
  }
});

/**
 * Removes pagination from list params before they are sent to an export job.
 */
export const buildExportInput = <TParams extends object>({
  page,
  pageSize,
  ...input
}: TParams & { page?: number; pageSize?: number }): Omit<TParams, 'page' | 'pageSize'> => input;
