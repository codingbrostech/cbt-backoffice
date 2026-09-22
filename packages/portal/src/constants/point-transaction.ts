export enum EPointTxnState {
  PENDING = 'pending',
  PROCESSING = 'processing',
  REJECTED = 'rejected',
  NORMAL = 'normal',
  CANCEL = 'cancel',
  FAILED = 'failed',
  EXPIRED = 'expired',
  COMPLETED = 'completed'
}

export type TPointTxnState = EPointTxnState;

export const POINT_TXN_STATES: TPointTxnState[] = [
  EPointTxnState.PENDING,
  EPointTxnState.PROCESSING,
  EPointTxnState.REJECTED,
  EPointTxnState.NORMAL,
  EPointTxnState.CANCEL,
  EPointTxnState.FAILED,
  EPointTxnState.EXPIRED,
  EPointTxnState.COMPLETED
];

export enum EPointTxnType {
  DAILY_EARN = 'dailyEarn',
  REDEEM = 'redeem',
  CREDIT = 'credit',
  DEDUCT = 'deduct',
  EXPIRY = 'expiry'
}

export type TPointTxnType = EPointTxnType;

export const POINT_TXN_TYPES: TPointTxnType[] = [
  EPointTxnType.DAILY_EARN,
  EPointTxnType.REDEEM,
  EPointTxnType.CREDIT,
  EPointTxnType.DEDUCT,
  EPointTxnType.EXPIRY
];

export enum EPointApproveStatus {
  NOT_REQUIRED = 'not_required',
  REQUIRED = 'required',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export type TPointApproveStatus = EPointApproveStatus;

export const POINT_APPROVE_STATUSES: TPointApproveStatus[] = [
  EPointApproveStatus.NOT_REQUIRED,
  EPointApproveStatus.REQUIRED,
  EPointApproveStatus.APPROVED,
  EPointApproveStatus.REJECTED
];
