import type { PlayerLabelResult } from '@cbt-bo/api-schema/bo/models';
import { queryOptions } from '@tanstack/react-query';
import { objectify } from 'radash';

import { ALL_ROWS_PAGE_SIZE } from '@cbt-bo/api/common/constants';
import { getPlayerLabels } from '@cbt-bo/api/player-label/actions';

export const PLAYER_LABEL_QUERY_KEY = ['player-label'] as const;

export const playerLabelListQueryKey = () => [...PLAYER_LABEL_QUERY_KEY, 'list'] as const;

const fetchPlayerLabels = async (): Promise<PlayerLabelResult[]> => {
  const { data: labels = [] } = await getPlayerLabels({ pageSize: ALL_ROWS_PAGE_SIZE });

  return labels;
};

/**
 * Label display name by label ID. A label without an ID or a name is left
 * out, so a lookup miss means the ID should be shown as is.
 *
 * @example
 * buildLabelNameById([{ id: 'l1', name: 'VIP' }]); // { l1: 'VIP' }
 */
export const buildLabelNameById = (
  labels: readonly PlayerLabelResult[]
): Readonly<Record<string, string>> => {
  const namedLabels = labels.flatMap(({ id, name }) => (id && name ? [{ id, name }] : []));

  return objectify(
    namedLabels,
    ({ id }) => id,
    ({ name }) => name
  );
};

/**
 * Every player label in one request through ALL_ROWS_PAGE_SIZE, for label
 * pickers.
 *
 * @example
 * const { data: labels = [] } = useQuery(playerLabelListQueryOptions());
 */
export const playerLabelListQueryOptions = () =>
  queryOptions({
    queryKey: playerLabelListQueryKey(),
    queryFn: fetchPlayerLabels
  });
