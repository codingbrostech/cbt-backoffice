import {
  mgtServiceGameRankingList,
  mgtServiceGameRankingMutate
} from '@cbt-bo/api-schema/bo/gameranking';
import { createMgtAction } from '@cbt-bo/api-schema/mgt';

export const getGameRanking = createMgtAction(mgtServiceGameRankingList);

export const mutateGameRanking = createMgtAction(mgtServiceGameRankingMutate);
