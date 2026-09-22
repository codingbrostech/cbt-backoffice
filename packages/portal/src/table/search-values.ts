import dayjs from 'dayjs';
import { z } from 'zod';

import { TIME_RANGE_PRESETS, type ISearchField } from '~/types/data-table';
import { type DateType, convertToDateParam } from '~/utils/date';
import {
  fillMissingPairedTimeRangeValues,
  isTimeRangePreset,
  resolveListTimePresetInitParams,
  toDateFormValue
} from '~/utils/list-time-search';

import { DEFAULT_PAGE_SIZE, type IListParams } from './types';

/**
 * A search form value. Dates may be any dayjs input while editing and are
 * normalised to strings before they reach the route.
 */
export type TSearchFormValue = string | string[] | boolean | DateType | null | undefined;

export type TSearchValues = Record<string, TSearchFormValue>;

export type TListSearch = IListParams & TSearchValues;

const DATE_OUTPUT_FORMATS = {
  date: 'YYYY-MM-DD',
  month: 'YYYY-MM'
} as const;

const isLikeFieldName = (name: string): string => `${name}IsLike`;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(item => typeof item === 'string');

/**
 * zod schema of a list route's search params: `page`, `pageSize` and one
 * optional entry per search field (an array for multi selects, a boolean for
 * the `IsLike` flag of `withIsLike` fields). Text values are coerced, so a
 * hand-typed numeric value such as `?mobile=961` still reaches the field.
 */
export const buildListSearchSchema = (fields: ISearchField[]) => {
  const shape: Record<string, z.ZodType> = {
    page: z.number().int().min(1).default(1),
    pageSize: z.number().int().min(1).default(DEFAULT_PAGE_SIZE)
  };

  for (const field of fields) {
    const { name, inputType = 'text', isMultiSelect, withIsLike } = field;

    if (inputType === 'select' && isMultiSelect) {
      shape[name] = z.array(z.string()).optional();
    } else if (inputType === 'timeRangePreset') {
      shape[name] = z.enum(TIME_RANGE_PRESETS).optional();
    } else {
      shape[name] = z.coerce.string().optional();
    }

    if (withIsLike) shape[isLikeFieldName(name)] = z.boolean().optional();
  }

  return z.object(shape);
};

export type TListSearchSchema = ReturnType<typeof buildListSearchSchema>;

const normalizeDateValue = (value: TSearchFormValue, inputType: string): string | undefined => {
  const dateValue = toDateFormValue(value);
  if (dateValue === null || dateValue === undefined || dateValue === '') return undefined;

  const parsed = dayjs(dateValue);
  if (!parsed.isValid()) return undefined;

  return inputType === 'datetime'
    ? convertToDateParam(parsed)
    : parsed.format(inputType === 'month' ? DATE_OUTPUT_FORMATS.month : DATE_OUTPUT_FORMATS.date);
};

/**
 * Search values ready for the route: dates become strings, empty values are
 * dropped, and only known fields plus `page` and `pageSize` remain.
 */
export const normalizeSearchValues = (
  fields: ISearchField[],
  values: TSearchValues & Partial<IListParams>
): TListSearch => {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE } = values;
  const normalized: TSearchValues = {};

  for (const field of fields) {
    const { name, inputType = 'text', withIsLike } = field;
    const raw = values[name];

    if (inputType === 'datetime' || inputType === 'date' || inputType === 'month') {
      normalized[name] = normalizeDateValue(raw, inputType);
    } else if (Array.isArray(raw)) {
      normalized[name] = raw.length ? raw : undefined;
    } else if (typeof raw === 'string') {
      normalized[name] = raw || undefined;
    } else if (typeof raw === 'boolean') {
      normalized[name] = raw;
    } else {
      normalized[name] = undefined;
    }

    if (withIsLike) {
      const isLike = values[isLikeFieldName(name)];
      normalized[isLikeFieldName(name)] = isLike === true ? true : undefined;
    }
  }

  return { page, pageSize, ...normalized };
};

const findPresetField = (fields: ISearchField[]): ISearchField | undefined =>
  fields.find(field => field.inputType === 'timeRangePreset');

/**
 * Route search values with the page's default time window applied when the
 * route carries none. Preset ranges are recomputed so `today` stays today.
 */
export const buildInitialSearchValues = (
  fields: ISearchField[],
  search: TListSearch
): TListSearch => {
  const presetField = findPresetField(fields);

  if (presetField) {
    const {
      timeRangeMaxMonths = 1,
      timeRangeDefaultPreset,
      timeRangeFromField = 'timeFrom',
      timeRangeToField = 'timeTo',
      name
    } = presetField;
    const rawPreset = search[name];
    const stored = {
      timeFrom: toDateFormValue(search[timeRangeFromField]),
      timeTo: toDateFormValue(search[timeRangeToField]),
      timeRangePreset:
        typeof rawPreset === 'string' && isTimeRangePreset(rawPreset) ? rawPreset : undefined
    };
    const resolved = resolveListTimePresetInitParams(
      stored,
      timeRangeMaxMonths,
      timeRangeDefaultPreset
    );

    return normalizeSearchValues(fields, {
      ...search,
      [timeRangeFromField]: resolved.timeFrom,
      [timeRangeToField]: resolved.timeTo,
      [name]: resolved.timeRangePreset
    });
  }

  return normalizeSearchValues(fields, fillMissingPairedTimeRangeValues(fields, search));
};

const buildIsLikeParam = (value: string | undefined, isLike: boolean | undefined) =>
  value ? `${isLike ? 'like:' : ''}${value}` : undefined;

/**
 * API parameters derived from route search values: `IsLike` flags become a
 * `like:` prefix, multi selects join with commas and preset fields are dropped.
 */
export const buildListParams = <TParams extends object>(
  fields: ISearchField[],
  search: TListSearch
): TParams => {
  const params: Record<string, unknown> = { page: search.page, pageSize: search.pageSize };

  for (const field of fields) {
    const { name, inputType = 'text', withIsLike, isMultiSelect } = field;
    const raw = search[name];

    if (inputType === 'timeRangePreset') continue;

    if (inputType === 'datetime') {
      const dateValue = toDateFormValue(raw);
      params[name] = dateValue ? convertToDateParam(dateValue) : undefined;
    } else if (inputType === 'select' && isMultiSelect) {
      params[name] = isStringArray(raw) && raw.length ? raw.join(',') : undefined;
    } else if (withIsLike) {
      const isLike = search[isLikeFieldName(name)];
      params[name] = buildIsLikeParam(
        typeof raw === 'string' ? raw : undefined,
        typeof isLike === 'boolean' ? isLike : undefined
      );
    } else {
      params[name] = typeof raw === 'string' && raw ? raw : undefined;
    }
  }

  return params as TParams;
};

/**
 * The search field values of a route search, without `page` and `pageSize`.
 */
export const pickSearchFieldValues = (
  fields: ISearchField[],
  search: TListSearch
): TSearchValues => {
  const values: TSearchValues = {};

  for (const field of fields) {
    values[field.name] = search[field.name];
    if (field.withIsLike) values[isLikeFieldName(field.name)] = search[isLikeFieldName(field.name)];
  }

  return values;
};
