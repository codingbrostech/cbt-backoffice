import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import TextareaField, { type ITextareaFieldProps } from '.';

type TTextareaFieldStoryArgs = ITextareaFieldProps & {
  value?: string;
  errorMessage?: string;
};

const meta = {
  title: 'Forms/TextareaField',
  component: TextareaField,
  tags: ['!autodocs'],
  args: {
    name: 'description',
    label: 'Description',
    placeholder: 'Short teaser shown under the title',
    rows: 3,
    disabled: false,
    value: '',
    errorMessage: ''
  },
  argTypes: {
    name: { control: 'text' },
    rows: { control: { type: 'number', min: 2, max: 10 } },
    value: {
      control: 'text',
      description: 'Value the story seeds the bound field with'
    },
    errorMessage: {
      control: 'text',
      description: 'Error the story writes to the field. Empty keeps the field valid'
    }
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

    return <TextareaField {...args} name={name} control={control} />;
  }
} satisfies Meta<TTextareaFieldStoryArgs>;

export default meta;

type TStory = StoryObj<TTextareaFieldStoryArgs>;

export const Default: TStory = {};

export const Filled: TStory = {
  args: {
    value:
      'Stampede across the reels as golden buffalo herds trigger expanding wilds and free spins.'
  }
};

export const Invalid: TStory = {
  args: { errorMessage: 'Description is required' }
};

export const Disabled: TStory = {
  args: { value: 'Short teaser', disabled: true }
};
