export enum EPlayerState {
  ACTIVE = 'active',
  FREEZE = 'freeze',
  PRE_DELETE = 'pre_delete',
  DELETE = 'delete'
}

export type TPlayerState = EPlayerState;

export const PLAYER_STATES: TPlayerState[] = [
  EPlayerState.ACTIVE,
  EPlayerState.FREEZE,
  EPlayerState.PRE_DELETE,
  EPlayerState.DELETE
];

export const PLAYER_STATE_COLORS: Record<TPlayerState, string> = {
  [EPlayerState.ACTIVE]: 'green',
  [EPlayerState.FREEZE]: 'yellow',
  [EPlayerState.PRE_DELETE]: 'grey',
  [EPlayerState.DELETE]: 'dark'
};

export enum EPlayerKycState {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REMINDER = 'reminder'
}

export type TPlayerKycState = EPlayerKycState;

export const PLAYER_KYC_STATES: TPlayerKycState[] = [
  EPlayerKycState.APPROVED,
  EPlayerKycState.PENDING,
  EPlayerKycState.REJECTED,
  EPlayerKycState.REMINDER
];

export const PLAYER_KYC_STATE_COLORS: Record<TPlayerKycState, string> = {
  [EPlayerKycState.REMINDER]: '#FF871F',
  [EPlayerKycState.PENDING]: '#2B81F5',
  [EPlayerKycState.APPROVED]: '#12B76A',
  [EPlayerKycState.REJECTED]: '#F04438'
};

export const isPlayerState = (value: string | undefined): value is EPlayerState =>
  !!value && value in PLAYER_STATE_COLORS;

export const isPlayerKycState = (value: string | undefined): value is EPlayerKycState =>
  !!value && value in PLAYER_KYC_STATE_COLORS;

export enum EReviewStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}

export const isReviewStatus = (value: string | undefined): value is EReviewStatus =>
  value === EReviewStatus.PENDING || value === EReviewStatus.COMPLETED;

export enum EPlayerType {
  PLAYER = 'player',
  GUEST = 'guest',
  AGENT = 'agent',
  STAFF = 'staff'
}

export type TPlayerType = EPlayerType;

export const PLAYER_TYPES: TPlayerType[] = [
  EPlayerType.PLAYER,
  EPlayerType.GUEST,
  EPlayerType.AGENT,
  EPlayerType.STAFF
];

export enum EPlayerSessionState {
  ACTIVE = 'active',
  LOGOUT = 'logout',
  REVOKE = 'revoke',
  REVOKE_OTHER_DEVICE = 'revoke_other_device',
  EXPIRE = 'expire',
  OTP_FAIL = 'otp_fail',
  SELF_LIMIT = 'self_limit'
}

export const PLAYER_SESSION_STATE_COLORS: Record<EPlayerSessionState, string> = {
  [EPlayerSessionState.ACTIVE]: 'green',
  [EPlayerSessionState.LOGOUT]: 'grey',
  [EPlayerSessionState.REVOKE]: 'yellow',
  [EPlayerSessionState.REVOKE_OTHER_DEVICE]: 'yellow',
  [EPlayerSessionState.EXPIRE]: 'yellow',
  [EPlayerSessionState.OTP_FAIL]: 'yellow',
  [EPlayerSessionState.SELF_LIMIT]: 'yellow'
};

export const isPlayerSessionState = (value: string | undefined): value is EPlayerSessionState =>
  !!value && value in PLAYER_SESSION_STATE_COLORS;

export enum EPlayerLabelState {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export type TPlayerLabelState = EPlayerLabelState;

export const PLAYER_LABEL_STATES: TPlayerLabelState[] = [
  EPlayerLabelState.ACTIVE,
  EPlayerLabelState.INACTIVE
];

export const PLAYER_LABEL_STATE_BADGE_COLOR: Record<EPlayerLabelState, string> = {
  [EPlayerLabelState.ACTIVE]: 'green',
  [EPlayerLabelState.INACTIVE]: 'red'
};

export const isPlayerLabelState = (value: string | undefined): value is TPlayerLabelState =>
  value === EPlayerLabelState.ACTIVE || value === EPlayerLabelState.INACTIVE;

export enum ESelfLimitState {
  PENDING = 'pending',
  ACTIVE = 'active',
  REMOVAL_PENDING = 'removal_pending',
  EXPIRED = 'expired'
}

export const SELF_LIMIT_STATE_COLORS = {
  [ESelfLimitState.PENDING]: 'blue',
  [ESelfLimitState.ACTIVE]: 'green',
  [ESelfLimitState.REMOVAL_PENDING]: 'orange',
  [ESelfLimitState.EXPIRED]: 'gray'
} as const satisfies Record<ESelfLimitState, string>;

export const isSelfLimitState = (value: string | undefined): value is ESelfLimitState =>
  !!value && value in SELF_LIMIT_STATE_COLORS;
