import type {
  TxnWagerListInput,
  TxnWagerResult,
  TxnWagerSummaryResult
} from '@cbt-bo/api-schema/bo/models';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { objectify, shake } from 'radash';

import { withIsLike } from '@cbt-bo/api/filter/with-is-like';
import { getWagerTxnSummary, getWagerTxns } from '@cbt-bo/api/wagertxn/actions';

/**
 * Page and filters of `/mgt/v1/wagertxn/list`. `timeFrom` and `timeTo` are
 * RFC3339 times bounding the bet time.
 */
export interface IWagerTxnListParams extends Omit<TxnWagerListInput, 'page' | 'pageSize'> {
  page: number;
  pageSize: number;
}

/**
 * Filter fields of the bet transactions list as form values, without the
 * player fields each app composes in. An empty string means the field is not
 * applied.
 */
export type TWagerTxnListFilter = Required<
  Pick<
    TxnWagerListInput,
    | 'timeFrom'
    | 'timeTo'
    | 'extTxnId'
    | 'gameId'
    | 'gamePvdId'
    | 'gameType'
    | 'extRoundId'
    | 'betState'
    | 'txnType'
  >
>;

/**
 * Filters of `/mgt/v1/wagertxn/summary`, the list filters without the page.
 */
export type TWagerTxnSummaryParams = Omit<IWagerTxnListParams, 'page' | 'pageSize'>;

/**
 * Totals over every row matching the filter, from `/mgt/v1/wagertxn/summary`.
 * Amounts are in minor units.
 */
export type TWagerTxnSummary = TxnWagerSummaryResult;

export interface IWagerTxnListPage {
  rows: TxnWagerResult[];
  total: number;
}

export const WAGER_TXN_QUERY_KEY = ['wagertxn'] as const;

/**
 * Filter fields sent as a fuzzy `like:<value>` match instead of an exact one.
 */
export const WAGER_TXN_LIKE_FIELDS = [
  'gameId',
  'extRoundId'
] as const satisfies readonly (keyof TWagerTxnListFilter)[];

export const WAGER_TXN_BET_STATES = [
  'normal',
  'result',
  'cancel',
  'error'
] as const satisfies readonly string[];

export const WAGER_TXN_TYPES = ['bet', 'free_bet', 'tip'] as const satisfies readonly string[];

export const WAGER_TXN_BET_RESULTS = ['win', 'lose', 'tie'] as const satisfies readonly string[];

export type TWagerTxnBetState = (typeof WAGER_TXN_BET_STATES)[number];

export type TWagerTxnBetResult = (typeof WAGER_TXN_BET_RESULTS)[number];

export const DEFAULT_WAGER_TXN_LIST_FILTER = {
  timeFrom: '',
  timeTo: '',
  extTxnId: '',
  gameId: '',
  gamePvdId: '',
  gameType: '',
  extRoundId: '',
  betState: '',
  txnType: ''
} as const satisfies TWagerTxnListFilter;

export const wagerTxnListQueryKey = (params: IWagerTxnListParams) =>
  [...WAGER_TXN_QUERY_KEY, 'list', params] as const;

export const wagerTxnSummaryQueryKey = (params: TWagerTxnSummaryParams) =>
  [...WAGER_TXN_QUERY_KEY, 'summary', params] as const;

const isBlank = (value: unknown): boolean => !value;

const fetchWagerTxnList = async (params: IWagerTxnListParams): Promise<IWagerTxnListPage> => {
  const { data: rows = [], total = 0 } = await getWagerTxns(params);

  return { rows, total };
};

/**
 * Query params of the bet transactions list for a page and a filter. Blank
 * filter fields are left out so the API does not match on them, and the
 * fields in WAGER_TXN_LIKE_FIELDS are sent as fuzzy matches.
 *
 * @example
 * buildWagerTxnListParams({ page: 1, pageSize: 10 }, { ...DEFAULT_WAGER_TXN_LIST_FILTER, betState: 'result', extRoundId: 'r1' });
 * // { page: 1, pageSize: 10, betState: 'result', extRoundId: 'like:r1' }
 */
export const buildWagerTxnListParams = (
  page: Pick<IWagerTxnListParams, 'page' | 'pageSize'>,
  filter: TWagerTxnListFilter
): IWagerTxnListParams => {
  const filled = shake(filter, isBlank);
  const filledLikeFields = WAGER_TXN_LIKE_FIELDS.filter(field => filter[field]);
  const likeFilter = objectify(
    filledLikeFields,
    field => field,
    field => withIsLike(filter[field])
  );

  return { ...page, ...filled, ...likeFilter };
};

/**
 * One page of bet transactions for `params`. Keeps the previous page as
 * placeholder data while the next one loads.
 *
 * @example
 * const { data } = useQuery(wagerTxnListQueryOptions({ page: 1, pageSize: 10 }));
 */
export const wagerTxnListQueryOptions = (params: IWagerTxnListParams) =>
  queryOptions({
    queryKey: wagerTxnListQueryKey(params),
    queryFn: () => fetchWagerTxnList(params),
    placeholderData: keepPreviousData
  });

/**
 * Totals of every bet transaction matching `params`. Keeps the previous
 * totals as placeholder data while the next ones load.
 *
 * @example
 * const { data: summary = {} } = useQuery(wagerTxnSummaryQueryOptions({ betState: 'result' }));
 */
export const wagerTxnSummaryQueryOptions = (params: TWagerTxnSummaryParams) =>
  queryOptions({
    queryKey: wagerTxnSummaryQueryKey(params),
    queryFn: () => getWagerTxnSummary(params),
    placeholderData: keepPreviousData
  });
