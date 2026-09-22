export enum ERedemptionState {
  NORMAL = 'normal',
  CANCEL = 'cancel',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  DELIVERED = 'delivered'
}

export type TRedemptionState = `${ERedemptionState}`;

export const REDEMPTION_STATES: TRedemptionState[] = [
  ERedemptionState.NORMAL,
  ERedemptionState.CANCEL,
  ERedemptionState.COMPLETED,
  ERedemptionState.FAILED,
  ERedemptionState.EXPIRED,
  ERedemptionState.DELIVERED
];

export const isRedemptionState = (value: string | null | undefined): value is TRedemptionState =>
  !!value && REDEMPTION_STATES.some(state => state === value);
