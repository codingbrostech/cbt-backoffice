import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';

import ThemeToggle from '.';

const meta = {
  title: 'Header/ThemeToggle',
  component: ThemeToggle,
  tags: ['!autodocs'],
  args: {
    theme: 'light',
    lightLabel: 'Switch to light mode',
    darkLabel: 'Switch to dark mode',
    onThemeChange: fn()
  },
  argTypes: {
    theme: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Shows the moon icon in light mode and the sun icon in dark mode'
    }
  },
  decorators: [
    Story => (
      <div className="flex items-center gap-3 bg-sidebar p-4 text-sidebar-foreground">
        <Story />
      </div>
    )
  ],
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleThemeChange = (theme: 'light' | 'dark') => {
      updateArgs({ theme });
      args.onThemeChange(theme);
    };

    return <ThemeToggle {...args} onThemeChange={handleThemeChange} />;
  }
} satisfies Meta<typeof ThemeToggle>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const Dark: TStory = {
  args: { theme: 'dark' }
};
