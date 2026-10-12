import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarProvider
} from '@cbt-bo/component-lib/components/ui/sidebar';
import { PLAYER_NAV_ITEMS } from '@cbt-bo/component-lib/lib/nav-items.mocks';

import NavMenuList from '.';

const GROUP_HEADER_SELECTOR = 'button[aria-expanded]';

const meta = {
  title: 'Nav/NavMenuList',
  component: NavMenuList,
  tags: ['!autodocs'],
  args: {
    items: PLAYER_NAV_ITEMS,
    activeKey: 'player-labels',
    renderLink: (item, children) => <a href={item.path}>{children}</a>
  },
  decorators: [
    Story => (
      <SidebarProvider>
        <Sidebar collapsible="none" className="w-64">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <Story />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )
  ]
} satisfies Meta<typeof NavMenuList>;

export default meta;

type TStory = StoryObj<typeof meta>;

export const Default: TStory = {};

export const GroupExpandedHover: TStory = {
  parameters: { pseudo: { hover: GROUP_HEADER_SELECTOR } }
};

export const GroupCollapsedHover: TStory = {
  parameters: {
    pseudo: { hover: GROUP_HEADER_SELECTOR },
    docs: { story: { autoplay: true } }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Player Mgmt' }));
  }
};
