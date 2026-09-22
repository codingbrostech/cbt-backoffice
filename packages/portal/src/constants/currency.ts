import { ECurrencyCode } from '~/types/config';

export const CURRENCY_OPTIONS = Object.values(ECurrencyCode).map(code => ({
  value: code,
  label: code
}));
