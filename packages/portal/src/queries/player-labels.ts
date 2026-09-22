import { queryOptions } from '@tanstack/react-query';

import { getPlayerLabels } from '~/actions/playerlabels';
import type { ISelectOption } from '~/table/types';

export const PLAYER_LABEL_OPTIONS_QUERY_KEY = 'player-label-options';

const ALL_ROWS_PAGE_SIZE = 1000;

/**
 * Every player label as a select option keyed by `id` and labelled by
 * `name`.
 */
export const playerLabelOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [PLAYER_LABEL_OPTIONS_QUERY_KEY],
    queryFn: async (): Promise<ISelectOption[]> => {
      const { data = [] } = await getPlayerLabels({ page: 1, pageSize: ALL_ROWS_PAGE_SIZE });

      return data.flatMap(({ id, name }) => (id ? [{ value: id, label: name ?? id }] : []));
    }
  });
