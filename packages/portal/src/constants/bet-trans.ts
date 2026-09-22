export enum EBetResult {
  WIN = 'win',
  LOSE = 'lose',
  TIE = 'tie'
}

export type TBetResult = EBetResult;

export const BET_RESULTS: TBetResult[] = [EBetResult.WIN, EBetResult.LOSE, EBetResult.TIE];

export const BET_RESULT_COLORS: Record<TBetResult, string> = {
  [EBetResult.WIN]: 'green',
  [EBetResult.LOSE]: 'red',
  [EBetResult.TIE]: 'gray'
};

export const isBetResult = (value: string | undefined): value is EBetResult =>
  !!value && value in BET_RESULT_COLORS;

export enum EBetState {
  NORMAL = 'normal',
  RESULT = 'result',
  CANCEL = 'cancel',
  ERROR = 'error'
}

export type TBetState = EBetState;

export const BET_STATES: TBetState[] = [
  EBetState.NORMAL,
  EBetState.RESULT,
  EBetState.CANCEL,
  EBetState.ERROR
];

export const BET_STATE_COLORS: Record<TBetState, string> = {
  [EBetState.NORMAL]: 'green',
  [EBetState.RESULT]: 'blue',
  [EBetState.CANCEL]: 'gray',
  [EBetState.ERROR]: 'red'
};

export const isBetState = (value: string | undefined): value is EBetState =>
  !!value && value in BET_STATE_COLORS;
