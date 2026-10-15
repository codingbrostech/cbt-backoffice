export type TBaccaratSide = 'player' | 'banker';

export type TBaccaratWinner = TBaccaratSide | 'tie';

export interface IBaccaratHand {
  /**
   * Codes of the two dealt cards, without empty slots.
   */
  cards: number[];
  /**
   * Code of the drawn third card. Absent when no third card was drawn.
   */
  third?: number;
}

export type TBaccaratHands = Record<TBaccaratSide, IBaccaratHand>;

export interface IPlayingCard {
  rank: string;
  suit: string;
  isRed: boolean;
}

interface ISuit {
  symbol: string;
  isRed: boolean;
}

const HAND_SIZE = 3;
const ROUND_CARD_COUNT = HAND_SIZE * 2;
const SUIT_FACTOR = 100;
const MIN_RANK = 1;
const MAX_RANK = 13;
const FACE_RANK = 10;
const POINTS_MODULO = 10;

const SUITS: Readonly<Record<number, ISuit>> = {
  1: { symbol: '♠', isRed: false },
  2: { symbol: '♥', isRed: true },
  3: { symbol: '♣', isRed: false },
  4: { symbol: '♦', isRed: true }
} as const;

const RANK_LABELS: Readonly<Record<number, string>> = {
  1: 'A',
  11: 'J',
  12: 'Q',
  13: 'K'
} as const;

const WINNERS: Readonly<Record<string, TBaccaratWinner>> = {
  '1': 'banker',
  '2': 'player',
  '3': 'tie'
} as const;

const buildRank = (code: number): number => code % SUIT_FACTOR;

const buildSuit = (code: number): ISuit | undefined => SUITS[Math.floor(code / SUIT_FACTOR)];

const isCardCode = (code: number): boolean => {
  const rank = buildRank(code);
  const isRankValid = rank >= MIN_RANK && rank <= MAX_RANK;

  return Number.isInteger(code) && isRankValid && Boolean(buildSuit(code));
};

const isSlotCode = (code: number): boolean => code === 0 || isCardCode(code);

const buildHand = (codes: number[]): IBaccaratHand => {
  const [first = 0, second = 0, third = 0] = codes;
  const cards = [first, second].filter(Boolean);

  return third ? { cards, third } : { cards };
};

const buildCardPoint = (code: number): number => {
  const rank = buildRank(code);

  return rank >= FACE_RANK ? 0 : rank;
};

/**
 * Splits a baccarat `roundCard` value into the player and banker hands. The
 * value lists ROUND_CARD_COUNT card codes, banker hand first, each written as
 * suit × 100 plus rank with 0 for an empty slot, optionally followed by `!`
 * and extra data. Returns undefined when the value does not have that shape.
 *
 * @example
 * buildBaccaratHands('105,402,0,111,310,308');
 * // { banker: { cards: [105, 402] }, player: { cards: [111, 310], third: 308 } }
 */
export const buildBaccaratHands = (roundCard: string): TBaccaratHands | undefined => {
  const [cardList = ''] = roundCard.split('!');
  const rawCodes = cardList.split(',');
  const codes = rawCodes.map(code => Number(code.trim()));
  const isValid = codes.length === ROUND_CARD_COUNT && codes.every(isSlotCode);

  if (!isValid) return undefined;

  const bankerCodes = codes.slice(0, HAND_SIZE);
  const playerCodes = codes.slice(HAND_SIZE);

  return { banker: buildHand(bankerCodes), player: buildHand(playerCodes) };
};

/**
 * The winner named by the first entry of a baccarat `roundResult` value,
 * `1` banker, `2` player or `3` tie. Absent for any other entry.
 *
 * @example
 * buildBaccaratWinner('2,0,0,0'); // 'player'
 */
export const buildBaccaratWinner = (roundResult = ''): TBaccaratWinner | undefined => {
  const [winnerCode = ''] = roundResult.split(',');

  return WINNERS[winnerCode];
};

/**
 * Baccarat points of a hand. Tens and face cards count 0, aces count 1, and
 * only the last digit of the sum is kept.
 */
export const buildHandPoints = ({ cards, third = 0 }: IBaccaratHand): number => {
  const codes = [...cards, third];
  const points = codes.map(buildCardPoint);
  const total = points.reduce((sum, point) => sum + point, 0);

  return total % POINTS_MODULO;
};

/**
 * Rank label, suit symbol and colour of one card code. Absent when the code
 * names no known suit.
 */
export const buildPlayingCard = (code: number): IPlayingCard | undefined => {
  const suit = buildSuit(code);
  const rank = buildRank(code);

  if (!suit) return undefined;

  return { rank: RANK_LABELS[rank] ?? String(rank), suit: suit.symbol, isRed: suit.isRed };
};
