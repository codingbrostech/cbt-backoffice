import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import PasswordToggle from '.';

const meta = {
  title: 'Forms/PasswordToggle',
  component: PasswordToggle,
  tags: ['!autodocs'],
  args: {
    isVisible: false,
    disabled: false,
    showLabel: 'Show password',
    hideLabel: 'Hide password',
    onToggle: fn()
  },
  argTypes: {
    isVisible: {
      control: 'boolean',
      description: 'Shows the hide icon and names the button with `hideLabel`'
    }
  },
  parameters: { layout: 'centered' },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleToggle = () => {
      updateArgs({ isVisible: !args.isVisible });
      args.onToggle();
    };

    return <PasswordToggle {...args} onToggle={handleToggle} />;
  }
} satisfies Meta<typeof PasswordToggle>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Visible: TStory = {
  args: { isVisible: true }
};

export const Disabled: TStory = {
  args: { disabled: true }
};
