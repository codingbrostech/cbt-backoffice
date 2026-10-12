/**
 * Formats `date` as `YYYY-MM-DD HH:mm:ss` after shifting it by `offsetMinutes`.
 * Reads back the shifted instant through the UTC getters so the host
 * timezone never re-applies its own offset on top.
 */
export const buildOffsetDateLabel = (date: Date, offsetMinutes: number): string => {
  const shiftedDate = new Date(date.getTime() + offsetMinutes * 60_000);
  const pad = (value: number) => String(value).padStart(2, '0');

  const datePart = [
    shiftedDate.getUTCFullYear(),
    pad(shiftedDate.getUTCMonth() + 1),
    pad(shiftedDate.getUTCDate())
  ].join('-');
  const timePart = [
    shiftedDate.getUTCHours(),
    shiftedDate.getUTCMinutes(),
    shiftedDate.getUTCSeconds()
  ]
    .map(pad)
    .join(':');

  return `${datePart} ${timePart}`;
};
