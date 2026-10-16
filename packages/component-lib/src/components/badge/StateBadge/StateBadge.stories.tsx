import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';

import StateBadge from '.';

const meta = {
  title: 'Badge/StateBadge',
  component: StateBadge,
  args: {
    state: 'active',
    children: 'Active'
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['active', 'inactive', 'pending']
    }
  },
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof StateBadge>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Active')).toHaveAttribute('data-variant', 'success');
  }
};

export const Inactive: TStory = {
  args: { state: 'inactive', children: 'Inactive' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Inactive')).toHaveAttribute('data-variant', 'muted');
  }
};

export const UnknownState: TStory = {
  args: { state: 'pending', children: 'Pending' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Pending')).toHaveAttribute('data-variant', 'muted');
  }
};
