import type { Meta, StoryObj } from '@storybook/react-vite';
import { PencilIcon } from 'lucide-react';
import { expect, userEvent, within } from 'storybook/test';

import { TooltipProvider } from '@cbt-bo/component-lib/components/ui/tooltip';

import IconButton from '.';

const meta = {
  title: 'Button/IconButton',
  component: IconButton,
  args: {
    type: 'button',
    label: 'Edit',
    variant: 'default',
    disabled: false,
    children: <PencilIcon />
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'muted', 'destructive-muted', 'ghost']
    },
    size: {
      control: 'select',
      options: ['icon', 'icon-xs']
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left']
    }
  },
  parameters: {
    layout: 'centered',
    controls: { exclude: ['children'] }
  },
  render: args => (
    <TooltipProvider>
      <IconButton {...args} />
    </TooltipProvider>
  )
} satisfies Meta<typeof IconButton>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Edit' });

    await userEvent.hover(button);

    await expect(await within(document.body).findByRole('tooltip')).toHaveTextContent('Edit');
  }
};

export const Outline: TStory = {
  args: { variant: 'outline' }
};

export const Disabled: TStory = {
  args: { disabled: true }
};
