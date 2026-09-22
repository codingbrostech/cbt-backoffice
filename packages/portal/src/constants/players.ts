export const PLAYER_MOBILE_POLICY_TYPES = {
  FREEZE: 'freeze',
  STAFF: 'staff'
} as const;

export type TPlayerMobilePolicyType =
  (typeof PLAYER_MOBILE_POLICY_TYPES)[keyof typeof PLAYER_MOBILE_POLICY_TYPES];
