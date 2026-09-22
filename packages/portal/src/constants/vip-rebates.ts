import type { VipRebate, VipRebateUpsertInput } from '@cbt-bo/api-schema/bo-fm/models';

export const VIP_REBATE_CATEGORIES = [
  'perya',
  'slot',
  'casino',
  'egame',
  'sport',
  'bingo'
] as const;

export type TVipRebateCategory = (typeof VIP_REBATE_CATEGORIES)[number];

export const VIP_REBATE_RATE_FIELDS = [
  'peryaRate',
  'slotRate',
  'casinoRate',
  'egameRate',
  'sportRate',
  'bingoRate'
] as const;

export const VIP_REBATE_HOUSE_EDGE_FIELDS = [
  'peryaHouseEdge',
  'slotHouseEdge',
  'casinoHouseEdge',
  'egameHouseEdge',
  'sportHouseEdge',
  'bingoHouseEdge'
] as const;

export const VIP_REBATE_EXCHANGE_RATE_FIELDS = [
  'peryaExchangeRate',
  'slotExchangeRate',
  'casinoExchangeRate',
  'egameExchangeRate',
  'sportExchangeRate',
  'bingoExchangeRate'
] as const;

export type TVipRebateRateField = (typeof VIP_REBATE_RATE_FIELDS)[number];
export type TVipRebateHouseEdgeField = (typeof VIP_REBATE_HOUSE_EDGE_FIELDS)[number];
export type TVipRebateExchangeRateField = (typeof VIP_REBATE_EXCHANGE_RATE_FIELDS)[number];

export const VIP_REBATE_PERCENT_FIELDS = [
  ...VIP_REBATE_RATE_FIELDS,
  ...VIP_REBATE_HOUSE_EDGE_FIELDS
] as const;

export type TVipRebatePercentField = (typeof VIP_REBATE_PERCENT_FIELDS)[number];

export const VIP_REBATE_NUMERIC_FIELDS = [
  ...VIP_REBATE_PERCENT_FIELDS,
  ...VIP_REBATE_EXCHANGE_RATE_FIELDS
] as const;

export type TVipRebateNumericField = (typeof VIP_REBATE_NUMERIC_FIELDS)[number];

/** One boxed rate section per game category, driving the form's grouped layout. */
export const VIP_REBATE_RATE_GROUPS = [
  {
    category: 'perya',
    rate: 'peryaRate',
    houseEdge: 'peryaHouseEdge',
    exchangeRate: 'peryaExchangeRate'
  },
  {
    category: 'slot',
    rate: 'slotRate',
    houseEdge: 'slotHouseEdge',
    exchangeRate: 'slotExchangeRate'
  },
  {
    category: 'casino',
    rate: 'casinoRate',
    houseEdge: 'casinoHouseEdge',
    exchangeRate: 'casinoExchangeRate'
  },
  {
    category: 'egame',
    rate: 'egameRate',
    houseEdge: 'egameHouseEdge',
    exchangeRate: 'egameExchangeRate'
  },
  {
    category: 'sport',
    rate: 'sportRate',
    houseEdge: 'sportHouseEdge',
    exchangeRate: 'sportExchangeRate'
  },
  {
    category: 'bingo',
    rate: 'bingoRate',
    houseEdge: 'bingoHouseEdge',
    exchangeRate: 'bingoExchangeRate'
  }
] as const satisfies readonly {
  category: TVipRebateCategory;
  rate: TVipRebateRateField;
  houseEdge: TVipRebateHouseEdgeField;
  exchangeRate: TVipRebateExchangeRateField;
}[];

export type TVipRebateRateFormValue = number | string | undefined;

export type TVipRebateRateFormValues = Partial<
  Record<TVipRebateNumericField, TVipRebateRateFormValue>
>;

const roundToPrecision = (value: number, precision = 10) => Number(value.toFixed(precision));

export const formatVipRebateRate = (rate?: number) =>
  rate !== undefined ? `${roundToPrecision(rate * 100)}%` : '-';

export const formatVipRebateExchangeRate = (rate?: number) =>
  rate !== undefined ? `${roundToPrecision(rate)}` : '-';

export const vipRebateRateToFormValue = (rate?: number) =>
  rate !== undefined ? roundToPrecision(rate * 100) : undefined;

export const vipRebateExchangeRateToFormValue = (rate?: number) =>
  rate !== undefined ? roundToPrecision(rate) : undefined;

export const isEmptyRateFormValue = (value?: TVipRebateRateFormValue) =>
  value === undefined || typeof value === 'string' || Number.isNaN(value);

export const formValueToVipRebateRate = (value?: TVipRebateRateFormValue) => {
  if (isEmptyRateFormValue(value)) return undefined;
  return roundToPrecision(Number(value) / 100);
};

export const formValueToVipRebateExchangeRate = (value?: TVipRebateRateFormValue) => {
  if (isEmptyRateFormValue(value)) return undefined;
  return roundToPrecision(Number(value));
};

/** API model → form fields (percent fields 0.01 → 1, exchange rate fields pass through) */
export const vipRebateToRateFormValues = (vipRebate: VipRebate): TVipRebateRateFormValues => {
  const values: TVipRebateRateFormValues = {};
  for (const field of VIP_REBATE_PERCENT_FIELDS) {
    values[field] = vipRebateRateToFormValue(vipRebate[field]);
  }
  for (const field of VIP_REBATE_EXCHANGE_RATE_FIELDS) {
    values[field] = vipRebateExchangeRateToFormValue(vipRebate[field]);
  }
  return values;
};

/** Form fields → API upsert payload (percent fields 1 → 0.01, exchange rate fields pass through) */
export const rateFormValuesToUpsertInput = (
  values: TVipRebateRateFormValues
): Pick<VipRebateUpsertInput, TVipRebateNumericField> => {
  const result: Pick<VipRebateUpsertInput, TVipRebateNumericField> = {};
  for (const field of VIP_REBATE_PERCENT_FIELDS) {
    result[field] = formValueToVipRebateRate(values[field]);
  }
  for (const field of VIP_REBATE_EXCHANGE_RATE_FIELDS) {
    result[field] = formValueToVipRebateExchangeRate(values[field]);
  }
  return result;
};
