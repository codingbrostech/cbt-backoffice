export enum EAcscTransferWallet {
  CASH = 'cash',
  SOLAIRE_PESO = 'solaire_peso'
}

export type TAcscTransferWallet = EAcscTransferWallet;

export const ACSC_TRANSFER_WALLETS: TAcscTransferWallet[] = [
  EAcscTransferWallet.CASH,
  EAcscTransferWallet.SOLAIRE_PESO
];

export enum EAcscTransferDirection {
  IN = 'in',
  OUT = 'out'
}

export type TAcscTransferDirection = EAcscTransferDirection;

export const ACSC_TRANSFER_DIRECTIONS: TAcscTransferDirection[] = [
  EAcscTransferDirection.IN,
  EAcscTransferDirection.OUT
];

export enum EAcscTransferState {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REVERSED = 'reversed',
  FAILED = 'failed'
}

export type TAcscTransferState = EAcscTransferState;

export const ACSC_TRANSFER_STATES: TAcscTransferState[] = [
  EAcscTransferState.PENDING,
  EAcscTransferState.PROCESSING,
  EAcscTransferState.COMPLETED,
  EAcscTransferState.REVERSED,
  EAcscTransferState.FAILED
];
