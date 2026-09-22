export const VIP_LEVEL_TXN_ACTION_TYPES = {
  UPGRADE: 'upgrade',
  DOWNGRADE: 'downgrade',
  RETENTION: 'retention'
} as const;

export type TVipLevelTxnActionType =
  (typeof VIP_LEVEL_TXN_ACTION_TYPES)[keyof typeof VIP_LEVEL_TXN_ACTION_TYPES];

export const VIP_LEVEL_TXN_ACTION_TYPE_LIST = [
  VIP_LEVEL_TXN_ACTION_TYPES.UPGRADE,
  VIP_LEVEL_TXN_ACTION_TYPES.DOWNGRADE,
  VIP_LEVEL_TXN_ACTION_TYPES.RETENTION
] as const satisfies readonly TVipLevelTxnActionType[];
