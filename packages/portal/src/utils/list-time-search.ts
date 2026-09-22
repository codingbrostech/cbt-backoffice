import { TIME_RANGE_PRESETS, type ISearchField, type TTimeRangePreset } from '~/types/data-table';
import dayjs, { type DateType } from '~/utils/date';

export type TListTimeMaxMonths = 1 | 3;

export const TIME_RANGE_MAX_ONE_MONTH = 1 as const satisfies TListTimeMaxMonths;
export const TIME_RANGE_MAX_THREE_MONTHS = 3 as const satisfies TListTimeMaxMonths;

export const DEFAULT_TIME_RANGE_PRESET = 'thisMonth' as const satisfies TTimeRangePreset;

export const TIME_RANGE_PRESET_FIELD = 'timeRangePreset';
export const TIME_RANGE_FROM_FIELD = 'timeFrom';
export const TIME_RANGE_TO_FIELD = 'timeTo';

export function isTimeRangePreset(value?: string | null): value is TTimeRangePreset {
  return Boolean(value && TIME_RANGE_PRESETS.some(preset => preset === value));
}

/**
 * Concrete window for a preset (weeks start Monday, "this ..." presets end today).
 * Returns null for `custom`, whose range is user-defined.
 */
export function getListTimePresetRange(
  preset: TTimeRangePreset
): { timeFrom: DateType; timeTo: DateType } | null {
  if (preset === 'custom') {
    return null;
  }

  const now = dayjs();

  switch (preset) {
    case 'today':
      return { timeFrom: now.startOf('day'), timeTo: now.endOf('day') };
    case 'yesterday': {
      const yesterday = now.subtract(1, 'day');
      return { timeFrom: yesterday.startOf('day'), timeTo: yesterday.endOf('day') };
    }
    case 'thisWeek':
      return { timeFrom: now.startOf('isoWeek'), timeTo: now.endOf('day') };
    case 'lastWeek': {
      const lastWeek = now.subtract(1, 'week');
      return { timeFrom: lastWeek.startOf('isoWeek'), timeTo: lastWeek.endOf('isoWeek') };
    }
    case 'thisMonth':
      return { timeFrom: now.startOf('month'), timeTo: now.endOf('day') };
    case 'lastMonth': {
      const lastMonth = now.subtract(1, 'month');
      return { timeFrom: lastMonth.startOf('month'), timeTo: lastMonth.endOf('month') };
    }
  }
}

/** Range applied on load/reset: the preset window, or the default window for `custom`. */
export function getListTimePresetDefaultRange(
  preset: TTimeRangePreset,
  maxMonths: TListTimeMaxMonths
): { timeFrom: DateType; timeTo: DateType } {
  return getListTimePresetRange(preset) ?? getListTimeDefaultRange(maxMonths);
}

export function getListTimePresetDefaults(
  maxMonths: TListTimeMaxMonths,
  defaultPreset: TTimeRangePreset = DEFAULT_TIME_RANGE_PRESET
): { timeRangePreset: TTimeRangePreset; timeFrom: DateType; timeTo: DateType } {
  return {
    timeRangePreset: defaultPreset,
    ...getListTimePresetDefaultRange(defaultPreset, maxMonths)
  };
}

/** Default paired time window: N months of whole days, ending at end of today. */
export function getListTimeDefaultRange(maxMonths: TListTimeMaxMonths): {
  timeFrom: DateType;
  timeTo: DateType;
} {
  const timeTo = dayjs().endOf('day');
  const firstDay = timeTo.subtract(maxMonths, 'month').add(1, 'day');
  return { timeFrom: firstDay.startOf('day'), timeTo };
}

function isStoredTimeRangeSet(stored: {
  timeFrom?: DateType | null;
  timeTo?: DateType | null;
}): boolean {
  const timeFrom = toDateFormValue(stored.timeFrom);
  const timeTo = toDateFormValue(stored.timeTo);
  return (timeFrom != null && timeFrom !== '') || (timeTo != null && timeTo !== '');
}

/** Apply default time range when stored search params have no timeFrom/timeTo. */
export function resolveListTimeInitParams<
  T extends { timeFrom?: DateType | null; timeTo?: DateType | null }
>(
  stored: T | null | undefined,
  maxMonths: TListTimeMaxMonths
): T | ReturnType<typeof getListTimeDefaultRange> {
  if (stored == null) {
    return getListTimeDefaultRange(maxMonths);
  }

  if (!isStoredTimeRangeSet(stored)) {
    return { ...stored, ...getListTimeDefaultRange(maxMonths) };
  }

  return stored;
}

