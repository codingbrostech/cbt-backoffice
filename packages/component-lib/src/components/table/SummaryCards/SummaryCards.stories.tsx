import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { TooltipProvider } from '@cbt-bo/component-lib/components/ui/tooltip';

import SummaryCards from '.';

interface IStoryCard {
  label: string;
  value: string;
  tooltip?: string;
}

interface IStoryArgs {
  className?: string;
  totalCards: IStoryCard[];
  outcomeCards: IStoryCard[];
  isLoading: boolean;
}

interface IPartControls {
  part: string;
  include: readonly (keyof IStoryArgs)[];
}

/**
 * The args grouped by the `SummaryCards` part that takes them.
 */
export const PART_CONTROLS = [
  { part: 'Root', include: ['className'] },
  { part: 'Group', include: ['totalCards', 'outcomeCards'] },
  { part: 'Card', include: ['isLoading'] }
] as const satisfies readonly IPartControls[];

const meta = {
  title: 'Table/SummaryCards',
  tags: ['!autodocs'],
  excludeStories: ['PART_CONTROLS'],
  args: {
    totalCards: [
      {
        label: 'Total Bet Amount',
        value: '9,783,530,771.38',
        tooltip: 'Sum of bet amounts for all matching transactions.'
      },
      {
        label: 'Total Payout Amount',
        value: '9,635,755,278.10',
        tooltip: 'Sum of payout amounts for all matching transactions.'
      },
      {
        label: 'Total W/L (GGR)',
        value: '147,775,493.28',
        tooltip: 'Total Bet Amount minus Total Payout Amount.'
      },
      {
        label: 'Total Transactions',
        value: '14,088,943',
        tooltip: 'Total number of matching transactions.'
      }
    ],
    outcomeCards: [
      { label: 'Win Count', value: '2,035,285' },
      { label: 'Loss Count', value: '10,659,673' },
      { label: 'Tie Count', value: '1,376,949' }
    ],
    isLoading: false
  },
  argTypes: {
    className: {
      type: { name: 'string' },
      description: 'Classes on `Root`.',
      table: { category: 'Root' }
    },
    totalCards: {
      description: 'Story-only. The cards of the first `Group`.',
      table: { category: 'Group' }
    },
    outcomeCards: {
      description: 'Story-only. The cards of the second `Group`.',
      table: { category: 'Group' }
    },
    isLoading: {
      type: { name: 'boolean' },
      description: 'Shows a skeleton in place of each `Card` value.',
      table: { category: 'Card' }
    }
  },
  render: ({ className, totalCards, outcomeCards, isLoading }) => (
    <TooltipProvider>
      <SummaryCards.Root className={className}>
        <SummaryCards.Group>
          {totalCards.map(card => (
            <SummaryCards.Card key={card.label} {...card} isLoading={isLoading} />
          ))}
        </SummaryCards.Group>
        <SummaryCards.Group>
          {outcomeCards.map(card => (
            <SummaryCards.Card key={card.label} {...card} isLoading={isLoading} />
          ))}
        </SummaryCards.Group>
      </SummaryCards.Root>
    </TooltipProvider>
  )
} satisfies Meta<IStoryArgs>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('9,783,530,771.38')).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: 'Total number of matching transactions.' })
    ).toBeInTheDocument();
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
  }
};

export const Wrapped: TStory = {
  decorators: [
    Story => (
      <div className="w-4xl">
        <Story />
      </div>
    )
  ],
  play: async ({ canvasElement }) => {
    const [totalGroup, outcomeGroup] = canvasElement.querySelectorAll(
      '[data-slot="summary-cards-group"]'
    );

    await expect(outcomeGroup?.getBoundingClientRect().top).toBeGreaterThan(
      totalGroup?.getBoundingClientRect().bottom ?? 0
    );
  }
};

export const Loading: TStory = {
  args: { isLoading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Total Bet Amount')).toBeInTheDocument();
    await expect(canvas.queryByText('9,783,530,771.38')).not.toBeInTheDocument();
  }
};
