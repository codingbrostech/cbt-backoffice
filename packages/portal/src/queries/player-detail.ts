import type {
  PlayerBetStatResult,
  PlayerFinancialInfoResult,
  PlayerLabelAssignListItem,
  PlayerReferenceDataItem,
  PlayerResult
} from '@cbt-bo/api-schema/bo-fm/models';
import type {
  MgtAcscPlayerOverviewResult,
  MgtAcscRewardAccrualItem
} from '@cbt-bo/api-schema/bo-so/models';
import { queryOptions } from '@tanstack/react-query';

import { listPlayerAcscRewardAccrual } from '~/actions/player-acsc-reward-accrual';
import { getPlayerLabelsByPlayer } from '~/actions/playerlabels';
import {
  getPlayer,
  getPlayerAcscOverview,
  getPlayerBetInfo,
  getPlayerFinancialInfo,
  getPlayerIncomeSources,
  getPlayerWorkNatures
} from '~/actions/players';
import { isBrandSo } from '~/config';
import type { ISelectOption } from '~/table/types';

export const PLAYER_DETAIL_QUERY_KEY = 'player-detail';
export const PLAYER_FINANCIAL_INFO_QUERY_KEY = 'player-financial-info';
export const PLAYER_BET_INFO_QUERY_KEY = 'player-bet-info';
export const PLAYER_ACSC_OVERVIEW_QUERY_KEY = 'player-acsc-overview';
export const PLAYER_ACSC_REWARD_ACCRUAL_QUERY_KEY = 'player-acsc-reward-accrual';
export const ASSIGNED_PLAYER_LABELS_QUERY_KEY = 'assigned-player-labels';
export const PLAYER_REFERENCE_OPTIONS_QUERY_KEY = 'player-reference-options';

export type TPlayerDetail = PlayerResult & { patronNumber?: string };

export interface IPlayerReferenceOptions {
  incomeSources: ISelectOption[];
  workNatures: ISelectOption[];
}

const toReferenceOptions = (items: readonly PlayerReferenceDataItem[]): ISelectOption[] =>
  items.flatMap(({ id, description, code }) =>
    id ? [{ value: id, label: description ?? code ?? id }] : []
  );

export const playerDetailQueryOptions = (playerId: string) =>
  queryOptions({
    queryKey: [PLAYER_DETAIL_QUERY_KEY, playerId],
    queryFn: (): Promise<TPlayerDetail> => getPlayer({ id: playerId })
  });

export const playerFinancialInfoQueryOptions = (playerId: string) =>
  queryOptions({
    queryKey: [PLAYER_FINANCIAL_INFO_QUERY_KEY, playerId],
    queryFn: async (): Promise<PlayerFinancialInfoResult | null> => {
      const { data = null } = await getPlayerFinancialInfo({ id: playerId });

      return data;
    }
  });

export const playerBetInfoQueryOptions = (playerId: string, gamePvdId: string, gameGenre: string) =>
  queryOptions({
    queryKey: [PLAYER_BET_INFO_QUERY_KEY, playerId, gamePvdId, gameGenre],
    queryFn: async (): Promise<PlayerBetStatResult | null> => {
      const { data = null } = await getPlayerBetInfo({
        playerId,
        ...(gamePvdId && { gamePvdId }),
        ...(gameGenre && { gameGenre })
      });

      return data;
    }
  });

/**
 * ACSC overview of a player. Only fetched on the SO brand.
 */
export const playerAcscOverviewQueryOptions = (playerId: string) =>
  queryOptions({
    queryKey: [PLAYER_ACSC_OVERVIEW_QUERY_KEY, playerId],
    queryFn: (): Promise<MgtAcscPlayerOverviewResult> => getPlayerAcscOverview({ playerId }),
    enabled: isBrandSo()
  });

/**
 * The player's ACSC reward accrual row. Fetched only while `isEnabled`.
 */
export const playerAcscRewardAccrualQueryOptions = (playerId: string, isEnabled: boolean) =>
  queryOptions({
    queryKey: [PLAYER_ACSC_REWARD_ACCRUAL_QUERY_KEY, playerId],
    queryFn: async (): Promise<MgtAcscRewardAccrualItem | null> => {
      const { data: [accrual] = [] } = await listPlayerAcscRewardAccrual({
        playerId,
        page: 1,
        pageSize: 1
      });

      return accrual ?? null;
    },
    enabled: isBrandSo() && isEnabled
  });

export const assignedPlayerLabelsQueryOptions = (playerId: string) =>
  queryOptions({
    queryKey: [ASSIGNED_PLAYER_LABELS_QUERY_KEY, playerId],
    queryFn: async (): Promise<PlayerLabelAssignListItem[]> => {
      const { data = [] } = await getPlayerLabelsByPlayer({ playerId });

      return data;
    }
  });

/**
 * Income source and work nature options for the player info form.
 */
export const playerReferenceOptionsQueryOptions = () =>
  queryOptions({
    queryKey: [PLAYER_REFERENCE_OPTIONS_QUERY_KEY],
    queryFn: async (): Promise<IPlayerReferenceOptions> => {
      const [{ data: incomeSources = [] }, { data: workNatures = [] }] = await Promise.all([
        getPlayerIncomeSources({}),
        getPlayerWorkNatures({})
      ]);

      return {
        incomeSources: toReferenceOptions(incomeSources),
        workNatures: toReferenceOptions(workNatures)
      };
    }
  });
