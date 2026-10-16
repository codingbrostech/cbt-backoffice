import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';

import { TooltipProvider } from '@cbt-bo/component-lib/components/ui/tooltip';

import CellPairs from '.';

const LONG_EMAIL = 'ada.lovelace@analytical-engine.example.com';

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
    <TooltipProvider>
      <div className="w-fit max-w-96">
        <CellPairs {...args} />
      </div>
    </TooltipProvider>
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

export const SecondaryRow: TStory = {
  args: {
    pairs: [
      { label: 'Player ID', value: '1024' },
      { label: 'Mobile', value: '+63 917 000 0000' },
      { label: 'Nickname', value: 'ada', isSecondary: true },
      { label: 'Player Type', value: 'Normal', isSecondary: true }
    ],
    isNumeric: false
  }
};

export const TwoColumns: TStory = {
  args: {
    pairs: [
      { label: 'First Name', value: 'Ada' },
      { label: 'Last Name', value: 'Lovelace' },
      { label: 'Nickname', value: 'ada' },
      { label: 'Email', value: 'ada@example.com' }
    ],
    columns: 2,
    isNumeric: false
  },
  render: args => (
    <div className="w-96 divide-y">
      <div className="py-2">
        <CellPairs {...args} />
      </div>
      <div className="py-2">
        <CellPairs
          {...args}
          pairs={[
            { label: 'First Name', value: '' },
            { label: 'Last Name', value: '' },
            { label: 'Nickname', value: 'FMEXTTest4' },
            { label: 'Email', value: '' }
          ]}
        />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const labels = canvas.getAllByText('Last Name');
    const lefts = labels.map(label => label.getBoundingClientRect().left);

    await expect(lefts).toHaveLength(2);
    await expect(lefts[1]).toBe(lefts[0]);
  }
};

export const Truncated: TStory = {
  args: {
    pairs: [
      { label: 'First Name', value: 'Ada' },
      { label: 'Last Name', value: 'Lovelace' },
      { label: 'Nickname', value: 'ada' },
      { label: 'Email', value: LONG_EMAIL }
    ],
    columns: 2,
    isNumeric: false,
    isTruncated: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.hover(canvas.getByText(LONG_EMAIL));

    await expect(await body.findByRole('tooltip')).toHaveTextContent(LONG_EMAIL);
  }
};
