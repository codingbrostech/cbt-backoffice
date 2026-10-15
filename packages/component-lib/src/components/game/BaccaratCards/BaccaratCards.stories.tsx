import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import BaccaratCards from '.';

const meta = {
  title: 'Game/BaccaratCards',
  component: BaccaratCards,
  args: {
    roundCard: '105,402,0,111,310,308',
    roundResult: '2,0,0,0',
    labels: { player: 'Player', banker: 'Banker', tie: 'Tie' }
  },
  render: args => (
    <div className="w-fit">
      <BaccaratCards {...args} />
    </div>
  )
} satisfies Meta<typeof BaccaratCards>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const PlayerWin: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Player 8')).toBeInTheDocument();
    await expect(canvas.getByText('Banker 7')).toBeInTheDocument();
  }
};

export const BankerWin: TStory = {
  args: { roundCard: '213,103,405,202,305,0', roundResult: '1,0,0,0' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Banker 8')).toBeInTheDocument();
    await expect(canvas.getByText('Player 7')).toBeInTheDocument();
  }
};

export const Tie: TStory = {
  args: { roundCard: '205,302,0,404,103,0', roundResult: '3,0,0,0' }
};

export const Unparsed: TStory = {
  args: { roundCard: 'not-a-round', roundResult: '' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('not-a-round')).toBeInTheDocument();
  }
};
