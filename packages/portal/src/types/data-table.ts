import type { DateType } from '~/utils/date';

export type TFormValue = string | number | string[] | DateType | undefined;

export const TIME_RANGE_PRESETS = [
  'today',
  'yesterday',
  'thisWeek',
  'lastWeek',
  'thisMonth',
  'lastMonth',
  'custom'
] as const;

export type TTimeRangePreset = (typeof TIME_RANGE_PRESETS)[number];

/**
 * Form methods used by search fields that are configured by field name.
 * Paths are plain strings and values are untyped.
 */
export interface ILooseKeyForm {
  getValues: () => object;
  setFieldValue: (path: string, value: unknown, options?: { forceUpdate: boolean }) => void;
}

export interface ISearchField {
  name: string;
  label: string;
  inputType?: 'text' | 'select' | 'segmented' | 'datetime' | 'month' | 'date' | 'timeRangePreset';
  /**
   * Whether option labels are i18n keys. Defaults to true.
   */
  isTranslatingOptions?: boolean;
  options?: { label: string; value: string }[];
  selectSearchText?: Record<string, string>;
  minDate?: DateType;
  maxDate?: DateType;
  /** When false, minDate/maxDate are not passed to the datetime picker. */
  withDateBounds?: boolean;
  /** Cap selection at end of today. Defaults to true for datetime search fields. */
  blockFutureDate?: boolean;
  /** Max span in months for a paired `timeFrom` / `timeTo` range. */
  timeRangeMaxMonths?: 1 | 3;
  timeRangeRole?: 'from' | 'to';
  timeRangePartner?: string;
  /** Paired clamp only when at least one side has a value; no default range on load/reset. */
  optionalPairedTimeRange?: boolean;
  /**
   * Preset applied on load and reset of a `timeRangePreset` field.
   * Defaults to `DEFAULT_TIME_RANGE_PRESET`.
   */
  timeRangeDefaultPreset?: TTimeRangePreset;
  /** Names of the paired datetime fields a `timeRangePreset` field fills. */
  timeRangeFromField?: string;
  timeRangeToField?: string;
  /** On paired datetime fields: linked `timeRangePreset` field, flipped to `custom` on manual edits. */
  timeRangePresetField?: string;
  withIsLike?: boolean;
  validate?: (value: TFormValue) => string | null;
  isMultiSelect?: boolean;
}

export interface IDataTableSearchParams {
  page?: number;
  pageSize?: number;
  rowCount?: number;
  //   globalFilter?: string
  //   columnFilters?: MRT_ColumnFiltersState
}