/**
 * Preset-aware variant of `resolveListTimeInitParams`.
 * A stored non-custom preset recomputes its window fresh (e.g. `today` stays today's date).
 */
export function resolveListTimePresetInitParams<
  T extends {
    timeFrom?: DateType | null;
    timeTo?: DateType | null;
    timeRangePreset?: TTimeRangePreset | null;
  }
>(
  stored: T | null | undefined,
  maxMonths: TListTimeMaxMonths,
  defaultPreset: TTimeRangePreset = DEFAULT_TIME_RANGE_PRESET
): T | ReturnType<typeof getListTimePresetDefaults> {
  const defaults = getListTimePresetDefaults(maxMonths, defaultPreset);

  if (stored == null) {
    return defaults;
  }

  if (!isStoredTimeRangeSet(stored)) {
    return { ...stored, ...defaults };
  }

  const storedPreset = isTimeRangePreset(stored.timeRangePreset)
    ? stored.timeRangePreset
    : 'custom';
  const storedPresetRange = getListTimePresetRange(storedPreset);

  if (!storedPresetRange) {
    return { ...stored, timeRangePreset: storedPreset };
  }

  return { ...stored, timeRangePreset: storedPreset, ...storedPresetRange };
}

/** Upper bound for list datetime filters: end of local today (no future dates/times). */
export function listSearchDatetimeMaxTodayProps(): Pick<ISearchField, 'maxDate'> {
  return {
    maxDate: dayjs().endOf('day')
  };
}

/** Shared `inputType` + `maxDate` for paired list time filters (no earliest-date limit). */
export function listTimeDatetimeSearchProps(): Pick<ISearchField, 'inputType' | 'maxDate'> {
  return {
    inputType: 'datetime',
    ...listSearchDatetimeMaxTodayProps()
  };
}

type TTimeRangeSearchFieldProps = Pick<
  ISearchField,
  'inputType' | 'maxDate' | 'timeRangeMaxMonths' | 'timeRangeRole' | 'timeRangePartner'
>;

export function listTimeFromSearchProps(
  maxMonths: TListTimeMaxMonths,
  toField = 'timeTo'
): TTimeRangeSearchFieldProps {
  return {
    ...listTimeDatetimeSearchProps(),
    timeRangeMaxMonths: maxMonths,
    timeRangeRole: 'from',
    timeRangePartner: toField
  };
}

export function listTimeToSearchProps(
  maxMonths: TListTimeMaxMonths,
  fromField = 'timeFrom'
): TTimeRangeSearchFieldProps {
  return {
    ...listTimeDatetimeSearchProps(),
    timeRangeMaxMonths: maxMonths,
    timeRangeRole: 'to',
    timeRangePartner: fromField
  };
}

interface IListTimeRangePresetSearchFieldsOptions {
  maxMonths: TListTimeMaxMonths;
  defaultPreset?: TTimeRangePreset;
  presetLabel?: string;
  fromLabel: string;
  toLabel: string;
}

/**
 * Search fields for a preset-driven paired time range:
 * a `timeRangePreset` select followed by clamped `from` / `to` datetime pickers.
 */
export function listTimeRangePresetSearchFields(
  options: IListTimeRangePresetSearchFieldsOptions
): ISearchField[] {
  const {
    maxMonths,
    defaultPreset = DEFAULT_TIME_RANGE_PRESET,
    presetLabel = 'timeRangePreset.label',
    fromLabel,
    toLabel
  } = options;

  return [
    {
      label: presetLabel,
      name: TIME_RANGE_PRESET_FIELD,
      inputType: 'timeRangePreset',
      timeRangeMaxMonths: maxMonths,
      timeRangeDefaultPreset: defaultPreset,
      timeRangeFromField: TIME_RANGE_FROM_FIELD,
      timeRangeToField: TIME_RANGE_TO_FIELD
    },
    {
      label: fromLabel,
      name: TIME_RANGE_FROM_FIELD,
      timeRangePresetField: TIME_RANGE_PRESET_FIELD,
      ...listTimeFromSearchProps(maxMonths, TIME_RANGE_TO_FIELD)
    },
    {
      label: toLabel,
      name: TIME_RANGE_TO_FIELD,
      timeRangePresetField: TIME_RANGE_PRESET_FIELD,
      ...listTimeToSearchProps(maxMonths, TIME_RANGE_FROM_FIELD)
    }
  ];
}

