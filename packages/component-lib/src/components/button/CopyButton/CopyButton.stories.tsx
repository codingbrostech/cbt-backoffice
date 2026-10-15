import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import CopyButton from '.';

const meta = {
  title: 'Button/CopyButton',
  component: CopyButton,
  args: {
    value: 'DRAGON TRIO',
    labels: { copy: 'Copy', copied: 'Copied' }
  },
  render: args => (
    <div className="w-fit">
      <CopyButton {...args} />
    </div>
  )
} satisfies Meta<typeof CopyButton>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  }
};
