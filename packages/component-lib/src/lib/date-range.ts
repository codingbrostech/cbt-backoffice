/**
 * Local date-time value formatted `YYYY-MM-DDTHH:mm`, the form of an
 * `<input type="datetime-local">` value.
 */
export type TLocalDateTime = string;

export interface IDateTimeRange {
  from: TLocalDateTime;
  to: TLocalDateTime;
}

export const QUICK_RANGES = [
  'today',
  'yesterday',
  'thisWeek',
  'lastWeek',
  'thisMonth',
  'lastMonth'
] as const;

export type TQuickRange = (typeof QUICK_RANGES)[number];

/**
 * Longest span in months a range may cover, and the length of the custom
 * range's starting window.
 */
export const RANGE_MAX_MONTHS = 1;

export const DAY_START_TIME = '00:00';
export const DAY_END_TIME = '23:59';

const MS_PER_MINUTE = 60_000;
const DAYS_PER_WEEK = 7;

const pad = (value: number): string => String(Math.abs(value)).padStart(2, '0');

const buildUtcDate = (year: number, month: number, day: number): Date =>
  new Date(Date.UTC(year, month, day));

const formatUtcDay = (date: Date): string =>
  [date.getUTCFullYear(), pad(date.getUTCMonth() + 1), pad(date.getUTCDate())].join('-');

const formatLocalDateTime = (date: Date): TLocalDateTime =>
  `${formatUtcDay(date)}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`;

const parseLocalDateTime = (value: TLocalDateTime): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);

  if (!match) return undefined;

  const [, year = 0, month = 1, day = 1, hours = 0, minutes = 0] = match.map(Number);

  return new Date(Date.UTC(year, month - 1, day, hours, minutes));
};

const buildDayTime = (day: Date, time: string): Date => {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);

  return new Date(
    Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), hours, minutes)
  );
};

const shiftUtcMonths = (date: Date, months: number): Date => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + months;

  const monthEnd = buildUtcDate(year, month + 1, 0);
  const day = Math.min(date.getUTCDate(), monthEnd.getUTCDate());

  return buildUtcDate(year, month, day);
};

const clampToBound = (
  range: IDateTimeRange,
  months: number,
  latestTime: Date | undefined
): IDateTimeRange => {
  const fromTime = parseLocalDateTime(range.from);

  if (!fromTime) return range;

  const toTime = parseLocalDateTime(range.to);
  const spanEnd = buildDayTime(shiftUtcMonths(fromTime, months), DAY_END_TIME);
  const maxTo = latestTime && latestTime.getTime() < spanEnd.getTime() ? latestTime : spanEnd;
  const isToInSpan =
    toTime && toTime.getTime() >= fromTime.getTime() && toTime.getTime() <= maxTo.getTime();

  return { from: range.from, to: isToInSpan ? range.to : formatLocalDateTime(maxTo) };
};

const clampFromBound = (range: IDateTimeRange, months: number): IDateTimeRange => {
  const toTime = parseLocalDateTime(range.to);

  if (!toTime) return range;

  const fromTime = parseLocalDateTime(range.from);
  const minFrom = buildDayTime(shiftUtcMonths(toTime, -months), DAY_START_TIME);
  const isFromInSpan =
    fromTime && fromTime.getTime() <= toTime.getTime() && fromTime.getTime() >= minFrom.getTime();

  return { from: isFromInSpan ? range.from : formatLocalDateTime(minFrom), to: range.to };
};

/**
 * The calendar date of a local date-time as a local `Date` at midnight.
 * A blank or malformed value gives `undefined`.
 *
 * @example
 * buildCalendarDate('2026-10-13T08:30'); // 2026-10-13 00:00 in the browser timezone
 */
export const buildCalendarDate = (value: TLocalDateTime): Date | undefined => {
  const [day = ''] = value.split('T');
  const [year, month, date] = day.split('-').map(Number);

  return year && month && date ? new Date(year, month - 1, date) : undefined;
};

/**
 * The `HH:mm` part of a local date-time, or `fallback` when the value is blank.
 *
 * @example
 * buildTimePart('2026-10-13T08:30', DAY_START_TIME); // '08:30'
 */
export const buildTimePart = (value: TLocalDateTime, fallback: string): string => {
  const [, time = fallback] = value.split('T');

  return time;
};

/**
 * A local date-time from the calendar date of a local `Date` and a `HH:mm`
 * time. Without a date the value is blank.
 *
 * @example
 * buildLocalDateTime(new Date(2026, 9, 13), '23:59'); // '2026-10-13T23:59'
 */
export const buildLocalDateTime = (date: Date | undefined, time: string): TLocalDateTime => {
  if (!date) return '';

  const day = [date.getFullYear(), pad(date.getMonth() + 1), pad(date.getDate())].join('-');

  return `${day}T${time}`;
};

/**
 * The local date-time typed as `YYYY-MM-DD HH:mm`. Text in another shape, or
 * naming a day or time that does not exist, gives `undefined`.
 *
 * @example
 * buildTypedDateTime(' 2026-10-13 08:30 '); // '2026-10-13T08:30'
 * buildTypedDateTime('2026-02-30 08:30'); // undefined
 */
export const buildTypedDateTime = (text: string): TLocalDateTime | undefined => {
  const trimmedText = text.trim();
  const value = trimmedText.replace(' ', 'T');
  const date = parseLocalDateTime(value);

  return date && formatLocalDateTime(date) === value ? value : undefined;
};

/**
 * The local calendar date `months` months after `date`, or before it when
 * `months` is negative. A day missing from the target month falls back to that
 * month's last day.
 *
 * @example
 * buildShiftedCalendarDate(new Date(2026, 2, 31), -1); // 2026-02-28 00:00 local
 */
