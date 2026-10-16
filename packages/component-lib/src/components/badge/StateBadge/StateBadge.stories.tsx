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
      options: ['active', 'inactive', 'freeze', 'delete', 'pending']
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

export const Freeze: TStory = {
  args: { state: 'freeze', children: 'Freeze' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Freeze')).toHaveAttribute('data-variant', 'warning');
  }
};

export const Delete: TStory = {
  args: { state: 'delete', children: 'Delete' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Delete')).toHaveAttribute('data-variant', 'destructive-muted');
  }
};

export const UnknownState: TStory = {
  args: { state: 'pending', children: 'Pending' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Pending')).toHaveAttribute('data-variant', 'muted');
  }
};

export const CustomVariants: TStory = {
  args: {
    state: 'approved',
    children: 'Approved',
    variants: { pending: 'info', approved: 'success' }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Approved')).toHaveAttribute('data-variant', 'success');
  }
};
