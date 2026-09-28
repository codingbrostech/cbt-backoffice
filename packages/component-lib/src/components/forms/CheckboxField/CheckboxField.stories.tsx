import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import CheckboxField, { type ICheckboxFieldProps } from '.';

type TCheckboxFieldStoryArgs = ICheckboxFieldProps & {
  isChecked?: boolean;
};

const meta = {
  title: 'Forms/CheckboxField',
  component: CheckboxField,
  tags: ['!autodocs'],
  args: {
    name: 'isRememberMe',
    label: 'Remember login information',
    disabled: false,
    isChecked: false
  },
  argTypes: {
    name: { control: 'text' },
    isChecked: {
      control: 'boolean',
      description: 'Value the story seeds the bound field with'
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
  render: function Render({ name, isChecked, ...args }) {
    const { control, reset } = useForm({ defaultValues: { [name]: isChecked } });

    useEffect(() => {
      reset({ [name]: isChecked });
    }, [name, isChecked, reset]);

    return <CheckboxField {...args} name={name} control={control} />;
  }
} satisfies Meta<TCheckboxFieldStoryArgs>;

export default meta;

type TStory = StoryObj<TCheckboxFieldStoryArgs>;

export const Default: TStory = {};

export const Checked: TStory = {
  args: { isChecked: true }
};

export const Disabled: TStory = {
  args: { isChecked: true, disabled: true }
};
