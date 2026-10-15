/**
 * Local date-time value of an `<input type="datetime-local">`, formatted
 * `YYYY-MM-DDTHH:mm`.
 */
export type TLocalDateTime = string;

const pad = (value: number): string => String(Math.abs(value)).padStart(2, '0');

/**
 * The `±HH:mm` suffix of an RFC3339 time for a UTC offset in minutes.
 *
 * @example
 * buildOffsetSuffix(480); // '+08:00'
 */
export const buildOffsetSuffix = (offsetMinutes: number): string => {
  const sign = offsetMinutes < 0 ? '-' : '+';
  const hours = Math.trunc(offsetMinutes / 60);
  const minutes = offsetMinutes % 60;

  return `${sign}${pad(hours)}:${pad(minutes)}`;
};

/**
 * RFC3339 time of a local date-time read at `offsetMinutes` from UTC. The
 * seconds are `00`, or `59` when `isRangeEnd` so an end bound covers its
 * whole minute. A blank value stays blank so an empty filter is still left
 * out of the query.
 *
 * @example
 * buildOffsetTime('2026-10-13T08:30', 480); // '2026-10-13T08:30:00+08:00'
 */
export const buildOffsetTime = (
  value: TLocalDateTime,
  offsetMinutes: number,
  isRangeEnd = false
): string => {
  const seconds = isRangeEnd ? '59' : '00';

  return value ? `${value}:${seconds}${buildOffsetSuffix(offsetMinutes)}` : value;
};
