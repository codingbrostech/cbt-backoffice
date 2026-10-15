import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { expect, screen, userEvent, within } from 'storybook/test';

import { Button } from '@cbt-bo/component-lib/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@cbt-bo/component-lib/components/ui/dialog';

import SelectField, { type ISelectFieldProps } from '.';

type TSelectFieldStoryArgs = ISelectFieldProps & {
  value?: string;
  errorMessage?: string;
};

const ROLE_OPTIONS = [
  { value: 'super', label: 'Super' },
  { value: 'admin', label: 'Admin' },
  { value: 'ops', label: 'Ops' }
];

const RANK_OPTIONS = Array.from({ length: 30 }, (_, index) => {
  const rank = String(index + 1);

  return { value: rank, label: rank };
});

const meta = {
  title: 'Forms/SelectField',
  component: SelectField,
  tags: ['!autodocs'],
  args: {
    name: 'role',
    label: 'Role',
    options: ROLE_OPTIONS,
    placeholder: 'Select a role',
    emptyLabel: '',
    clearLabel: '',
    noResultsLabel: 'Nothing found',
    size: 'default',
    disabled: false,
    value: '',
    errorMessage: ''
  },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'inline-radio', options: ['default', 'sm'] },
    value: {
      control: 'select',
      options: ['', ...ROLE_OPTIONS.map(({ value }) => value)],
      description: 'Value the story seeds the bound field with'
    },
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
  render: function Render({ name, value, errorMessage, ...args }) {
    const { control, reset, setError } = useForm({ defaultValues: { [name]: value } });

    useEffect(() => {
      reset({ [name]: value });

      if (errorMessage) {
        setError(name, { message: errorMessage });
      }
    }, [name, value, errorMessage, reset, setError]);

    return <SelectField {...args} name={name} control={control} />;
  }
} satisfies Meta<TSelectFieldStoryArgs>;

export default meta;

type TStory = StoryObj<TSelectFieldStoryArgs>;

export const Default: TStory = {};

export const WithEmptyOption: TStory = {
  args: { emptyLabel: 'All', placeholder: undefined }
};

export const Selected: TStory = {
  args: { value: 'admin' }
};

export const Clearable: TStory = {
  args: { value: 'admin', clearLabel: 'Clear' }
};

export const Searching: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Role' });

    await userEvent.click(input);
    await userEvent.keyboard('op');

    await expect(await screen.findByRole('option', { name: 'Ops' })).toBeInTheDocument();
    await expect(screen.queryByRole('option', { name: 'Admin' })).not.toBeInTheDocument();

    await userEvent.keyboard('{Enter}');

    await expect(input).toHaveValue('Ops');
  }
};

export const NoResults: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('combobox', { name: 'Role' }));
    await userEvent.keyboard('zz');

    await expect(await screen.findByText('Nothing found')).toBeInTheDocument();
  }
};

export const ClickingLabel: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText('Role'));

    await expect(canvas.getByRole('combobox', { name: 'Role' })).toHaveFocus();
    await expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  }
};

export const InDialog: TStory = {
  args: { label: 'Rank', options: RANK_OPTIONS, placeholder: 'Select a rank' },
  decorators: [
    Story => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit entry</DialogTitle>
          <DialogDescription>The open list scrolls with the mouse wheel.</DialogDescription>
          <Story />
        </DialogContent>
      </Dialog>
    )
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }));
    await userEvent.click(await screen.findByRole('combobox', { name: 'Rank' }));

    const listbox = await screen.findByRole('listbox');
    const wheel = new WheelEvent('wheel', { deltaY: 100, bubbles: true, cancelable: true });

    listbox.dispatchEvent(wheel);

    await expect(wheel.defaultPrevented).toBe(false);
  }
};

export const Small: TStory = {
  args: { size: 'sm' }
};

export const Invalid: TStory = {
  args: { errorMessage: 'Role is required' }
};

export const Disabled: TStory = {
  args: { value: 'admin', disabled: true }
};