export const buildShiftedCalendarDate = (date: Date, months: number): Date => {
  const year = date.getFullYear();
  const month = date.getMonth() + months;

  const monthEnd = new Date(year, month + 1, 0);
  const day = Math.min(date.getDate(), monthEnd.getDate());

  return new Date(year, month, day);
};

/**
 * A preset range of whole days at `offsetMinutes` from UTC, with weeks
 * starting on Monday. The `thisWeek` and `thisMonth` ranges end on today.
 *
 * @example
 * buildQuickRange('yesterday', new Date('2026-10-13T20:00:00Z'), 480);
 * // { from: '2026-10-13T00:00', to: '2026-10-13T23:59' }
 */
export const buildQuickRange = (
  kind: TQuickRange,
  now: Date,
  offsetMinutes: number
): IDateTimeRange => {
  const shiftedNow = new Date(now.getTime() + offsetMinutes * MS_PER_MINUTE);
  const year = shiftedNow.getUTCFullYear();
  const month = shiftedNow.getUTCMonth();
  const day = shiftedNow.getUTCDate();
  const weekday = (shiftedNow.getUTCDay() + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK;

  const monday = day - weekday;
  const bounds = {
    today: [buildUtcDate(year, month, day), buildUtcDate(year, month, day)],
    yesterday: [buildUtcDate(year, month, day - 1), buildUtcDate(year, month, day - 1)],
    thisWeek: [buildUtcDate(year, month, monday), buildUtcDate(year, month, day)],
    lastWeek: [buildUtcDate(year, month, monday - 7), buildUtcDate(year, month, monday - 1)],
    thisMonth: [buildUtcDate(year, month, 1), buildUtcDate(year, month, day)],
    lastMonth: [buildUtcDate(year, month - 1, 1), buildUtcDate(year, month, 0)]
  } as const satisfies Record<TQuickRange, readonly [Date, Date]>;
  const [start, end] = bounds[kind];

  return {
    from: `${formatUtcDay(start)}T${DAY_START_TIME}`,
    to: `${formatUtcDay(end)}T${DAY_END_TIME}`
  };
};

/**
 * The starting window of a custom range at `offsetMinutes` from UTC. It covers
 * `months` months of whole days and ends on today. A start day missing from
 * the shorter month falls back to that month's last day.
 *
 * @example
 * buildCustomRange(new Date('2026-10-13T20:00:00Z'), 480, 1);
 * // { from: '2026-09-15T00:00', to: '2026-10-14T23:59' }
 */
export const buildCustomRange = (
  now: Date,
  offsetMinutes: number,
  months: number
): IDateTimeRange => {
  const shiftedNow = new Date(now.getTime() + offsetMinutes * MS_PER_MINUTE);
  const year = shiftedNow.getUTCFullYear();
  const month = shiftedNow.getUTCMonth();
  const day = shiftedNow.getUTCDate();

  const end = buildUtcDate(year, month, day);
  const windowStart = shiftUtcMonths(end, -months);
  const start = buildUtcDate(
    windowStart.getUTCFullYear(),
    windowStart.getUTCMonth(),
    windowStart.getUTCDate() + 1
  );

  return {
    from: `${formatUtcDay(start)}T${DAY_START_TIME}`,
    to: `${formatUtcDay(end)}T${DAY_END_TIME}`
  };
};

/**
 * Keeps a range within `months` months and no later than `latest`. The start
 * holds and the end moves when the end is blank, before the start or past
 * either limit. The end then holds and the start moves when it is blank or
 * more than `months` months earlier.
 *
 * @example
 * clampDateTimeRange({ from: '2026-08-01T00:00', to: '2026-10-14T23:59' }, 1, '2026-10-14T23:59');
 * // { from: '2026-08-01T00:00', to: '2026-09-01T23:59' }
 */
export const clampDateTimeRange = (
  range: IDateTimeRange,
  months: number,
  latest: TLocalDateTime
): IDateTimeRange => {
  const latestTime = parseLocalDateTime(latest);

  const toBounded = clampToBound(range, months, latestTime);

  return clampFromBound(toBounded, months);
};

/**
 * The range a search applies at `offsetMinutes` from UTC. A fully blank
 * range becomes the custom range's starting window, and any other range is
 * kept within `months` months ending no later than today.
 *
 * @example
 * buildSearchRange({ from: '2026-10-01T00:00', to: '' }, new Date('2026-10-14T04:00:00Z'), 480, 1);
 * // { from: '2026-10-01T00:00', to: '2026-10-14T23:59' }
 */
export const buildSearchRange = (
  range: IDateTimeRange,
  now: Date,
  offsetMinutes: number,
  months: number
): IDateTimeRange => {
  if (!range.from && !range.to) return buildCustomRange(now, offsetMinutes, months);

  const { to: latest } = buildQuickRange('today', now, offsetMinutes);

  return clampDateTimeRange(range, months, latest);
};

/**
 * The `GMT±H` label of a UTC offset in minutes, with `:mm` when the offset
 * is not a whole hour.
 *
 * @example
 * buildGmtLabel(480); // 'GMT+8'
 * buildGmtLabel(-570); // 'GMT-9:30'
 */
export const buildGmtLabel = (offsetMinutes: number): string => {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const hours = Math.trunc(Math.abs(offsetMinutes) / 60);
  const minutes = Math.abs(offsetMinutes) % 60;
  const minutesSuffix = minutes ? `:${pad(minutes)}` : '';

  return `GMT${sign}${hours}${minutesSuffix}`;
};
