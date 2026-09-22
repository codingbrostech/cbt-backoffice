import type { RowData } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import CopyButton from '~/components/CopyButton';
import { cn } from '~/lib/utils';
import type { IDetailItem } from '~/table/build-column-defs';

export interface ITableRowDetailPaneProps<TRow extends RowData> {
  row: TRow;
  items: IDetailItem<TRow>[];
  /**
   * Renders component values on their own row below the label.
   */
  isBlockLayout?: boolean;
}

const isPrimitive = (value: unknown): value is string | number | boolean | bigint =>
  ['string', 'number', 'boolean', 'bigint'].includes(typeof value);

const TableRowDetailPane = <TRow extends RowData>({
  row,
  items,
  isBlockLayout = false
}: ITableRowDetailPaneProps<TRow>) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 gap-x-16 gap-y-2 p-3 text-left text-sm md:grid-cols-2">
      {items.map(item => {
        const { field, translateKey, format, isCopyEnabled, isFullWidth, shouldShow } = item;
        if (shouldShow && !shouldShow(row)) return null;

        const value = format(row, field) ?? '';
        const isBlock = isBlockLayout && !isPrimitive(value);

        if (isBlock) {
          return (
            <div key={field} className="md:col-span-2">
              <p className="mb-1.5 font-medium">{t(translateKey)}</p>
              {value}
            </div>
          );
        }

        return (
          <div key={field} className={cn('flex items-start gap-1', isFullWidth && 'md:col-span-2')}>
            <span className="shrink-0 font-medium">{t(translateKey)} :</span>
            <span className={cn(isFullWidth && 'flex-1 break-words')}>{value}</span>
            {typeof value === 'string' && isCopyEnabled && value !== '-' && (
              <CopyButton value={value} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableRowDetailPane;
