import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

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

export const Small: TStory = {
  args: { size: 'sm' }
};

export const Invalid: TStory = {
  args: { errorMessage: 'Role is required' }
};

export const Disabled: TStory = {
  args: { value: 'admin', disabled: true }
};
