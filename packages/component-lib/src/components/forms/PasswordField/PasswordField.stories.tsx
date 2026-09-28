import type { Meta, StoryObj } from '@storybook/react-vite';
import { LockIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { expect, userEvent, within } from 'storybook/test';

import PasswordField, { type IPasswordFieldProps } from '.';

type TPasswordFieldStoryArgs = IPasswordFieldProps & {
  value?: string;
};

const meta = {
  title: 'Forms/PasswordField',
  component: PasswordField,
  tags: ['!autodocs'],
  args: {
    name: 'password',
    label: 'Password',
    placeholder: 'Password',
    autoComplete: 'current-password',
    showLabel: 'Show password',
    hideLabel: 'Hide password',
    disabled: false,
    value: 'secret'
  },
  argTypes: {
    name: { control: 'text' },
    value: {
      control: 'text',
      description: 'Value the story seeds the bound field with'
    },
    prefix: { control: false }
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
  render: function Render({ name, value, ...args }) {
    const { control, reset } = useForm({ defaultValues: { [name]: value } });

    useEffect(() => {
      reset({ [name]: value });
    }, [name, value, reset]);

    return <PasswordField {...args} name={name} control={control} />;
  }
} satisfies Meta<TPasswordFieldStoryArgs>;

export default meta;

type TStory = StoryObj<TPasswordFieldStoryArgs>;

export const Default: TStory = {};

export const Revealed: TStory = {
  parameters: { docs: { story: { autoplay: true } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));

    await expect(canvas.getByLabelText('Password')).toHaveAttribute('type', 'text');
  }
};

export const WithPrefix: TStory = {
  args: { prefix: <LockIcon /> }
};

export const Disabled: TStory = {
  args: { disabled: true }
};
