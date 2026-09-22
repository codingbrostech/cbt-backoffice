export const PLAYER_REBATE_PROPERTY_FIELDS = [
  'perya',
  'slot',
  'casino',
  'egame',
  'sport',
  'bingo'
] as const;

export type TPlayerRebatePropertyField = (typeof PLAYER_REBATE_PROPERTY_FIELDS)[number];

interface IPropertyDetail {
  rate: number;
  bet_adj_amt: number;
  rebate_amt: number;
}

const PROPERTY_DETAIL_KEYS = ['rate', 'bet_adj_amt', 'rebate_amt'] as const;

const isPropertyDetailKey = (key: string): key is keyof IPropertyDetail =>
  PROPERTY_DETAIL_KEYS.some(detailKey => detailKey === key);

/** Parses "rate:0.001,bet_adj_amt:56000,rebate_amt:0" → { rate: 0.001, bet_adj_amt: 56000, rebate_amt: 0 } */
export const parsePropertyDetail = (value?: string): Partial<IPropertyDetail> | null => {
  if (!value) return null;
  const detail = value.split(',').reduce<Partial<IPropertyDetail>>((acc, item) => {
    const [rawKey, rawValue] = item.split(':');
    const key = rawKey?.trim();
    const parsedValue = Number(rawValue?.trim());
    if (!key || !isPropertyDetailKey(key) || Number.isNaN(parsedValue)) return acc;
    return { ...acc, [key]: parsedValue };
  }, {});
  return Object.keys(detail).length > 0 ? detail : null;
};
