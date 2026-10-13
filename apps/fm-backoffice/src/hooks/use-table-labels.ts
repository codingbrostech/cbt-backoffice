import type { TDataTableLabels } from '@cbt-bo/component-lib/components/table';
import { useTranslation } from 'react-i18next';

/**
 * Resolves every `table.*` string for `DataTable.Root`'s `labels` prop.
 */
export const useTableLabels = (): TDataTableLabels => {
  const { t } = useTranslation();

  return {
    noData: t('table.noData'),
    loading: t('table.loading'),
    loadFailed: t('table.loadFailed'),
    firstPage: t('table.firstPage'),
    previousPage: t('table.previousPage'),
    previous: t('table.previous'),
    nextPage: t('table.nextPage'),
    next: t('table.next'),
    lastPage: t('table.lastPage'),
    page: t('table.page'),
    go: t('table.go'),
    rowsPerPage: t('table.rowsPerPage'),
    columns: t('table.columns'),
    formatRange: (from, to, count) => t('table.range', { from, to, total: count.toLocaleString() })
  };
};
