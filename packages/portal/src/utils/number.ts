import numeral from 'numeral';

import { amount } from '~/utils/amount';

export const toCurrency = (value: string | number) => {
  const majorValue = amount.fromMinor(value);
  if (majorValue === null) return '-';
  return numeral(majorValue).format('0,0[.][00000000000]');
};

export const toPoint = (value: string | number | undefined | null) => {
  if (value == null || value === '') return '-';
  return numeral(value).format('0,0[.][00000000000]');
};

export const toCount = (value: string | number | undefined | null) => {
  if (value === undefined || value === null || value === '') return '0';
  return numeral(value).format('0,0');
};

export const toCrpytoCurrecny = (value: string | number, coinDecimal: number) =>
  numeral(value)
    .divide(10 ** coinDecimal)
    .format('0,0[.][00000000000]');