type TOptionalTimeRangeSearchFieldProps = Pick<
  ISearchField,
  | 'inputType'
  | 'withDateBounds'
  | 'timeRangeMaxMonths'
  | 'timeRangeRole'
  | 'timeRangePartner'
  | 'optionalPairedTimeRange'
>;

/** Simple datetime fields: 3-month pair clamp applies only after user sets from or to. */
export function listOptionalTimeFromSearchProps(
  maxMonths: TListTimeMaxMonths,
  toField = 'timeTo'
): TOptionalTimeRangeSearchFieldProps {
  return {
    inputType: 'datetime',
    withDateBounds: false,
    timeRangeMaxMonths: maxMonths,
    timeRangeRole: 'from',
    timeRangePartner: toField,
    optionalPairedTimeRange: true
  };
}

export function listOptionalTimeToSearchProps(
  maxMonths: TListTimeMaxMonths,
  fromField = 'timeFrom'
): TOptionalTimeRangeSearchFieldProps {
  return {
    inputType: 'datetime',
    withDateBounds: false,
    timeRangeMaxMonths: maxMonths,
    timeRangeRole: 'to',
    timeRangePartner: fromField,
    optionalPairedTimeRange: true
  };
}

export function hasOptionalPairedTimeFields(fields: ISearchField[]): boolean {
  return fields.some(f => f.optionalPairedTimeRange && f.inputType === 'datetime');
}

/** Clear optional paired datetime fields (used on reset — no default range). */
export function clearOptionalPairedTimeFieldValues<T extends object>(
  fields: ISearchField[],
  values: T
): T {
  if (!hasOptionalPairedTimeFields(fields)) {
    return values;
  }

  const result = { ...values };
  for (const field of fields) {
    if (field.optionalPairedTimeRange && field.inputType === 'datetime') {
      Reflect.set(result, field.name, null);
    }
  }
  return result;
}

function hasFullPairedTimeFields(fields: ISearchField[]): boolean {
  return fields.some(
    f =>
      !f.optionalPairedTimeRange &&
      f.timeRangeMaxMonths &&
      f.timeRangeRole &&
      f.timeRangePartner &&
      f.inputType === 'datetime'
  );
}

/** Restore default paired time window on reset (full paired range pages). */
export function applyFullPairedTimeRangeDefaults<T extends object>(
  fields: ISearchField[],
  values: T
): T | null {
  if (!hasFullPairedTimeFields(fields)) {
    return null;
  }

  const processedPairs = new Set<string>();
  let result = { ...values };

  for (const field of fields) {
    if (field.optionalPairedTimeRange) continue;
    const { name, timeRangeMaxMonths, timeRangeRole, timeRangePartner, timeRangePresetField } =
      field;
    if (!timeRangeMaxMonths || !timeRangeRole || !timeRangePartner) continue;

    const fromName = timeRangeRole === 'from' ? name : timeRangePartner;
    const toName = timeRangeRole === 'to' ? name : timeRangePartner;
    const pairKey = `${fromName}::${toName}`;
    if (processedPairs.has(pairKey)) continue;
    processedPairs.add(pairKey);

    const presetField = timeRangePresetField
      ? fields.find(f => f.name === timeRangePresetField)
      : undefined;
    const defaultPreset = presetField?.timeRangeDefaultPreset ?? DEFAULT_TIME_RANGE_PRESET;
    const defaults = getListTimePresetDefaultRange(defaultPreset, timeRangeMaxMonths);
    result = {
      ...result,
      [fromName]: defaults.timeFrom,
      [toName]: defaults.timeTo,
      ...(timeRangePresetField && { [timeRangePresetField]: defaultPreset })
    };
  }

  return result;
}

export function getListTimePickerDateBounds(
  field: Pick<
    ISearchField,
    'withDateBounds' | 'blockFutureDate' | 'minDate' | 'maxDate' | 'timeRangeMaxMonths'
  >
): { minDate?: DateType; maxDate?: DateType } {
  const bounds: { minDate?: DateType; maxDate?: DateType } = {};
  const hasPairedRange = field.timeRangeMaxMonths != null;
  const useMinDateBounds =
    field.withDateBounds === true || (field.withDateBounds == null && hasPairedRange);
  const todayMax = listSearchDatetimeMaxTodayProps().maxDate;

  if (useMinDateBounds) {
    bounds.minDate = field.minDate;
    bounds.maxDate = field.blockFutureDate === false ? field.maxDate : (field.maxDate ?? todayMax);
    return bounds;
  }

  if (field.blockFutureDate !== false) {
    bounds.maxDate = field.maxDate ?? todayMax;
  }

  return bounds;
}

