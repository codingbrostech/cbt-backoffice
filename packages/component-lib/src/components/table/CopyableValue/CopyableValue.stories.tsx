import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import { TooltipProvider } from '@cbt-bo/component-lib/components/ui/tooltip';

import CopyableValue from '.';

const meta = {
  title: 'Table/CopyableValue',
  component: CopyableValue,
  args: {
    value: '8070450532248078846',
    labels: { copy: 'Copy', copied: 'Copied' }
  },
  render: args => (
    <TooltipProvider>
      <div className="w-fit text-sm">
        <CopyableValue {...args} />
      </div>
    </TooltipProvider>
  )
} satisfies Meta<typeof CopyableValue>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Full: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('8070450532248078846')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  }
};

export const Shortened: TStory = {
  args: {
    value: 'ba0000526100928201057',
    isShortened: true
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('ba0…057')).toBeInTheDocument();
  }
};
