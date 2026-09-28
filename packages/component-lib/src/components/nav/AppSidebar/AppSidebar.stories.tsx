import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import { SidebarProvider } from '@cbt-bo/component-lib/components/ui/sidebar';
import { NAV_ITEMS } from '@cbt-bo/component-lib/lib/nav-items.mocks';

import AppSidebar from '.';

const meta = {
  title: 'Nav/AppSidebar',
  component: AppSidebar,
  tags: ['!autodocs'],
  args: {
    items: NAV_ITEMS,
    activeKey: 'dashboard',
    renderLink: (item, children) => <a href={item.path}>{children}</a>
  },
  parameters: { layout: 'fullscreen' }
} satisfies Meta<typeof AppSidebar>;

export default meta;

type TStory = StoryObj<typeof meta>;

const renderExpanded: TStory['render'] = args => (
  <SidebarProvider>
    <AppSidebar {...args} />
  </SidebarProvider>
);

const renderCollapsed: TStory['render'] = args => (
  <SidebarProvider defaultOpen={false}>
    <AppSidebar {...args} />
  </SidebarProvider>
);

export const Expanded: TStory = {
  render: renderExpanded
};

export const ExpandedGroupDocked: TStory = {
  args: { activeKey: 'games' },
  render: renderExpanded
};

export const Collapsed: TStory = {
  render: renderCollapsed
};

export const CollapsedPopover: TStory = {
  args: { activeKey: 'players' },
  parameters: { docs: { story: { autoplay: true } } },
  render: renderExpanded,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Close sidebar' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Player' }));
  }
};
