import type {
  PlayerListInput,
  PlayerListResultItem,
  PlayerUpdateInput
} from '@cbt-bo/api-schema/bo/models';
import { keepPreviousData, mutationOptions, queryOptions } from '@tanstack/react-query';
import { shake } from 'radash';

import { getPlayers, updatePlayer } from '@cbt-bo/api/player/actions';

/**
 * Page and filters of `/mgt/v1/player/list`. `timeFrom` and `timeTo` are
 * RFC3339 times bounding the registration time.
 */
export interface IPlayerListParams extends Omit<PlayerListInput, 'page' | 'pageSize'> {
  page: number;
  pageSize: number;
}

/**
 * Filter fields of the players list as form values, without the player
 * contact fields each app composes in. `playerId` is sent as `id`. An empty
 * string or an empty `labelIds` means the field is not applied.
 */
export type TPlayerListFilter = Required<
  Pick<
    PlayerListInput,
    | 'email'
    | 'firstName'
    | 'lastName'
    | 'applicantId'
    | 'state'
    | 'kycStatus'
    | 'timeFrom'
    | 'timeTo'
  >
> & {
  playerId: string;
  labelIds: readonly string[];
};

export interface IPlayerListPage {
  rows: PlayerListResultItem[];
  total: number;
}

export const PLAYER_QUERY_KEY = ['player'] as const;

export const PLAYER_STATES = [
  'active',
  'freeze',
  'pre_delete',
  'delete'
] as const satisfies readonly string[];

/**
 * The `playerState` values offered when editing a player, a subset of
 * PLAYER_STATES.
 */
export const PLAYER_EDITABLE_STATES = ['active', 'freeze'] as const satisfies readonly string[];

export const DEFAULT_PLAYER_LIST_FILTER = {
  playerId: '',
  email: '',
  firstName: '',
  lastName: '',
  applicantId: '',
  state: '',
  kycStatus: '',
  labelIds: [],
  timeFrom: '',
  timeTo: ''
} as const satisfies TPlayerListFilter;

export const playerListQueryKey = (params: IPlayerListParams) =>
  [...PLAYER_QUERY_KEY, 'list', params] as const;

export const updatePlayerMutationKey = () => [...PLAYER_QUERY_KEY, 'update'] as const;

const isBlank = (value: unknown): boolean => !value;

const fetchPlayerList = async (params: IPlayerListParams): Promise<IPlayerListPage> => {
  const { data: rows = [], total = 0 } = await getPlayers(params);

  return { rows, total };
};

/**
 * Query params of the players list for a page and a filter. Blank filter
 * fields and an empty `labelIds` are left out so the API does not match on
 * them, and `playerId` is sent as `id`.
 *
 * @example
 * buildPlayerListParams({ page: 1, pageSize: 10 }, { ...DEFAULT_PLAYER_LIST_FILTER, playerId: 'p1', labelIds: ['l1'] });
 * // { page: 1, pageSize: 10, id: 'p1', labelIds: ['l1'] }
 */
export const buildPlayerListParams = (
  page: Pick<IPlayerListParams, 'page' | 'pageSize'>,
  filter: TPlayerListFilter
): IPlayerListParams => {
  const { playerId, labelIds, ...fields } = filter;
  const filled = shake(fields, isBlank);
  const isLabelFiltered = labelIds.length > 0;

  return {
    ...page,
    ...filled,
    ...(playerId && { id: playerId }),
    ...(isLabelFiltered && { labelIds: [...labelIds] })
  };
};

/**
 * One page of players for `params`. Keeps the previous page as placeholder
 * data while the next one loads.
 *
 * @example
 * const { data } = useQuery(playerListQueryOptions({ page: 1, pageSize: 10 }));
 */
export const playerListQueryOptions = (params: IPlayerListParams) =>
  queryOptions({
    queryKey: playerListQueryKey(params),
    queryFn: () => fetchPlayerList(params),
    placeholderData: keepPreviousData
  });

/**
 * Updates a player through `/mgt/v1/player/update`, matched by `playerId`.
 * Fields left out of the input keep their stored value.
 */
export const updatePlayerMutationOptions = () =>
  mutationOptions({
    mutationKey: updatePlayerMutationKey(),
    mutationFn: (input: PlayerUpdateInput) => updatePlayer(input)
  });
