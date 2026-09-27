import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchIcon, UserIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import TextField, { type ITextFieldProps } from '.';

type TTextFieldStoryArgs = ITextFieldProps & {
  value?: string;
  errorMessage?: string;
};

const meta = {
  title: 'Forms/TextField',
  component: TextField,
  tags: ['!autodocs'],
  args: {
    name: 'username',
    label: 'Admin ID',
    placeholder: 'Admin ID',
    autoComplete: 'username',
    disabled: false,
    value: '',
    errorMessage: ''
  },
  argTypes: {
    name: { control: 'text' },
    value: {
      control: 'text',
      description: 'Value the story seeds the bound field with'
    },
    errorMessage: {
      control: 'text',
      description: 'Error the story writes to the field. Empty keeps the field valid'
    },
    prefix: { control: false },
    suffix: { control: false }
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

    return <TextField {...args} name={name} control={control} />;
  }
} satisfies Meta<TTextFieldStoryArgs>;

export default meta;

type TStory = StoryObj<TTextFieldStoryArgs>;

export const Default: TStory = {};

export const WithPrefix: TStory = {
  args: { prefix: <UserIcon /> }
};

export const WithSuffix: TStory = {
  args: { suffix: <SearchIcon className="size-4 text-muted-foreground" /> }
};

export const Invalid: TStory = {
  args: { errorMessage: 'Admin ID is required' }
};

export const Disabled: TStory = {
  args: { value: 'admin', disabled: true }
};
