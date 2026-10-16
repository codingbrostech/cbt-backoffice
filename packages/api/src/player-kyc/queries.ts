import type { PlayerKycStatusUpdateInput } from '@cbt-bo/api-schema/bo/models';
import { mutationOptions } from '@tanstack/react-query';

import { updatePlayerKycStatus } from '@cbt-bo/api/player-kyc/actions';

export const PLAYER_KYC_QUERY_KEY = ['player-kyc'] as const;

export const PLAYER_KYC_STATES = [
  'reminder',
  'pending',
  'approved',
  'rejected'
] as const satisfies readonly string[];

export const updatePlayerKycStatusMutationKey = () =>
  [...PLAYER_KYC_QUERY_KEY, 'update-status'] as const;

/**
 * Updates a player's KYC state through `/mgt/v1/player/kyc/status/update`,
 * matched by `playerId`.
 */
export const updatePlayerKycStatusMutationOptions = () =>
  mutationOptions({
    mutationKey: updatePlayerKycStatusMutationKey(),
    mutationFn: (input: PlayerKycStatusUpdateInput) => updatePlayerKycStatus(input)
  });
