import {
  mgtServiceGameRankingList,
  mgtServiceGameRankingMutate
} from '@cbt-bo/api-schema/bo-fm/gameranking';

import { createMgtAction } from '~/services/mgt';

export const getGameRankingList = createMgtAction(mgtServiceGameRankingList);

export const mutateGameRanking = createMgtAction(mgtServiceGameRankingMutate);
