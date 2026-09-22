import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

// eslint-disable-next-line @typescript-eslint/naming-convention
export type DateType = dayjs.ConfigType;

export const ISO_DATE_FORMAT = 'YYYY-MM-DD';
export const DISPLAY_DATE_FORMAT = 'MM/DD/YYYY';

export const formatDate = (dateStr: DateType, format?: string) =>
  dayjs(dateStr).format(format ?? 'YYYY-MM-DD HH:mm:ss');

export function isoToDisplayDate(isoDate?: string | null): string | undefined {
  if (!isoDate) return undefined;

  const parsed = dayjs(isoDate, ISO_DATE_FORMAT, true);
  if (!parsed.isValid()) return undefined;

  return parsed.format(DISPLAY_DATE_FORMAT);
}

export function displayToIsoDate(displayDate?: string | null) {
  if (!displayDate) return null;

  const parsed = dayjs(displayDate, DISPLAY_DATE_FORMAT, true);
  if (!parsed.isValid()) return null;

  return parsed.format(ISO_DATE_FORMAT);
}

export function toIsoDate(date?: DateType | null): string | undefined {
  if (!date) return undefined;

  const parsed = dayjs(date);
  if (!parsed.isValid()) return undefined;

  return parsed.format(ISO_DATE_FORMAT);
}

export function toDisplayDate(date?: DateType | null): string | undefined {
  if (!date) return undefined;

  const parsed = dayjs(date);
  if (!parsed.isValid()) return undefined;

  return parsed.format(DISPLAY_DATE_FORMAT);
}

export const convertToDateParam = (date: DateType) => dayjs(date).format('YYYY-MM-DDTHH:mm:ssZ');

export const convertParamsToDate = (dateString: string | DateType | undefined) =>
  dateString && typeof dateString === 'string' ? dayjs(dateString) : dateString;

const now = dayjs();

export const createdTimeFromDefault: DateType = now.clone().subtract(1, 'month').startOf('day');
export const createdTimeFromMin: DateType = now.clone().subtract(3, 'month');
export const createdTimeToDefault: DateType = now.clone().startOf('day');
export const createdTimeToMax: DateType = now.clone().endOf('day');

export default dayjs;