function isOptionalPairedTimeRange(
  fields: ISearchField[],
  fromName: string,
  toName: string
): boolean {
  return fields.some(
    f =>
      f.optionalPairedTimeRange &&
      f.timeRangeMaxMonths &&
      ((f.name === fromName && f.timeRangePartner === toName) ||
        (f.name === toName && f.timeRangePartner === fromName))
  );
}

function toValidDayjs(value: DateType | null | undefined) {
  if (value == null || value === '') return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : null;
}

/** Compares two form date values regardless of underlying type (dayjs, Date, string). */
export function areSameDateTime(
  a: DateType | null | undefined,
  b: DateType | null | undefined
): boolean {
  const aDayjs = toValidDayjs(a);
  const bDayjs = toValidDayjs(b);
  if (!aDayjs && !bDayjs) return (a ?? null) === (b ?? null);
  if (!aDayjs || !bDayjs) return false;
  return aDayjs.isSame(bDayjs);
}

function endOfToday() {
  return dayjs().endOf('day');
}

/** Earliest allowed "from" bound: start of the day maxMonths before to. */
function minAllowedFrom(toDayjs: dayjs.Dayjs, maxMonths: TListTimeMaxMonths) {
  return toDayjs.subtract(maxMonths, 'month').startOf('day');
}

/** Latest allowed "to" bound: end of the day maxMonths after from, capped at end of today. */
function maxAllowedTo(fromDayjs: dayjs.Dayjs, maxMonths: TListTimeMaxMonths) {
  const spanEnd = fromDayjs.add(maxMonths, 'month').endOf('day');
  const todayEnd = endOfToday();
  return spanEnd.isAfter(todayEnd) ? todayEnd : spanEnd;
}

/**
 * On search, fill only the cleared side of a paired range, then clamp to maxMonths.
 * - both empty → default window (N months of whole days ending today)
 * - from empty, to set → start of the day N months before to
 * - to empty, from set → end of the day N months after from, capped at end of today
 */
export function fillMissingPairedTimeRangeValues<T extends object>(
  fields: ISearchField[],
  values: T
): T {
  const processedPairs = new Set<string>();
  let result = { ...values };

  for (const field of fields) {
    const { name, timeRangeMaxMonths, timeRangeRole, timeRangePartner } = field;
    if (!timeRangeMaxMonths || !timeRangeRole || !timeRangePartner) continue;

    const fromName = timeRangeRole === 'from' ? name : timeRangePartner;
    const toName = timeRangeRole === 'to' ? name : timeRangePartner;
    const pairKey = `${fromName}::${toName}`;
    if (processedPairs.has(pairKey)) continue;
    processedPairs.add(pairKey);

    let fromDayjs = toValidDayjs(toDateFormValue(Reflect.get(result, fromName)));
    let toDayjs = toValidDayjs(toDateFormValue(Reflect.get(result, toName)));

    if (!fromDayjs && !toDayjs) {
      if (isOptionalPairedTimeRange(fields, fromName, toName)) {
        continue;
      }
      const defaults = getListTimeDefaultRange(timeRangeMaxMonths);
      result = { ...result, [fromName]: defaults.timeFrom, [toName]: defaults.timeTo };
      continue;
    }

    if (!fromDayjs && toDayjs) {
      fromDayjs = minAllowedFrom(toDayjs, timeRangeMaxMonths);
      result = { ...result, [fromName]: fromDayjs.toDate() };
    } else if (fromDayjs && !toDayjs) {
      toDayjs = maxAllowedTo(fromDayjs, timeRangeMaxMonths);
      result = { ...result, [toName]: toDayjs.toDate() };
    }

    const clampedFromAnchor = clampPairedTimeRange(
      toDateFormValue(Reflect.get(result, fromName)),
      toDateFormValue(Reflect.get(result, toName)),
      timeRangeMaxMonths,
      'from'
    );
    const clamped = clampPairedTimeRange(
      clampedFromAnchor.timeFrom,
      clampedFromAnchor.timeTo,
      timeRangeMaxMonths,
      'to'
    );

    result = {
      ...result,
      [fromName]: clamped.timeFrom ?? null,
      [toName]: clamped.timeTo ?? null
    };
  }

  return result;
}

