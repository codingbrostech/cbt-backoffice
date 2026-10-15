import {
  type IBaccaratHand,
  type TBaccaratSide,
  type TBaccaratWinner,
  buildBaccaratHands,
  buildBaccaratWinner,
  buildHandPoints,
  buildPlayingCard
} from '@cbt-bo/component-lib/components/game/BaccaratCards/baccarat-round';
import { cn } from '@cbt-bo/component-lib/lib/utils';

export type {
  IBaccaratHand,
  IPlayingCard,
  TBaccaratHands,
  TBaccaratSide,
  TBaccaratWinner
} from '@cbt-bo/component-lib/components/game/BaccaratCards/baccarat-round';

export interface IBaccaratCardsLabels {
  player: string;
  banker: string;
  tie: string;
}

export interface IBaccaratCardsProps {
  /**
   * Raw `roundCard` value. Shown as plain text when it does not parse.
   */
  roundCard: string;
  /**
   * Raw `roundResult` value whose first entry names the winner.
   */
  roundResult?: string;
  /**
   * Translated side names, shown above each hand and announced for the winner.
   */
  labels: IBaccaratCardsLabels;
  className?: string;
}

interface ICardProps {
  code: number;
}

interface IHandProps {
  side: TBaccaratSide;
  hand: IBaccaratHand;
  label: string;
  winner?: TBaccaratWinner;
}

const SIDES = ['player', 'banker'] as const satisfies readonly TBaccaratSide[];

const WIN_TINTS = {
  player: 'bg-toast-info/15',
  banker: 'bg-destructive/15',
  tie: 'bg-toast-success/15'
} as const satisfies Record<TBaccaratWinner, string>;

const buildSideTint = (side: TBaccaratSide, winner?: TBaccaratWinner): string | undefined => {
  if (winner === 'tie') return WIN_TINTS.tie;
  if (winner === side) return WIN_TINTS[side];

  return undefined;
};

const PlayingCard = ({ code }: ICardProps) => {
  const card = buildPlayingCard(code);

  if (!card) return null;

  const { rank, suit, isRed } = card;

  return (
    <span
      data-slot="playing-card"
      className={cn(
        'inline-flex h-7 w-5 flex-col items-center justify-center rounded-sm border border-border bg-card text-[10px] leading-none font-semibold',
        isRed ? 'text-destructive' : 'text-foreground'
      )}
    >
      <span>{rank}</span>
      <span aria-hidden>{suit}</span>
    </span>
  );
};

const ThirdCard = ({ code }: ICardProps) => (
  <span className="inline-flex size-7 items-center justify-center">
    <span className="inline-flex rotate-90">
      <PlayingCard code={code} />
    </span>
  </span>
);

const Hand = ({ side, hand, label, winner }: IHandProps) => {
  const { cards, third } = hand;
  const points = buildHandPoints(hand);
  const isThirdLeading = side === 'player';
  const thirdCard = third ? <ThirdCard code={third} /> : null;

  return (
    <span
      data-slot="baccarat-hand"
      className={cn(
        'flex flex-col items-center gap-0.5 rounded-md px-1.5 py-1',
        buildSideTint(side, winner)
      )}
    >
      <span className="text-[11px] text-muted-foreground">
        {label} {points}
      </span>
      <span className="flex items-center gap-0.5">
        {isThirdLeading && thirdCard}
        {cards.map((code, index) => (
          <PlayingCard key={`${index}-${code}`} code={code} />
        ))}
        {!isThirdLeading && thirdCard}
      </span>
    </span>
  );
};

/**
 * A baccarat round as playing cards, the player hand then the banker hand,
 * each with its points. The winning hand is tinted, both hands on a tie, and
 * a drawn third card lies sideways on the outer edge.
 *
 * @example
 * <BaccaratCards roundCard="105,402,0,111,310,308" roundResult="2,0,0,0" labels={labels} />
 */
const BaccaratCards = ({ roundCard, roundResult, labels, className }: IBaccaratCardsProps) => {
  const hands = buildBaccaratHands(roundCard);
  const winner = buildBaccaratWinner(roundResult);

  if (!hands) return <span className={cn('text-muted-foreground', className)}>{roundCard}</span>;

  return (
    <span data-slot="baccarat-cards" className={cn('inline-flex gap-1.5', className)}>
      {winner && <span className="sr-only">{labels[winner]}</span>}
      {SIDES.map(side => (
        <Hand key={side} side={side} hand={hands[side]} label={labels[side]} winner={winner} />
      ))}
    </span>
  );
};

export default BaccaratCards;
