import type { Meta, StoryObj } from '@storybook/react-vite';
import { Sparkles } from 'lucide-react';
import type { ReactElement } from 'react';

import { SidebarProvider } from '@cbt-bo/component-lib/components/ui/sidebar';

import BrandLogo from '.';

const meta = {
  title: 'Header/BrandLogo',
  component: BrandLogo,
  tags: ['!autodocs'],
  args: {
    icon: <Sparkles className="size-5" />,
    brandName: 'FUNaloMAX'
  },
  argTypes: {
    brandName: {
      control: 'text',
      description: 'Shown beside the icon while the sidebar rail is expanded'
    }
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story: () => ReactElement) => (
      <div className="flex items-center bg-sidebar p-4 text-sidebar-foreground">
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof BrandLogo>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Expanded: TStory = {
  decorators: [
    (Story: () => ReactElement) => (
      <SidebarProvider className="min-h-0 w-fit">
        <Story />
      </SidebarProvider>
    )
  ]
};

export const Collapsed: TStory = {
  decorators: [
    (Story: () => ReactElement) => (
      <SidebarProvider defaultOpen={false} className="min-h-0 w-fit">
        <Story />
      </SidebarProvider>
    )
  ]
};
