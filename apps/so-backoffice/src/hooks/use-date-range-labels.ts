import type { ISearchBarDateRangeFieldLabels } from '@cbt-bo/component-lib/components/search';
import { useTranslation } from 'react-i18next';

/**
 * Resolves every `common.dateRange.*` string for `SearchBar.DateRangeField`'s
 * `labels` prop.
 */
export const useDateRangeLabels = (): ISearchBarDateRangeFieldLabels => {
  const { t } = useTranslation();

  return {
    quickRange: t('common.dateRange.label'),
    quickRanges: {
      today: t('common.dateRange.quick.today'),
      yesterday: t('common.dateRange.quick.yesterday'),
      thisWeek: t('common.dateRange.quick.thisWeek'),
      lastWeek: t('common.dateRange.quick.lastWeek'),
      thisMonth: t('common.dateRange.quick.thisMonth'),
      lastMonth: t('common.dateRange.quick.lastMonth')
    },
    custom: t('common.dateRange.quick.custom'),
    from: t('common.dateRange.from'),
    to: t('common.dateRange.to'),
    clear: t('common.dateRange.clear'),
    confirm: t('common.dateRange.confirm'),
    previousYear: t('common.dateRange.previousYear'),
    previousMonth: t('common.dateRange.previousMonth'),
    nextMonth: t('common.dateRange.nextMonth'),
    nextYear: t('common.dateRange.nextYear'),
    hour: t('common.dateRange.hour'),
    minute: t('common.dateRange.minute')
  };
};
