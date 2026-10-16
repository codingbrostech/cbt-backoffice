import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, within } from 'storybook/test';

import StateSelectBadge from '.';

const STATE_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'freeze', label: 'Freeze' }
];

const KYC_STATE_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' }
];

const meta = {
  title: 'Badge/StateSelectBadge',
  component: StateSelectBadge,
  args: {
    state: 'active',
    children: 'Active',
    options: STATE_OPTIONS,
    onStateChange: fn()
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['active', 'freeze', 'delete']
    }
  },
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof StateSelectBadge>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Active')).toHaveAttribute('data-variant', 'success');

    await userEvent.click(canvas.getByRole('combobox'));
    await userEvent.click(await screen.findByRole('option', { name: 'Freeze' }));

    await expect(args.onStateChange).toHaveBeenCalledWith('freeze');
  }
};

export const CurrentStatePicked: TStory = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox'));
    await userEvent.click(await screen.findByRole('option', { name: 'Active' }));

    await expect(args.onStateChange).not.toHaveBeenCalled();
  }
};

export const UnlistedState: TStory = {
  args: { state: 'delete', children: 'Delete' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Delete')).toHaveAttribute('data-variant', 'destructive-muted');

    await userEvent.click(canvas.getByRole('combobox'));

    await expect(await screen.findByRole('option', { name: 'Freeze' })).toBeInTheDocument();
    await expect(screen.queryByRole('option', { name: 'Delete' })).not.toBeInTheDocument();
  }
};

export const CustomVariants: TStory = {
  args: {
    state: 'pending',
    children: 'Pending',
    options: KYC_STATE_OPTIONS,
    variants: { pending: 'info', approved: 'success' }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Pending')).toHaveAttribute('data-variant', 'info');

    await userEvent.click(canvas.getByRole('combobox'));

    const approvedOption = await screen.findByRole('option', { name: 'Approved' });

    await expect(within(approvedOption).getByText('Approved')).toHaveAttribute(
      'data-variant',
      'success'
    );
  }
};

export const Placeholder: TStory = {
  args: { state: '', children: undefined, placeholder: 'Not set' },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Not set')).toHaveAttribute('data-variant', 'outline');

    await userEvent.click(canvas.getByRole('combobox'));

    await expect(await screen.findByRole('option', { name: 'Active' })).toHaveAttribute(
      'data-state',
      'unchecked'
    );

    await userEvent.click(screen.getByRole('option', { name: 'Freeze' }));

    await expect(args.onStateChange).toHaveBeenCalledWith('freeze');
  }
};
