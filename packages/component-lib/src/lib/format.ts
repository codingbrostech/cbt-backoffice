const EMPTY_VALUE = '-';
const MINOR_UNITS_PER_MAJOR = 100;

const amountFormat = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2
});

const countFormat = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

/**
 * Formats an amount given in minor units as a grouped major amount with up
 * to two decimals, dropping trailing zeros. A blank or non-numeric value
 * renders as `-`.
 *
 * @example
 * formatMinorAmount('-123456'); // '-1,234.56'
 */
export const formatMinorAmount = (value?: string | number): string => {
  const minorValue = Number(value);

  if (value === undefined || value === '' || Number.isNaN(minorValue)) return EMPTY_VALUE;

  return amountFormat.format(minorValue / MINOR_UNITS_PER_MAJOR);
};

/**
 * Formats a count with thousands separators. A blank or non-numeric value
 * renders as `0`.
 *
 * @example
 * formatCount('12345'); // '12,345'
 */
export const formatCount = (value?: string | number): string => {
  const count = Number(value);

  return countFormat.format(Number.isNaN(count) ? 0 : count);
};
