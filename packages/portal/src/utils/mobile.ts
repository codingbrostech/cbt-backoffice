export const MOBILE_PREFIX_PH = '+63';

export function toLocalMobile(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('0063')) digits = digits.slice(4);
  else if (digits.startsWith('63')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return digits;
}

export function normalizeMobileWithPrefix(value: string, prefix: string): string {
  const local = toLocalMobile(value);
  if (!local) return '';
  return prefix + local;
}
