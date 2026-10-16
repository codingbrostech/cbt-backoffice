import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import MultiSelectField, { type IMultiSelectFieldProps } from '.';

type TMultiSelectFieldStoryArgs = IMultiSelectFieldProps & {
  value?: string[];
  errorMessage?: string;
};

const LABEL_OPTIONS = [
  { value: 'vip', label: 'VIP' },
  { value: 'new', label: 'New' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'high-roller', label: 'High roller' },
  { value: 'bonus-abuser', label: 'Bonus abuser' },
  { value: 'newsletter', label: 'Newsletter' }
];

const EVERY_LABEL = LABEL_OPTIONS.map(({ value }) => value);

const meta = {
  title: 'Forms/MultiSelectField',
  component: MultiSelectField,
  tags: ['!autodocs'],
  args: {
    name: 'labelIds',
    label: 'Labels',
    options: LABEL_OPTIONS,
    removeLabel: 'Remove',
    placeholder: 'All',
    clearLabel: '',
    noResultsLabel: 'Nothing found',
    maxChips: undefined,
    size: 'default',
    disabled: false,
    value: [],
    errorMessage: ''
  },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'inline-radio', options: ['default', 'sm'] },
    value: {
      control: 'check',
      options: EVERY_LABEL,
      description: 'Values the story seeds the bound field with'
    },
    formatHiddenCount: { control: false },
    maxChips: { control: { type: 'number', min: 0 } },
    errorMessage: {
      control: 'text',
      description: 'Error the story writes to the field. Empty keeps the field valid'
    },
    options: { control: false }
  },
  parameters: {
    layout: 'centered',
    controls: { exclude: ['control'] }
  },
  decorators: [
    Story => (
      <div className="w-80">
        <Story />
      </div>
    )
  ],
  render: function Render({ name, value = [], errorMessage, ...args }) {
    const { control, reset, setError } = useForm({ defaultValues: { [name]: value } });

    useEffect(() => {
      reset({ [name]: value });

      if (errorMessage) {
        setError(name, { message: errorMessage });
      }
    }, [name, value, errorMessage, reset, setError]);

    return <MultiSelectField {...args} name={name} control={control} />;
  }
} satisfies Meta<TMultiSelectFieldStoryArgs>;

export default meta;

type TStory = StoryObj<TMultiSelectFieldStoryArgs>;

export const Default: TStory = {};

export const Picked: TStory = {
  args: { value: ['vip', 'new'] }
};

export const Clearable: TStory = {
  args: { value: ['vip'], clearLabel: 'Clear' }
};

export const Overflowing: TStory = {
  args: { value: EVERY_LABEL, formatHiddenCount: count => `+${count} more` },
  decorators: [
    Story => (
      <div className="w-[26rem]">
        <Story />
      </div>
    )
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = await canvas.findByText(/^\+\d+ more$/, { ignore: '[aria-hidden="true"] *' });
    const removeButtons = canvas.getAllByRole('button', { name: /^Remove / });

    await expect(badge).toHaveAttribute('title', expect.stringContaining('Newsletter'));
    await expect(removeButtons.length).toBeLessThan(EVERY_LABEL.length);
    await expect(removeButtons.length).toBeGreaterThanOrEqual(2);
  }
};

export const Toggling: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Labels' }));
    await userEvent.click(await screen.findByRole('option', { name: 'VIP' }));

    await expect(canvas.getByRole('button', { name: 'Remove VIP' })).toBeInTheDocument();
    await expect(screen.getByRole('option', { name: 'VIP' })).toHaveAttribute(
      'aria-selected',
      'true'
    );

    await userEvent.click(screen.getByRole('option', { name: 'VIP' }));

    await expect(canvas.queryByRole('button', { name: 'Remove VIP' })).not.toBeInTheDocument();
  }
};

export const Capped: TStory = {
  args: { value: EVERY_LABEL, maxChips: 2, formatHiddenCount: count => `+${count} more` },
  decorators: [
    Story => (
      <div className="w-[40rem]">
        <Story />
      </div>
    )
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      await canvas.findByText('+4 more', { ignore: '[aria-hidden="true"] *' })
    ).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: /^Remove / })).toHaveLength(2);
  }
};

export const OverflowingByPicking: TStory = {
  args: { formatHiddenCount: count => `+${count} more` },
  decorators: [
    Story => (
      <div className="w-[26rem]">
        <Story />
      </div>
    )
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Labels' }));

    for (const { label } of LABEL_OPTIONS) {
      await userEvent.click(await screen.findByRole('option', { name: label }));
    }

    await userEvent.keyboard('{Escape}');
    await waitFor(async () => {
      await expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    const removeButtons = canvas.getAllByRole('button', { name: /^Remove / });

    await expect(
      canvas.getByText(/^\+\d+ more$/, { ignore: '[aria-hidden="true"] *' })
    ).toBeInTheDocument();
    await expect(removeButtons.length).toBeGreaterThanOrEqual(2);
  }
};

export const Searching: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Labels' });

    await userEvent.click(input);
    await userEvent.keyboard('blo');

    await expect(await screen.findByRole('option', { name: 'Blocked' })).toBeInTheDocument();
    await expect(screen.queryByRole('option', { name: 'VIP' })).not.toBeInTheDocument();

    await userEvent.keyboard('{Enter}');

    await expect(canvas.getByRole('button', { name: 'Remove Blocked' })).toBeInTheDocument();
    await expect(input).toHaveValue('');
    await expect(await screen.findByRole('option', { name: 'VIP' })).toBeInTheDocument();
  }
};

export const RemovingPicked: TStory = {
  args: { value: ['vip', 'new'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Remove VIP' }));

    await expect(canvas.queryByRole('button', { name: 'Remove VIP' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Remove New' })).toBeInTheDocument();
    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  }
};

export const NoResults: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Labels' }));
    await userEvent.keyboard('zz');

    await expect(await screen.findByText('Nothing found')).toBeInTheDocument();
  }
};

export const ClickingLabel: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText('Labels'));

    await expect(canvas.getByRole('combobox', { name: 'Labels' })).toHaveFocus();
    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  }
};

export const Small: TStory = {
  args: { size: 'sm', value: ['vip'] }
};

export const Invalid: TStory = {
  args: { errorMessage: 'Pick at least one label' }
};

export const Disabled: TStory = {
  args: { value: ['vip'], disabled: true }
};