export function toDateFormValue(value: unknown): DateType | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return value;
  if (typeof value === 'number' || Array.isArray(value)) return undefined;
  if (dayjs.isDayjs(value)) return value;
  if (typeof value === 'string' || value instanceof Date) return value;
  return undefined;
}

type TPairedTimeRangeFieldConfig = Pick<
  ISearchField,
  'name' | 'timeRangeMaxMonths' | 'timeRangeRole' | 'timeRangePartner'
>;

/**
 * Clamps a from/to pair to maxMonths.
 * `anchor` is the field the user changed: adjusts the partner when out of range.
 */
function clampPairedTimeRange(
  timeFrom: DateType | null | undefined,
  timeTo: DateType | null | undefined,
  maxMonths: TListTimeMaxMonths,
  anchor: 'from' | 'to'
): { timeFrom: DateType | null | undefined; timeTo: DateType | null | undefined } {
  if (anchor === 'from') {
    const fromDayjs = toValidDayjs(timeFrom);
    if (!fromDayjs) {
      return { timeFrom, timeTo };
    }

    const maxTo = maxAllowedTo(fromDayjs, maxMonths);
    let nextTo = timeTo;
    const toDayjs = toValidDayjs(nextTo);
    if (!toDayjs || toDayjs.isBefore(fromDayjs)) {
      nextTo = maxTo.toDate();
    } else if (toDayjs.isAfter(maxTo)) {
      nextTo = maxTo.toDate();
    }

    return { timeFrom, timeTo: nextTo };
  }

  const toDayjs = toValidDayjs(timeTo);
  if (!toDayjs) {
    return { timeFrom, timeTo };
  }

  const minFrom = minAllowedFrom(toDayjs, maxMonths);
  let nextFrom = timeFrom;
  const fromDayjs = toValidDayjs(nextFrom);
  if (!fromDayjs || fromDayjs.isAfter(toDayjs) || fromDayjs.isBefore(minFrom)) {
    nextFrom = minFrom.toDate();
  }

  return { timeFrom: nextFrom, timeTo };
}

/** Applies paired range clamping after a single datetime field changes. */
export function applyPairedTimeRangeFormValues(
  field: TPairedTimeRangeFieldConfig,
  value: DateType | null,
  currentValues: object
): Record<string, DateType | null> {
  const { name, timeRangeMaxMonths, timeRangeRole, timeRangePartner } = field;
  if (!timeRangeMaxMonths || !timeRangeRole || !timeRangePartner) {
    return { [name]: value };
  }

  const partnerValue = toDateFormValue(Reflect.get(currentValues, timeRangePartner));
  const timeFrom = timeRangeRole === 'from' ? value : partnerValue;
  const timeTo = timeRangeRole === 'to' ? value : partnerValue;
  const firstPass = clampPairedTimeRange(timeFrom, timeTo, timeRangeMaxMonths, timeRangeRole);
  const clamped =
    timeFrom != null && timeTo != null
      ? clampPairedTimeRange(
          firstPass.timeFrom,
          firstPass.timeTo,
          timeRangeMaxMonths,
          timeRangeRole === 'from' ? 'to' : 'from'
        )
      : firstPass;

  return {
    [name]: (timeRangeRole === 'from' ? clamped.timeFrom : clamped.timeTo) ?? null,
    [timeRangePartner]: (timeRangeRole === 'from' ? clamped.timeTo : clamped.timeFrom) ?? null
  };
}

/** Clamps an existing from/to pair before submit (both anchors applied when both are set). */
export function clampPairedTimeRangeValues<
  T extends { timeFrom?: DateType | null; timeTo?: DateType | null }
>(values: T, maxMonths: TListTimeMaxMonths): T {
  const { timeFrom, timeTo } = values;
  if (timeFrom == null && timeTo == null) {
    return values;
  }

  const anchor = timeFrom != null ? 'from' : 'to';
  const firstPass = clampPairedTimeRange(timeFrom, timeTo, maxMonths, anchor);
  const clamped =
    timeFrom != null && timeTo != null
      ? clampPairedTimeRange(firstPass.timeFrom, firstPass.timeTo, maxMonths, 'to')
      : firstPass;

  return {
    ...values,
    timeFrom: clamped.timeFrom ?? undefined,
    timeTo: clamped.timeTo ?? undefined
  };
}
