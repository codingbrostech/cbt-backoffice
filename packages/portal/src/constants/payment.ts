export enum EPaymentTxnState {
  NORMAL = 'normal',
  PENDING = 'pending',
  CANCEL = 'cancel',
  FAILED = 'failed',
  EXPIRED = 'expired'
}

export type TPaymentTxnState = EPaymentTxnState;

export const PAYMENT_TXN_STATES: TPaymentTxnState[] = [
  EPaymentTxnState.NORMAL,
  EPaymentTxnState.PENDING,
  EPaymentTxnState.CANCEL,
  EPaymentTxnState.FAILED,
  EPaymentTxnState.EXPIRED
];

export enum EPaymentTxnType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

export type TPaymentTxnType = EPaymentTxnType;

export const PAYMENT_TXN_TYPES: TPaymentTxnType[] = [
  EPaymentTxnType.DEPOSIT,
  EPaymentTxnType.WITHDRAW
];

export enum EPaymentApprovalStatus {
  NOT_REQUIRED = 'not_required',
  REQUIRED = 'required',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export type TPaymentApprovalStatus = EPaymentApprovalStatus;

export const PAYMENT_APPROVAL_STATUSES: TPaymentApprovalStatus[] = [
  EPaymentApprovalStatus.NOT_REQUIRED,
  EPaymentApprovalStatus.REQUIRED,
  EPaymentApprovalStatus.APPROVED,
  EPaymentApprovalStatus.REJECTED
];

export enum EPaymentEntryImageKey {
  ICON = 'icon',
  THUMB = 'thumb'
}

export type TPaymentEntryImageKey = EPaymentEntryImageKey;

export const PAYMENT_ENTRY_IMAGE_KEYS: TPaymentEntryImageKey[] = [
  EPaymentEntryImageKey.ICON,
  EPaymentEntryImageKey.THUMB
];
