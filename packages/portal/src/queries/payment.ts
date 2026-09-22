import { queryOptions } from '@tanstack/react-query';

import { getPaymentEntryList, getPaymentProviderList } from '~/actions/player-reports';
import type { ISelectOption } from '~/table/types';

export const PAYMENT_ENTRY_OPTIONS_QUERY_KEY = 'payment-entry-options';
export const PAYMENT_PROVIDER_OPTIONS_QUERY_KEY = 'payment-provider-options';

const ALL_ROWS_PAGE_SIZE = 1000;

interface IPaymentOptionSource {
  code?: string;
  name?: string;
}

const toPaymentOptions = (items: readonly IPaymentOptionSource[]): ISelectOption[] =>
  items.flatMap(({ code, name }) =>
    code && name ? [{ value: code, label: `${name} (${code})` }] : []
  );

/**
 * Every payment entry as a select option labelled `name (code)`.
 */
export const paymentEntryOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [PAYMENT_ENTRY_OPTIONS_QUERY_KEY],
    queryFn: async (): Promise<ISelectOption[]> => {
      const { data = [] } = await getPaymentEntryList({ page: 1, pageSize: ALL_ROWS_PAGE_SIZE });

      return toPaymentOptions(data);
    }
  });

/**
 * Every payment provider as a select option labelled `name (code)`.
 */
export const paymentProviderOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [PAYMENT_PROVIDER_OPTIONS_QUERY_KEY],
    queryFn: async (): Promise<ISelectOption[]> => {
      const { data = [] } = await getPaymentProviderList({
        page: 1,
        pageSize: ALL_ROWS_PAGE_SIZE
      });

      return toPaymentOptions(data);
    }
  });
