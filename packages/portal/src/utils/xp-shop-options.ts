import type { XpShopItem } from '@cbt-bo/api-schema/bo-fm/models';

import { XP_SHOP_VECTOR_STATES } from '~/constants/xp-shop';

export interface ISelectOption {
  value: string;
  label: string;
}

export const createPositionOptions = (n: number): ISelectOption[] =>
  Array.from({ length: n }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));

export const toXpShopItemOptions = (itemsList: XpShopItem[]): ISelectOption[] =>
  itemsList
    .map(item => ({
      value: item.id ?? '',
      label: item.name ? `${item.name} (${item.code ?? ''})` : (item.code ?? item.id ?? '')
    }))
    .filter(option => Boolean(option.value));

export const toXpShopVectorStateOptions = (t: (key: string) => string): ISelectOption[] =>
  XP_SHOP_VECTOR_STATES.map(state => ({
    value: state,
    label: t(`state.${state}`)
  }));
