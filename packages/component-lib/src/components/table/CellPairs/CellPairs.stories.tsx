import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import CellPairs from '.';

const meta = {
  title: 'Table/CellPairs',
  component: CellPairs,
  args: {
    pairs: [
      { label: 'Bet', value: '1,000.00' },
      { label: 'Valid Bet', value: '1,000.00' },
      { label: 'Win/Loss', value: '-250.00' },
      { label: 'Payout', value: '' }
    ],
    isNumeric: true
  },
  render: args => (
    <div className="w-fit">
      <CellPairs {...args} />
    </div>
  )
} satisfies Meta<typeof CellPairs>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Amounts: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Win/Loss')).toBeInTheDocument();
    await expect(canvas.getByText('-')).toBeInTheDocument();
  }
};

export const Text: TStory = {
  args: {
    pairs: [
      { label: 'Bet Time', value: '2026-10-13 08:30:00' },
      { label: 'Settle Time', value: '2026-10-13 08:31:12' }
    ],
    isNumeric: false
  }
};
